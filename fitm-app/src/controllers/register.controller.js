const db = require("../models");
const registerService = require("../services/registerService");
const { getValidationErrors } = require("../utils");

// -------------- Create Admin --------------

exports.createAdmin = async (req, res) => {
  const { name, username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    const newAdmin = await registerService.createUser(
      name,
      username,
      password,
      email,
      1
    );
    console.log(newAdmin);
    return res.status(201).json({
      succes: true,
      message: "Successfully registered an admin!",
      newAdmin,
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
      succes: false,
      message: err.message,
    });
  }
};

// -------------- Create Manager --------------

exports.registerManager = async (req, res) => {
  const { name, username, password, email, phone, salary } = req.body;

  if (!username || !password || !email || !name || !salary) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  try {
    const { newUser, newManager } = await registerService.registerManager(
      name,
      username,
      password,
      email,
      phone,
      salary
    );
    return res.status(200).json({
      succes: true,
      message: "Successfully registered a manager!",
      newManager: {
        ...newManager.toJSON(),
        ...newUser.toJSON(),
      },
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

// -------------- Create Client --------------

exports.registerClient = async (req, res) => {
  const {
    name,
    username,
    password,
    email,
    age,
    height,
    weight,
    sex,
    fitnessGoal,
    fitnessLevel,
    activityLevel,
    country,
    city,
    address,
    phone,
  } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !name ||
    !age ||
    !height ||
    !weight ||
    !sex ||
    !activityLevel ||
    !fitnessGoal ||
    !fitnessLevel ||
    !country ||
    !city ||
    !address ||
    !phone
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }

  try {
    const client = await registerService.registerClient(
      name,
      username,
      password,
      email,
      age,
      height,
      weight,
      sex,
      fitnessGoal,
      fitnessLevel,
      activityLevel,
      country,
      city,
      address,
      phone
    );
    return res.status(200).json({
      succes: true,
      message: "Successfully registered a client!",
      client: client,
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

// -------------- Create Gym --------------

exports.createGym = async (req, res) => {
  const {
    gymName,
    monthlyCost,
    size,
    openAt,
    closedAt,
    phone,
    country,
    city,
    address,
    managerId,
    description,
  } = req.body;

  if (
    !gymName ||
    !openAt ||
    !closedAt ||
    !monthlyCost ||
    !country ||
    !city ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    const gym = await registerService.registerGym(
      gymName,
      monthlyCost,
      size,
      openAt,
      closedAt,
      phone,
      country,
      city,
      address,
      managerId,
      description,
      req.files
    );
    return res.json({
      success: true,
      message: "Successfully created a gym!",
      gym,
    });
  } catch (err) {
    if (err instanceof db.Sequelize.ValidationError) {
      return res.status(400).json({
        success: false,
        message: "Incorrect input!",
        errors: getValidationErrors(err.errors),
      });
    }
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message,
    });
  }
};

// -------------- Create Fitness Instructor --------------

exports.registerInstuctor = async (req, res) => {
  const {
    username,
    password,
    email,
    name,
    salary,
    shift_start,
    shift_end,
    phone,
    gymId,
  } = req.body;

  try {
    const newEmployee = await registerService.registerInstuctor(
      username,
      password,
      email,
      name,
      salary,
      shift_start,
      shift_end,
      phone,
      gymId
    );
    return res.json({
      success: true,
      message: "Successfully created instructor!",
      fitness_instructor: newEmployee,
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

exports.registerEmployee = async (req, res) => {
  const { name, salary, position, shift_start, shift_end, phone, gymId } =
    req.body;

  if (
    !name ||
    !salary ||
    !position ||
    !shift_start ||
    !shift_end ||
    !phone ||
    !gymId
  ) {
    return res.status(400).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    const newEmployee = await registerService.registerEmployee(
      name,
      salary,
      position,
      shift_start,
      shift_end,
      phone,
      gymId
    );
    return res.json({
      success: true,
      message: "Successfully created an employee!",
      employee: newEmployee,
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
