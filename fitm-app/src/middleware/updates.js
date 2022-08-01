const db = require("../models");
const Gym = db.gym;
const { getValidationErrors } = require("../utils");
const updates = async (req, res, next) => {
  const id = req.params.id;
  console.log("Gym id: ", id);
  console.log("BODY: ", JSON.stringify(req.body));
  try {
    const updatedGym = await Gym.update(JSON.stringify(req.body), {
      where: {
        id: id,
      },
    });
    return next();
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

module.exports = updates;
