const db = require("../models");
const { mailSender } = require("../utils");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Gym = db.gym;
const Manager = db.manager;
const Address = db.address;
const City = db.city;
const Country = db.country;
const Image = db.image;
const Employee = db.employee;
const FitnessInstructor = db.fitness_instructor;

const uploadsPath = "/resources/static/assets/uploads/";

const gymInnerJoins = [
  {
    model: Manager,
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
    attributes: ["path"],
    required: true,
  },
];

const managerInnerJoins = [
  {
    model: User,
    attributes: ["name", "username", "email"],
    required: true,
  },
];

const getAllGyms = async () => {
  try {
    const allGyms = await Gym.findAll({
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
        id: gymId, // Condition
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

const deleteGym = async (gymId) => {
  try {
    const foundGym = await Gym.findOne({
      where: {
        gymId,
      },
    });

    if (!foundGym) {
      throw {
        status: 404,
        message: "Gym not found!",
      };
    }

    await foundGym.destroy();
  } catch (err) {
    throw err;
  }
};

const updateGym = async (id, payload, filesArray) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw {
      status: 500,
      message: `TRANSACTION ERROR: ${err}`,
    };
  });

  try {
    await Gym.update(payload, {
      where: {
        id: id,
      },
      transaction: t,
    });

    if (filesArray.length !== 0) {
      const images = filesArray;
      const oldGymImages = await Image.findAll({
        where: {
          gymId: id,
        },
      });
      for (const oldImg of oldGymImages) {
        fs.unlink(
          __basedir + uploadsPath + path.basename(oldImg.path),
          (err) => {
            if (err) throw err;
            console.log("Old gym images have been deleted!");
          }
        );
      }
      await Image.destroy({
        where: {
          gymId: id,
        },
      });
      for (const img of images) {
        await Image.create(
          {
            type: img.mimetype,
            name: img.originalname,
            path: `resources/uploads/${img.filename}`,
            gymId: id,
          },
          { transaction: t }
        );
      }
    }
    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const getAllManagers = async () => {
  try {
    const allManagers = await Manager.findAll({
      include: managerInnerJoins,
    });
    if (allManagers.length === 0) {
      throw {
        status: 404,
        message: "There are no managers in the database!",
      };
    }

    return allManagers;
  } catch (err) {
    throw err;
  }
};

const getOneManager = async (id) => {
  try {
    const foundManager = await Manager.findOne({
      where: {
        id: id, // Condition
      },
      include: managerInnerJoins,
    });

    if (!foundManager) {
      throw {
        status: 404,
        message: "Manager not found!",
      };
    }
  } catch (err) {
    throw err;
  }
};

const sendMailManager = async (sender, recipient, subject, tempPassword) => {
  try {
    const msg = {
      from: `"Fit-M Staff" <${sender}>`, // sender address
      to: `${recipient}`, // list of receivers
      subject: `${subject}`, // Subject line
      text: `You've been hired! First Login Password: ${tempPassword}`, // plain text body
      html: "<b>You've been hired!</b>", // html body
    };

    await mailSender.sendMailEthereal(msg);
  } catch (err) {
    throw err;
  }
};

const getDashboardData = async () => {
  try {
    const gymsCount = await Gym.count();
    const employees = await Employee.findAll({
      attributes: ["id", "name", "position"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          attributes: [["name", "gym"]],
          model: Gym,
        },
        {
          model: FitnessInstructor,
          include: [
            {
              attributes: ["imageId"],
              model: User,
              include: [
                {
                  model: Image,
                  attributes: ["path"],
                },
              ],
            },
          ],
        },
      ],
      limit: 3,
    });

    return { gymsCount, employees };
  } catch (err) {
    throw err;
  }
};

const sendMail = async (recipient, subjectMsg, text) => {
  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: `${recipient}`,
      from: `${EMAIL}`,
      subject: `${subjectMsg}`,
      text: `${text}`,
      html: "<strong>Hello there!</strong>",
    };
    const info = await sgMail.send(msg);
    return info;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getAllGyms,
  getOneGym,
  deleteGym,
  updateGym,
  getAllManagers,
  getOneManager,
  sendMailManager,
  getDashboardData,
  sendMail,
};
