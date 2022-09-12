const db = require("../models");
const fs = require("fs");
const path = require("path");
const tokenService = require("./tokenService");
const Image = db.image;
const User = db.user;
const Manager = db.manager;
const Client = db.client;
const FitnessInstructor = db.fitness_instructor;
const Employee = db.employee;
const Gym = db.gym;
const Token = db.token;
const UserType = db.user_type;
const uploadsPath = "/resources/static/assets/uploads/";
const { hashOperations } = require("../utils");

const getUserDataByRole = async (user) => {
  let foundUser = null;
  switch (user.userTypeId) {
    case 2:
      foundUser = await Manager.findOne({
        attributes: ["salary", "phone"],
        where: {
          userId: user.id,
        },
        include: [
          {
            model: User,
            attributes: ["id", "name", "username", "email", "userTypeId"],
            include: [
              {
                model: Image,
                attributes: ["path"],
              },
              {
                model: UserType,
                attributes: [["name", "userType"]],
              },
            ],
          },
        ],
      });
      break;
    case 3:
      let instructor = await FitnessInstructor.findOne({
        where: {
          userId: user.id,
        },
      });

      foundUser = await Employee.findOne({
        attributes: ["salary", "phone"],
        where: {
          fitnessInstructorId: instructor.id,
        },
        include: [
          {
            model: FitnessInstructor,
            attributes: ["userId"],
            include: [
              {
                model: User,
                attributes: ["name", "username", "email", "userTypeId"],
                include: [
                  { model: Image, attributes: ["path"] },
                  { model: UserType, attributes: [["name", "userType"]] },
                ],
              },
            ],
          },
          { model: Gym, attributes: [["name", "gym"]] },
        ],
      });

      break;
    case 4:
      foundUser = await Client.findOne({
        attributes: [
          "sex",
          "phone",
          "calories",
          "fitness_level",
          "fitness_goal",
        ],
        where: {
          userId: user.id,
        },
        include: [
          {
            model: User,
            attributes: ["id", "name", "username", "email", "userTypeId"],
            include: [
              {
                model: Image,
                attributes: ["path"],
              },
              {
                model: UserType,
                attributes: [["name", "userType"]],
              },
            ],
          },
        ],
      });
      break;
    default:
      break;
  }
  return foundUser;
};

const getUserData = async (userId) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "name", "username", "email", "userTypeId"],
      where: {
        id: userId,
      },
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
        {
          model: UserType,
          attributes: [["name", "userType"]],
        },
      ],
    });
    if (user.userTypeId !== 1) {
      const foundUser = await getUserDataByRole(user);
      return foundUser;
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const getUserImage = async (userId) => {
  try {
    const userImage = await User.findOne({
      attributes: ["imageId"],
      where: {
        id: userId,
      },
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
      ],
    });

    return userImage;
  } catch (err) {
    throw err;
  }
};
const resetPasswordRequest = async (userEmail) => {
  try {
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });

    if (!user) {
      throw {
        status: 404,
        message: "Email entered is wrong or user doesn't exist!",
      };
    }
    const link = await tokenService.createResetPasswordToken(user);
    return link;
  } catch (err) {
    throw err;
  }
};

const changeProfilePicture = async (userId, fileToBeUploaded) => {
  try {
    //UPLOAD NEW IMAGE IN DATABASE
    const newProfilePicture = await Image.create({
      type: fileToBeUploaded.mimetype,
      name: fileToBeUploaded.originalname,
      path: `resources/uploads/${fileToBeUploaded.filename}`,
    });
    // FIND THE CURRENT LOGGED IN USER
    const userWithOldPic = await User.findOne({
      where: {
        id: userId,
      },
    });
    // REPLACE THE OLD IMAGE ID WITH THE NEWLY UPLOADED IMAGE'S ID
    await User.update(
      {
        imageId: newProfilePicture.id,
      },
      {
        where: {
          id: userId,
        },
      }
    );
    // IF THE USER'S PROFILE PICTURE ISN'T THE DEFAULT ONE
    if (userWithOldPic.imageId !== 1) {
      // FIND HIS CURRENT PROFILE PICTURE
      const oldPicture = await Image.findOne({
        where: {
          id: userWithOldPic.imageId,
        },
      });
      // DELETE IT FROM THE FILE SYSTEM
      fs.unlink(
        __basedir + uploadsPath + path.basename(oldPicture.path),
        (err) => {
          if (err) throw err;
          console.log("Old profile picture has been deleted!");
        }
      );
      // DELETE IT FROM THE DATABASE
      await Image.destroy({
        where: {
          id: oldPicture.id,
        },
      });
    }
    return newProfilePicture;
  } catch (err) {
    throw err;
  }
};

const newPassword = async (userEmail, token, newPassword) => {
  try {
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });
    if (!user) {
      throw new Error("Provided user doesn't exist!");
    }

    let passwordResetToken = await Token.findOne({
      where: {
        userId: user.id,
        token_type: 1,
      },
    });

    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token!");
    }

    const isValid = await hashOperations.compare(
      token,
      passwordResetToken.token
    );
    if (!isValid) {
      throw new Error("Invalid or expired password reset token!");
    }
    await user.update({
      password: newPassword,
    });
    await passwordResetToken.destroy();
  } catch (err) {
    throw err;
  }
};

const getNewUser = async (userId) => {
  try {
    const newUser = await User.findOne({
      where: {
        id: userId,
        isFinalized: false,
      },
    });
    if (!newUser) {
      throw {
        status: 404,
        message: "New user doesn't exist or isn't found.",
      };
    }
    return newUser;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getUserDataByRole,
  getUserData,
  getUserImage,
  changeProfilePicture,
  resetPasswordRequest,
  newPassword,
  getNewUser,
};
