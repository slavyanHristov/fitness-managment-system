const db = require("../models");
const instructorService = require("../services/instructorService");
const { getValidationErrors, flatten } = require("../utils");

exports.getFoods = async (req, res) => {
  const { search } = req.query;
  try {
    const foods = await instructorService.getFoods(search);
    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.insertMandatoryRecords = async (req, res) => {
  try {
    await instructorService.insertMandatoryRecords();
    return res.status(200).json({
      success: true,
      message: "Bulk creates complete.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createMealPlan = async (req, res) => {
  const { clientId, name } = req.body;
  try {
    await instructorService.createMealPlan(req.instructorId, clientId, name);
    return res.status(200).json({
      success: true,
      message: "Meal plan successfully created!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createRoutine = async (req, res) => {
  const { name } = req.body;

  try {
    const routine = await instructorService.createRoutine(
      req.instructorId,
      name
    );
    return res.status(200).json({
      success: true,
      message: "Successfully created a routine!",
      routine: routine,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getYourRoutines = async (req, res) => {
  try {
    const collection = await instructorService.getYourRoutines(
      req.instructorId
    );
    return res.status(200).json({
      success: true,
      collection: collection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createWorkout = async (req, res) => {
  const { name, routineId, dayOfWeekId, workoutTypeId } = req.body;
  try {
    const workout = await instructorService.createWorkout(
      name,
      routineId,
      dayOfWeekId,
      workoutTypeId
    );
    return res.status(200).json({
      success: true,
      message: "Successfully created a workout",
      workout: workout,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getWorkouts = async (req, res) => {
  const routineId = req.params.routineId;
  try {
    const workouts = await instructorService.getWorkouts(routineId);
    return res.status(200).json({
      success: true,
      collection: workouts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.addExerciseToWorkout = async (req, res) => {
  const { sets, reps, exerciseId, workoutId } = req.body;

  try {
    const record = await instructorService.addExerciseToWorkout(
      sets,
      reps,
      exerciseId,
      workoutId
    );

    return res.status(200).json({
      success: true,
      message: "Added exercise to workout!",
      record,
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

exports.getAllExercises = async (req, res) => {
  try {
    const collection = await instructorService.getAllExercises();
    return res.status(200).json({
      success: true,
      collection: flatten.flattenArrayObjects(collection),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRoutine = async (req, res) => {
  const routineId = req.params.id;
  try {
    const foundRoutine = await instructorService.getRoutine(
      routineId,
      req.instructorId
    );

    return res.status(200).json({
      success: true,
      collection: foundRoutine,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { userData, clients } = await instructorService.getDashboardData(
      req.id,
      req.instructorId
    );

    return res.status(200).json({
      success: true,
      userData: userData,
      collection: flatten.flattenArrayObjects(clients),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getYourClients = async (req, res) => {
  try {
    const clients = await instructorService.getYourClients(req.instructorId);

    return res.status(200).json({
      success: true,
      collection: flatten.flattenArrayObjects(clients),
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.editClient = async (req, res) => {
  const clientId = req.params.clientId;
  const { routineId, fitnessLevelId } = req.body;
  try {
    const updatedClient = await instructorService.editClient(
      req.instructorId,
      clientId,
      routineId,
      fitnessLevelId
    );
    return res.status(200).json({
      success: true,
      message: "Client updated successfully!",
      updatedClient,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteExerciseFromWorkout = async (req, res) => {
  const exerciseHasWorkoutId = req.params.id;
  try {
    await instructorService.deleteExerciseFromWorkout(exerciseHasWorkoutId);
    return res.status(200).json({
      success: true,
      message: "Exercise removed from workout.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
