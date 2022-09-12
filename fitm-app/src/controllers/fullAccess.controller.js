const fullAccessService = require("../services/fullAccessService");

exports.getAllGyms = async (req, res) => {
  try {
    const allGyms = await fullAccessService.getAllGyms();

    console.log("allgyms", allGyms);
    return res.status(200).json({
      success: true,
      collection: allGyms,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message,
    });
  }
};

exports.getOneGym = async (req, res) => {
  const id = req.params.id;
  try {
    const foundGym = await fullAccessService.getOneGym(id);
    return res.status(200).json({
      success: true,
      message: "Gym has been found!",
      foundGym,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err?.message,
    });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await fullAccessService.getAllInstructors();
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
    const { routinesCount, gymsCount, instructorsCount } =
      await fullAccessService.getDataCount();
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
