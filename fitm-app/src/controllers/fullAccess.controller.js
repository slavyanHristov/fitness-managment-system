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

exports.getAllGyms = async (req, res) => {
  const allGyms = await Gym.findAll({
    attributes: ["id", "name", "size", "open_at", "closed_at", "monthly_cost"],
    include: gymInnerJoins,
  });
  try {
    if (!allGyms) {
      return res.status(404).json({
        success: false,
        message: "There are no gyms in the database!",
      });
    }
    return res.status(200).json({
      success: true,
      collection: allGyms,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getOneGym = async (req, res) => {
  const id = req.params.id;
  const foundGym = await Gym.findOne({
    where: {
      id: id,
    },
    include: gymInnerJoins,
  });

  try {
    if (!foundGym) {
      return res.status(404).json({
        success: false,
        message: "Gym not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Gym has been found!",
      foundGym,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllInstructors = async (req, res) => {
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
      return res.status(404).json({
        success: false,
        message: "Couldn't find instructors.",
      });
    }
    return res.status(200).json({
      success: true,
      collection: instructors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDataCount = async (req, res) => {
  try {
    const routinesCount = await Routine.count();
    const gymsCount = await Gym.count();
    const instructorsCount = await FitnessInstructor.count();

    return res.status(200).json({
      success: true,
      routinesCount: routinesCount,
      gymsCount: gymsCount,
      instructorsCount: instructorsCount,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
