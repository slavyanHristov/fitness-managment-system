const db = require("../models");
const env = process.env.NODE_ENV || "development";
const { hashOperations } = require("../utils");
const { JWT_SECRET, JWT_EXPIRATION } = require("../../config/config")[env];
const User = db.user;
const Manger = db.manager;
const FitnessInstructor = db.fitness_instructor;
const Employee = db.employee;
const Membership = db.membership;
const Client = db.client;
const Token = db.token;
const jwt = require("jsonwebtoken");
const tokenService = require("./tokenService");

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

const destroyRefreshToken = async (refreshToken, responseObject) => {
  try {
    await Token.destroy({
      where: {
        token: refreshToken,
      },
    });
    responseObject.cookie("refreshToken", "", {
      maxAge: 0,
    });
  } catch (err) {
    throw err;
  }
};

const authenticateUser = async (
  username,
  password,
  rememberUser,
  responseObject
) => {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw {
        status: 404,
        message: "Username or password doesn't match!",
      };
    }

    const userId = user.id;

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
        const refreshToken = await tokenService.createRefreshToken(user);
        const currDate = new Date(2147483647 * 1000);
        responseObject.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          expires: currDate,
        });
      }
      if (user.userTypeId != 1) {
        let userRole = await checkUserType(user.userTypeId, userId);

        return {
          userId: user.id,
          username: user.username,
          userType: user.userTypeId,
          remember: rememberUser,
          accessToken: token,
          userRole,
        };
      }
      return {
        userId: user.id,
        username: user.username,
        userType: user.userTypeId,
        remember: rememberUser,
        accessToken: token,
      };
    } else {
      throw {
        status: 404,
        message: "Username or password doesn't match!",
      };
    }
  } catch (err) {
    throw err;
  }
};

const refreshToken = async (refToken, responseObject) => {
  try {
    let refreshToken = await Token.findOne({
      where: {
        token: refToken,
        token_type: 2,
      },
    });

    if (!refreshToken) {
      throw {
        status: 403,
        message: "Refresh token is not in database!",
      };
    }

    if (tokenService.verifyExpiration(refreshToken)) {
      await Token.destroy({
        where: {
          id: refreshToken.id,
        },
      });
      responseObject.cookie("refreshToken", "", {
        maxAge: 0,
      });
      throw {
        status: 403,
        message: "Refresh token has expired. Please make a new signin request",
      };
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
    return { newAccessToken, refreshToken };
  } catch (err) {
    throw err;
  }
};

const finalizeAccount = async (userId, name, password) => {
  try {
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
  } catch (err) {
    throw err;
  }
};
module.exports = {
  destroyRefreshToken,
  finalizeAccount,
  refreshToken,
  authenticateUser,
};
