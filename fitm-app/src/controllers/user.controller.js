const db = require("../models");
const fs = require("fs");
const path = require("path");
const Image = db.image;
const User = db.user;
const Manager = db.manager;
const Client = db.client;
const FitnessInstructor = db.fitness_instructor;
const Employee = db.employee;
const Gym = db.gym;
const Token = db.token;
const UserType = db.user_type;
const { getValidationErrors, hashOperations, flatten } = require("../utils");
const uploadsPath = "/resources/static/assets/uploads/";

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

exports.getUserData = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ["id", "name", "username", "email", "userTypeId"],
      where: {
        id: req.id,
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
      return res.status(200).json({
        success: true,
        user: flatten.flattenObject(foundUser.toJSON()),
      });
    }
    return res.status(200).json({
      success: true,
      message: "User is valid.",
      user: flatten.flattenObject(user.toJSON()),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oops. Something went wrong: " + err.message,
    });
  }
};
exports.getUserImage = async (req, res) => {
  try {
    const userId = req.id;
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
    return res.status(200).json({
      success: true,
      userImage,
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

exports.isUserExpired = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User is valid.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oops. Something went wrong: " + err.message,
    });
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Empty field!",
      });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email entered is wrong or user doesn't exist!",
      });
    }
    const link = await Token.createResetPasswordToken(user);

    return res.status(200).json({
      success: true,
      link: link,
      message: "Mail with reset password link has been sent to you!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.newPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
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

    return res.status(200).json({
      success: true,
      message: "Password has been reset!",
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

exports.changeProfilePicture = async (req, res) => {
  try {
    if (req.file === undefined) {
      return res.status(400).json({
        success: false,
        message: "File must be selected!",
      });
    }
    //UPLOAD NEW IMAGE IN DATABASE
    const newProfilePicture = await Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      path: `resources/uploads/${req.file.filename}`,
    });
    // FIND THE CURRENT LOGGED IN USER
    const userWithOldPic = await User.findOne({
      where: {
        id: req.id,
      },
    });
    // REPLACE THE OLD IMAGE ID WITH THE NEWLY UPLOADED IMAGE'S ID
    await User.update(
      {
        imageId: newProfilePicture.id,
      },
      {
        where: {
          id: req.id,
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

    // RETURN THE NEW PROFILE PICTURE AS RESPONSE
    return res.status(200).json({
      success: true,
      message: "Successfully updated your profile picture!",
      profilePicture: newProfilePicture,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getNewUser = async (req, res) => {
  try {
    const newUser = await User.findOne({
      where: {
        id: req.id,
        isFinalized: false,
      },
    });
    if (!newUser) {
      return res.status(200).json({
        success: false,
        message: "Manager doesn't exist or isn't found.",
      });
    }

    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.findUserType = async (typeId) => {
  const userType = await UserType.findOne({
    where: {
      id: typeId,
    },
  });
  return userType;
};
