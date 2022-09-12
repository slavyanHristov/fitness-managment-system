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

const getAssignedGyms = async (managerId) => {
  try {
    const managedGyms = await Gym.findAll({
      where: {
        managerId: managerId,
      },
      attributes: ["id", "name"],
    });
    if (managedGyms.length === 0) {
      throw {
        status: 404,
        message: "There are no gyms in the database!",
      };
    }
    return managedGyms;
  } catch (err) {
    throw err;
  }
};

const getAllEmployees = async (managerId) => {
  try {
    const gymsArray = await getYourGyms(managerId);

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
      throw {
        status: 404,
        message: "Couldn't find employees.",
      };
    }

    return employees;
  } catch (err) {
    throw err;
  }
};

const getOneEmployee = async (managerId) => {
  try {
    const gymsArray = await getYourGyms(managerId);
    const foundEmployee = await Employee.findOne({
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
        id: employeeId,
      },
      include: employeeInnerJoins,
    });
    if (!foundEmployee) {
      throw {
        status: 404,
        message: "Employee not found!",
      };
    }
    return foundEmployee;
  } catch (err) {
    throw err;
  }
};

const deleteEmployee = async (employeeId, managerId) => {
  try {
    const employee = await Employee.findOne({
      where: {
        id: employeeId,
        managerId: managerId,
      },
    });

    if (!employee) {
      throw {
        status: 403,
        message: "Forbidden!",
      };
    }
    await employee.destroy();
  } catch (err) {
    throw err;
  }
};

const updateEmployee = async (managerId, employeeId, payload) => {
  try {
    const gymsArray = await getYourGyms(managerId);
    const updatedEmployee = await Employee.update(payload, {
      where: {
        gymId: {
          [Op.in]: gymsArray,
        },
        id: employeeId,
      },
    });
    if (!updatedEmployee) {
      throw {
        status: 404,
        message: "Record not found!",
      };
    }

    return updatedEmployee;
  } catch (err) {
    throw err;
  }
};

const getAllClients = async (managerId) => {
  try {
    const gymsArray = await getYourGyms(managerId);

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
      throw {
        status: 404,
        message: "You don't have clients in your gyms!",
      };
    }

    return clientsInGym;
  } catch (err) {
    throw err;
  }
};

const getOneClient = async (clientId, managerId) => {
  try {
    const gymsArray = await getYourGyms(managerId);

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
      throw {
        status: 404,
        message: "Client not found!",
      };
    }

    return clientInGyms;
  } catch (err) {
    throw err;
  }
};

const getManager = async (userId) => {
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
      throw {
        status: 404,
        message: "Manager doesn't exist or isn't found.",
      };
    }

    return manager;
  } catch (err) {
    throw err;
  }
};

const getDashboardData = async (userId, managerId) => {
  try {
    const userData = await User.findOne({
      where: {
        id: userId,
      },
      attributes: ["name", "imageId"],
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
      ],
    });

    const employeeCount = await Employee.count({
      col: "managerId",
      where: { managerId: managerId },
    });
    const yourGymsCount = await getYourGyms(managerId);
    const yourGyms = await Gym.findAll({
      attributes: ["id", "name"],
      where: {
        managerId: managerId,
      },
    });
    let gymImage = null;
    if (yourGyms.length !== 0) {
      gymImage = await Image.findOne({
        attributes: ["path"],
        where: {
          gymId: yourGyms[0]?.id,
        },
      });
    }
    const memberships = await Membership.findAll({
      attributes: ["fee"],
      where: {
        gymId: yourGymsCount,
      },
      include: [
        {
          model: Gym,
          attributes: [["name", "gym"]],
        },
        {
          model: Client,
          attributes: ["userId"],
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
        },
      ],
      limit: 3,
    });
    const membershipCount = await Membership.count({
      col: "gymId",
      where: { gymId: yourGymsCount },
    });

    return {
      userData,
      employeeCount,
      membershipCount,
      memberships,
      yourGyms,
      gymImage,
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAssignedGyms,
  getAllEmployees,
  getOneEmployee,
  deleteEmployee,
  updateEmployee,
  getAllClients,
  getOneClient,
  getManager,
  getDashboardData,
};
