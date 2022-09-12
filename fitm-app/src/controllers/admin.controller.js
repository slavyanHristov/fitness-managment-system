const db = require("../models");
const adminService = require("../services/adminService");

const { getValidationErrors, flatten } = require("../utils");

// -------------- Get all gyms --------------
exports.getAllGyms = async (req, res) => {
  try {
    const allGyms = await adminService.getAllGyms();
    return res.status(200).json({
      success: true,
      allGyms,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get a single Gym --------------
exports.getOneGym = async (req, res) => {
  const id = req.params.id;
  try {
    const foundGym = await adminService.getOneGym(id);
    return res.status(200).json({
      success: true,
      message: "Gym has been found!",
      foundGym,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Delete a Gym --------------
exports.deleteGym = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Provide gym id!",
    });
  }
  try {
    await adminService.deleteGym(id);
    return res.status(200).json({
      success: true,
      message: "Gym has been deleted!",
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Update a Gym --------------
exports.updateGym = async (req, res) => {
  const id = req.params.id;
  try {
    await adminService.updateGym(id, req.body, req.files);
    return res.status(200).json({
      success: true,
      message: "Gym updated successfully!",
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

// -------------- Get All Managers --------------
exports.getAllManagers = async (req, res) => {
  try {
    const allManagers = await adminService.getAllManagers();
    return res.status(200).json({
      success: true,
      allManagers,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message || err,
    });
  }
};

// -------------- Get a Single Manager --------------
exports.getOneManager = async (req, res) => {
  const id = req.params.id;
  try {
    const foundManager = await adminService.getOneManager(id);
    return res.status(200).json({
      success: true,
      message: "Manager has been found!",
      foundManager,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.sendMailManager = async (req, res) => {
  const { sender, recipient, subject, tempPassword } = req.body;

  await adminService.sendMailManager(sender, recipient, subject, tempPassword);

  res.status(200).json({
    success: true,
    message: "Message has been sent!",
  });
};

exports.getDashboardData = async (req, res) => {
  try {
    const { gymsCount, employees } = await adminService.getDashboardData();
    return res.status(200).json({
      success: true,
      count: gymsCount,
      collection: flatten.flattenArrayObjects(employees),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.sendMail = async (req, res) => {
  const { recipient, subjectMsg, text } = req.body;

  try {
    const info = await adminService.sendMail(recipient, subjectMsg, text);
    return res.status(200).json({
      success: true,
      message: "Message has been sent!",
      info,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Oops. Internal Error!",
      error: err.response.body,
    });
  }
};
