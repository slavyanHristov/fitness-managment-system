const db = require("../models");
const { hashOperations, getValidationErrors } = require("../utils");
const env = process.env.NODE_ENV || "development";
const { JWT_SECRET, JWT_EXPIRATION } = require("../../config/config")[env];
const User = db.user;
const Manger = db.manager;
const FitnessInstructor = db.fitness_instructor;
const Employee = db.employee;
const Membership = db.membership;
const Client = db.client;
const Token = db.token;
const jwt = require("jsonwebtoken");

const checkUserType = async (userTypeId, userId) => {
  let result = null;
  switch (userTypeId) {
    case 2:
      result = await Manger.findOne({
        attributes: ["id"],
        where: {
          userId: userId,
        },
      });
      break;
    case 3:
      result = await FitnessInstructor.findOne({
        attributes: ["id"],
        where: {
          userId: userId,
        },
      });
      break;
    case 4:
      let client = await Client.findOne({
        attributes: ["id"],
        where: {
          userId: userId,
        },
      });
      result = await Membership.findOne({
        attributes: ["status", "clientId"],
        where: {
          clientId: client.id,
        },
      });
      console.log("RESULT::", result);
      if (!result) {
        result = client;
        console.log("RESULT NO MEMBER::", result);
      } else {
        result = { membership: { ...result.toJSON() } };
        console.log("RESULT YES MEMBER::", result);
      }
      break;
  }
  return result;
};

exports.authenticateUser = async (req, res) => {
  const { username, password, rememberUser } = req.body;

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
  const userId = user.id;
  try {
    if (await hashOperations.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_EXPIRATION,
        }
      );
      if (rememberUser) {
        let refreshToken = await Token.createRefreshToken(user);
        const currDate = new Date(2147483647 * 1000);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          expires: currDate,
        });
      }
      if (user.userTypeId != 1) {
        let userRole = await checkUserType(user.userTypeId, userId);

        return res.json({
          userId: user.id,
          username: user.username,
          userType: user.userTypeId,
          remember: rememberUser,
          accessToken: token,
          userRole,
        });
      }
      return res.json({
        userId: user.id,
        username: user.username,
        userType: user.userTypeId,
        remember: rememberUser,
        accessToken: token,
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
  try {
    const refToken = req.cookies["refreshToken"];

    if (refToken == null) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token is required!",
      });
    }

    let refreshToken = await Token.findOne({
      where: {
        token: refToken,
        token_type: 2,
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
    if (Token.verifyExpiration(refreshToken)) {
      Token.destroy({
        where: {
          id: refreshToken.id,
        },
      });
      res.cookie("refreshToken", "", {
        maxAge: 0,
      });
      return res.status(403).json({
        success: false,
        message: "Refresh token has expired. Please make a new signin request",
      });
    }
    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRATION,
      }
    );
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
    const refToken = req.cookies["refreshToken"];
    if (refToken) {
      await Token.destroy({
        where: {
          token: refToken,
        },
      });
      res.cookie("refreshToken", "", {
        maxAge: 0,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully logged out!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.finalizeAccount = async (req, res) => {
  const { userId, name, password } = req.body;

  try {
    if (!userId || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Empty fields",
      });
    }

    const user = await User.findOne({
      where: {
        id: userId,
        isFinalized: false,
      },
    });
    if (!user) {
      throw new Error("Couldn't find user");
    }
    if (user.userTypeId === 3) {
      const instructor = await FitnessInstructor.findOne({
        where: {
          userId: user.id,
        },
      });
      // update the employee name as well
      await Employee.update(
        {
          name: name,
        },
        {
          where: {
            fitnessInstructorId: instructor.id,
          },
        }
      );
    }
    await user.update({
      name: name,
      password: password,
      isFinalized: true,
    });

    return res.status(200).json({
      success: true,
      message: "Account finalized!",
    });
  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
