const db = require("../models");
const {
  hashOperations,
  getValidationErrors
} = require("../utils");
const {
  JWT_SECRET,
  JWT_EXPIRATION,
} = require("../../config/config");
const User = db.user;
const Manger = db.manager;
const ResetPasswordToken = db.reset_password_token
const RefreshToken = db.refreshToken;
const jwt = require("jsonwebtoken");

exports.authenticateUser = async (req, res) => {
  const {
    username,
    password,
    rememberUser
  } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  const user = await User.findOne({
    where: {
      username,
    },
  });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Username or password doesn't match!",
    });
  }
  try {
    if (await hashOperations.compare(password, user.password)) {
      const token = jwt.sign({
        id: user.id
      }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
      });
      if (rememberUser) {
        let refreshToken = await RefreshToken.createToken(user);
        const currDate = new Date(2147483647 * 1000)
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          expires: currDate
        })
      }
      // res.cookie("accessToken", token, {
      //   httpOnly: true,
      //   maxAge: 100000
      // })
      return res.json({
        userId: user.id,
        username: user.username,
        userType: user.userTypeId,
        remember: rememberUser,
        accessToken: token,
        // refreshToken: refreshToken,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Username or password doesn't match!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  // const {
  //   refreshToken: requestToken
  // } = req.body;


  try {
    const refToken = req.cookies['refreshToken']

    if (refToken == null) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token is required!",
      });
    }

    let refreshToken = await RefreshToken.findOne({
      where: {
        token: refToken
      },
    });
    console.log(refreshToken);
    if (!refreshToken) {
      res.status(403).json({
        success: false,
        message: "Refresh token is not in database!",
      });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({
        where: {
          id: refreshToken.id
        }
      });
      res.cookie('refreshToken', '', {
        maxAge: 0
      })
      return res.status(403).json({
        success: false,
        message: "Refresh token has expired. Please make a new signin request",
      });
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({
      id: user.id
    }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    // res.cookie('accessToken', newAccessToken, {
    //   httpOnly: true,
    //   maxAge: 61
    // })
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

exports.logout = async (req, res) => {

  try {
    const refToken = req.cookies['refreshToken']
    if (refToken) {
      await RefreshToken.destroy({
        where: {
          token: refToken
        }
      })
      res.cookie('refreshToken', '', {
        maxAge: 0
      })
    }
    return res.status(200).json({
      success: true,
      message: "Successfully logged out!"
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })

  }
}

exports.resetPasswordRequest = async (req, res) => {
  const {
    email
  } = req.body
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Empty field!"
      })
    }

    const user = await User.findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email entered is wrong or user doesn't exist!"
      })
    }

    // const link = await passwordReset.requestPasswordReset(user)
    const link = await ResetPasswordToken.createToken(user)

    return res.status(200).json({
      success: true,
      link: link,
      message: "Mail with reset password link has been sent to you!"
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}

exports.newPassword = async (req, res) => {
  const {
    email,
    token,
    newPassword
  } = req.body

  try {
    // const passwordResetService = await passwordReset.changePassword(email, token, password)


    const user = await User.findOne({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new Error("Provided user doesn't exist!")
    }

    let passwordResetToken = await ResetPasswordToken.findOne({
      where: {
        userId: user.id
      }
    })

    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token!")
    }

    const isValid = await hashOperations.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token!")
    }
    // const hashedPassword = await hashOperations.hashSecret(newPassword)
    await user.update({
      password: newPassword
    })
    await passwordResetToken.destroy()


    return res.status(200).json({
      success: true,
      message: "Password has been reset!"
    })
  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors)
      })
    }

    return res.status(500).json({
      success: false,
      message: err.message
    })
  }

}

exports.finalizeAccount = async (req, res) => {
  const {
    userId,
    name,
    password
  } = req.body

  try {
    if (!userId || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Empty fields"
      })
    }

    const user = await User.findOne({
      where: {
        id: userId
      }
    })
    const manager = await Manger.findOne({
      where: {
        userId: userId
      }
    })
    if (!user || !manager) {
      throw new Error("Couldn't find user")
    }
    // const hashedPassword = await hashOperations.hashSecret(password)
    await user.update({
      password: password
    });
    await manager.update({
      name: name,
      firstLogin: false
    })

    return res.status(200).json({
      success: true,
      message: "Account finalized!"
    })

  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors)
      })
    }
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}