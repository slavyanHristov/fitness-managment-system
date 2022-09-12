const db = require("../models");
const userService = require("../services/userService");
const { getValidationErrors, flatten } = require("../utils");

exports.getUserData = async (req, res) => {
  try {
    const userData = await userService.getUserData(req.id);
    return res.status(200).json({
      success: true,
      message: "User is valid.",
      user: flatten.flattenObject(userData.toJSON()),
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
    const userImage = await userService.getUserImage(req.id);
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
    const link = await userService.resetPasswordRequest(email);
    return res.status(200).json({
      success: true,
      link: link,
      message: "Mail with reset password link has been sent to you!",
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.newPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    await userService.newPassword(email, token, newPassword);
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
    const newProfilePicture = await userService.changeProfilePicture(
      req.id,
      req.file
    );
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
    const newUser = await userService.getNewUser(req.id);
    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};
