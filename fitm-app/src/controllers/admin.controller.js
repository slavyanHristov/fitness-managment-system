const db = require("../models");
const { upload } = require("../middleware");
// const nodemailer = require('nodemailer')
// const sgMail = require("@sendgrid/mail")
// const {
//     SENDGRID_API_KEY,
//     EMAIL
// } = require("../../config/config")
const { mailSender, getValidationErrors } = require("../utils");
const fs = require("fs");
const path = require("path");
const User = db.user;
const Gym = db.gym;
const Manager = db.manager;
const Address = db.address;
const City = db.city;
const Country = db.country;
const Image = db.image;

const uploadsPath = "/resources/static/assets/uploads/";

// TODO: Think of moving this statement to utils directory
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

// -------------- Get all gyms --------------
exports.getAllGyms = async (req, res) => {
  const allGyms = await Gym.findAll({
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
      allGyms,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get a single Gym --------------
exports.getOneGym = async (req, res) => {
  const id = req.params.id;
  const foundGym = await Gym.findOne({
    where: {
      id: id, // Condition
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

// -------------- Delete a Gym --------------
exports.deleteGym = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Provide gym id!",
    });
  }

  const foundGym = await Gym.findOne({
    where: {
      id,
    },
  });

  if (!foundGym) {
    return res.status(404).json({
      success: false,
      message: "Gym not found!",
    });
  }
  try {
    await foundGym.destroy();
    return res.status(200).json({
      success: true,
      message: "Gym has been deleted!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Update a Gym --------------
exports.updateGym = async (req, res) => {
  const id = req.params.id;
  const t = await db.sequelize.transaction().catch((err) => {
    return res.status(500).json({
      success: false,
      message: `TRANSACTION ERROR: ${err}`,
    });
  });
  try {
    //TODO: Maybe move the update in a middle ware and call it before upload
    const updatedGym = await Gym.update(req.body, {
      where: {
        id: id,
      },
      transaction: t,
    });

    console.log("req files:", req.files);

    if (req.files.length !== 0) {
      console.log(req.files);
      const images = req.files;
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
        const newImg = await Image.create(
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

    // if (!updatedGym) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Record not found!",
    //   });
    // }
    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Gym updated successfully!",
    });
  } catch (err) {
    await t.rollback();
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
    const allManagers = await Manager.findAll({
      include: managerInnerJoins,
    });
    if (allManagers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "There are no managers in the database!",
      });
    }
    return res.status(200).json({
      success: true,
      allManagers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get a Single Manager --------------
exports.getOneManager = async (req, res) => {
  const id = req.params.id;
  const foundManager = await Manager.findOne({
    where: {
      id: id, // Condition
    },
    include: managerInnerJoins,
  });

  try {
    if (!foundManager) {
      return res.status(404).json({
        success: false,
        message: "Manager not found!",
      });
    }
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

  const msg = {
    from: `"Fit-M Staff" <${sender}>`, // sender address
    to: `${recipient}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `You've been hired! First Login Password: ${tempPassword}`, // plain text body
    html: "<b>You've been hired!</b>", // html body
  };

  await mailSender.sendMailEthereal(msg);

  res.status(200).json({
    success: true,
    message: "Message has been sent!",
  });
};

exports.sendMail = async (req, res) => {
  const { recipient, subjectMsg, text } = req.body;

  sgMail.setApiKey(SENDGRID_API_KEY);
  try {
    const msg = {
      to: `${recipient}`,
      from: `${EMAIL}`,
      subject: `${subjectMsg}`,
      text: `${text}`,
      html: "<strong>Hello there!</strong>",
    };
    const info = await sgMail.send(msg);
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
