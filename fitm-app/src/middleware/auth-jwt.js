const jwt = require("jsonwebtoken");
const {
  Op
} = require("sequelize");
const {
  JWT_SECRET
} = require("../../config/config");
const db = require("../models");
const User = db.user;
const Client = db.client;
const FitnessInstructor = db.fitness_instructor

const {
  TokenExpiredError
} = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized! Access Token has expired!",
    });
  }
  return res.status(401).json({
    success: false,
    message: "Unauthorized!",
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(403).json({
      success: false,
      message: "No token has been provided!",
    });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return catchError(err, res);
    }
    req.id = decodedUser.id
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const admin = await User.findOne({
    where: {
      [Op.and]: [{
        id: req.id
      }, {
        userTypeId: 1 // Admin
      }],
    },
  });
  if (!admin) {
    return res.status(403).json({
      success: false,
      message: "Admin Unauthorized!",
    });
  } else {
    console.log(admin);
    return next();
  }
};

const isManager = async (req, res, next) => {
  const manager = await User.findOne({
    where: {
      [Op.and]: [{
        id: req.id
      }, {
        userTypeId: 2 // Manager
      }],
    },
  });
  if (!manager) {
    return res.status(403).json({
      success: false,
      message: "Manager Unauthorized!",
    });
  } else {
    console.log(manager);
    return next();
  }
};

const isClient = async (req, res, next) => {
  const client = await Client.findOne({
    where: {
      userId: req.id
    },
  });

  if (!client) {
    return res.status(403).json({
      success: false,
      message: "Client Unauthorized!",
    });
  } else {
    console.log(client);
    req.clientId = client.id
    return next();
  }
}

const isInstructor = async (req, res, next) => {
  const instructor = await FitnessInstructor.findOne({
    where: {
      userId: req.id
    },
  });

  if (!instructor) {
    return res.status(403).json({
      success: false,
      message: "Fitness Instructor Unauthorized!",
    });
  } else {
    console.log(instructor);
    req.instructorId = instructor.id
    return next();
  }
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isManager: isManager,
  isClient: isClient,
  isInstructor: isInstructor
};
module.exports = authJwt;