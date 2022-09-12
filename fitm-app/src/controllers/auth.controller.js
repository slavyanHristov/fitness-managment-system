const db = require("../models");
const authService = require("../services/authService");
const { getValidationErrors } = require("../utils");

exports.authenticateUser = async (req, res) => {
  const { username, password, rememberUser } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  try {
    const response = await authService.authenticateUser(
      username,
      password,
      rememberUser,
      res
    );
    return res.status(200).json({
      ...response,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message,
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
    const { newAccessToken, refreshToken } = await authService.refreshToken(
      refToken,
      res
    );
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message || err,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const refToken = req.cookies["refreshToken"];
    if (refToken) {
      await authService.destroyRefreshToken(refToken, res);
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
    await authService.finalizeAccount(userId, name, password);
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
