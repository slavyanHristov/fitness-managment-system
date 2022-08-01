const db = require("../models");
const Employee = db.employee;
const Manager = db.manager;
const Image = db.image;
const Gym = db.gym;
const Membership = db.membership;
const FitnessInstructor = db.fitness_instructor;
const Client = db.client;
const User = db.user;
const Op = db.Sequelize.Op;

const employeeInnerJoins = [
  {
    model: Gym,
    attributes: ["name"],
    required: true,
  },
  {
    model: FitnessInstructor,
    attributes: ["userId"],
    include: [
      {
        model: User,
        attributes: ["name", "username", "email"],
        include: [
          {
            model: Image,
            attributes: ["path"],
          },
        ],
      },
    ],
  },
];

const membershipInnerJoins = [
  {
    model: Client,
    attributes: ["name", "userId"],
    required: true,
    include: [
      {
        model: User,
        attributes: ["username", "email"],
        required: true,
      },
    ],
  },
];

const getYourGyms = async (managerId) => {
  const managedGyms = await Gym.findAll({
    where: {
      managerId: managerId,
    },
    attributes: ["id"],
    raw: true,
  });
  return managedGyms.map((gym) => gym.id);
};

exports.getAssignedGyms = async (req, res) => {
  const managerId = req.params.managerId;
  try {
    if (!managerId) {
      return res.status(404).json({
        success: false,
        message: "Manager not found!",
      });
    }
    const managedGyms = await Gym.findAll({
      where: {
        managerId: managerId,
      },
      attributes: ["id", "name"],
    });
    if (managedGyms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There are no gyms in the database!",
      });
    }
    return res.status(200).json({
      success: true,
      managedGyms,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get all employees associated with your gyms --------------
exports.getAllEmployees = async (req, res) => {
  const gymsArray = await getYourGyms(req.managerId);
  try {
    const employees = await Employee.findAll({
      attributes: [
        "id",
        "name",
        "salary",
        "position",
        "shift_start",
        "shift_end",
        "phone",
      ],
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
      },
      include: employeeInnerJoins,
    });
    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find employees.",
      });
    }
    return res.status(200).json({
      success: true,
      collection: employees,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// -------------- Get single employee associated with your gyms --------------

exports.getOneEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const gymsArray = await getYourGyms(req.managerId);

  const foundEmployee = await Employee.findOne({
    where: {
      gymId: {
        [Op.in]: gymsArray,
      },
      id: employeeId,
    },
    include: employeeInnerJoins,
  });

  try {
    if (!foundEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee has been found!",
      foundEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Delete single instructor associated with your gym --------------
exports.deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: "Provide employee id!",
    });
  }
  console.log(req);
  const employee = await Employee.findOne({
    where: {
      id: employeeId,
      managerId: req.id,
    },
  });

  if (!employee) {
    return res.status(403).json({
      success: false,
      message: "Forbidden!",
    });
  }
  try {
    await employee.destroy();
    return res.status(200).json({
      success: true,
      message: "Employee has been deleted!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Update single instructor associated with your gym --------------

exports.updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const gymsArray = await getYourGyms(req.managerId);

  try {
    const updatedEmployee = await Employee.update(req.body, {
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
        id: employeeId,
      },
    });
    //TODO: THIS IF DOESN'T WORK
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Record not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Employee updated successfully!",
      updatedEmployee,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get all clients associated with your gym --------------

exports.getAllClients = async (req, res) => {
  const gymsArray = await getYourGyms(req.id);

  try {
    const clientsInGym = await Membership.findAll({
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
      },
      attributes: ["clientId"],
      include: membershipInnerJoins,
    });
    if (clientsInGym.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You don't have clients in your gyms!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Clients have been found!",
      clientsInGym,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get single client associated with your gym --------------

exports.getOneClient = async (req, res) => {
  const clientId = req.params.id;
  const gymsArray = await getYourGyms(req.id);

  try {
    const clientInGyms = await Membership.findOne({
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
        clientId: clientId,
      },
      attributes: ["clientId"],
      include: membershipInnerJoins,
    });
    if (!clientInGyms) {
      return res.status(404).json({
        success: false,
        message: "Client not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client has been found!",
      clientInGyms,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getManager = async (req, res) => {
  const userId = req.params.userId;

  try {
    const manager = await Manager.findOne({
      where: {
        userId: userId,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    if (!manager) {
      return res.status(200).json({
        success: false,
        message: "Manager doesn't exist or isn't found.",
      });
    }

    return res.status(200).json({
      success: true,
      manager,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
