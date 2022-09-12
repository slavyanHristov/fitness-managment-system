const db = require("../models");

const Image = db.image;
const Gym = db.gym;
const Address = db.address;
const City = db.city;
const Country = db.country;
const Manager = db.manager;
const User = db.user;
const Employee = db.employee;
const Routine = db.routine;
const FitnessInstructor = db.fitness_instructor;

const gymInnerJoins = [
  {
    model: Manager,
    attributes: ["id"],
    required: true,
    include: [
      {
        model: User,
        attributes: ["name", "username", "email"],
        required: true,
      },
    ],
  },
  {
    model: Address,
    attributes: ["name", "cityId"], // ATTRIBUTES RETURNED
    required: true, // INNER JOIN
    include: [
      {
        model: City,
        attributes: ["name", "countryId"],
        required: true,
        include: [
          {
            model: Country,
            attributes: ["name"],
            required: true,
          },
        ],
      },
    ],
  },
  {
    model: Image,
    attributes: ["path", "gymId"],
    required: true,
  },
];

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

const getAllGyms = async () => {
  try {
    const allGyms = await Gym.findAll({
      attributes: [
        "id",
        "name",
        "size",
        "open_at",
        "closed_at",
        "monthly_cost",
      ],
      include: gymInnerJoins,
    });

    if (!allGyms) {
      throw {
        status: 404,
        message: "There are no gyms in the database!",
      };
    }
    return allGyms;
  } catch (err) {
    throw err;
  }
};

const getOneGym = async (gymId) => {
  try {
    const foundGym = await Gym.findOne({
      where: {
        id: gymId,
      },
      include: gymInnerJoins,
    });

    if (!foundGym) {
      throw {
        status: 404,
        message: "Gym not found!",
      };
    }

    return foundGym;
  } catch (err) {
    throw err;
  }
};

const getAllInstructors = async () => {
  try {
    const instructors = await Employee.findAll({
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
        position: 1, // ENUM KEY 1 => "Fitness Instructor"
      },
      include: employeeInnerJoins,
    });
    if (instructors.length === 0) {
      throw {
        status: 404,
        message: "Couldn't find instructors.",
      };
    }
    return instructors;
  } catch (err) {
    throw err;
  }
};

const getDataCount = async () => {
  try {
    const routinesCount = await Routine.count();
    const gymsCount = await Gym.count();
    const instructorsCount = await FitnessInstructor.count();
    return { routinesCount, gymsCount, instructorsCount };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllGyms,
  getOneGym,
  getAllInstructors,
  getDataCount,
};
