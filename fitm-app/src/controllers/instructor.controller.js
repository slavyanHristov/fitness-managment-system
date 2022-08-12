const db = require("../models");
const { getValidationErrors, flatten } = require("../utils");
const FoodInfo = db.food_info;
const FoodType = db.food_type;
const MealPlan = db.meal_plan;
const EatingDay = db.eating_day;
const MealType = db.meal_type;
const Meal = db.meal;
const DayOfWeek = db.day_of_week;
const Client = db.client;

const Routine = db.routine;
const MuscleGroup = db.muscle_group;
const ExerciseType = db.exercise_type;
const Exercise = db.exercise;
const Workout = db.workout;
const WorkoutType = db.workout_type;
const Image = db.image;
const ExerciseHasWorkout = db.exercise_has_workout;
const User = db.user;

exports.getFoods = async (req, res) => {
  const { search } = req.query;
  try {
    let foods = await FoodInfo.findAll();

    if (search) {
      foods = foods.filter((food) => {
        return food.name.startsWith(search);
      });
    }

    if (foods.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No foods in the database",
      });
    }

    return res.status(200).json({
      success: true,
      foods,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ------------- Post food to meal section (Create Meal_Food record) -------------

// ------------- Get all foods which are posted by instructor in meals -------------

// ------------- Post meal with foods into eating day (Create Eating_Day_Meal_Has_Food record) -------------

exports.testingBulk = async (req, res) => {
  try {
    const images = await Image.bulkCreate([
      {
        type: "image/png",
        name: "shoulder-press.png",
        path: "resources/images/shoulder-press.png",
      },
      {
        type: "image/png",
        name: "jump-ups.png",
        path: "resources/images/jump-ups.png",
      },
      {
        type: "image/png",
        name: "pull-ups.png",
        path: "resources/images/pull-ups.png",
      },
      {
        type: "image/png",
        name: "pork-steak.png",
        path: "resources/images/pork-steak.png",
      },
      {
        type: "image/png",
        name: "apple.png",
        path: "resources/images/apple.png",
      },
      {
        type: "image/png",
        name: "banana.png",
        path: "resources/images/banana.png",
      },
    ]);

    console.log("IMAGES: ", images);

    await MuscleGroup.bulkCreate([
      {
        name: "Shoulders",
      },
      {
        name: "Chest",
      },
      {
        name: "Back",
      },
      {
        name: "Legs",
      },
      {
        name: "Arms",
      },
    ]);

    await ExerciseType.bulkCreate([
      {
        name: "Muscle-Bulding",
      },
      {
        name: "Cardio-vascular",
      },
      {
        name: "Wellness",
      },
    ]);

    await Exercise.bulkCreate([
      {
        name: "Shoulder Press",
        muscleGroupId: 1,
        exerciseTypeId: 1,
        imageId: images[0].id,
      },
      {
        name: "Jump-ups",
        muscleGroupId: 4,
        exerciseTypeId: 2,
        imageId: images[1].id,
      },
      {
        name: "Pull Ups",
        muscleGroupId: 3,
        exerciseTypeId: 3,
        imageId: images[2].id,
      },
    ]);

    await WorkoutType.bulkCreate([
      {
        name: "Yoga",
      },
      {
        name: "Stretching",
      },
      {
        name: "Aerobic",
      },
      {
        name: "Anaerobic",
      },
    ]);
    await DayOfWeek.bulkCreate([
      {
        name: "Monday",
      },
      {
        name: "Tuesday",
      },
      {
        name: "Wednesday",
      },
      {
        name: "Thursday",
      },
      {
        name: "Friday",
      },
    ]);

    await MealType.bulkCreate([
      {
        name: "Breakfast",
      },
      {
        name: "Lunch",
      },
      {
        name: "Dinner",
      },
      {
        name: "Snack",
      },
    ]);

    await FoodType.bulkCreate([
      {
        name: "Vegetable",
      },
      {
        name: "Fruit",
      },
      {
        name: "Meat",
      },
      {
        name: "Diary Product",
      },
      {
        name: "Cereals",
      },
    ]);

    await FoodInfo.bulkCreate([
      {
        name: "Pork Steak",
        calories: 300,
        protein: 27.5,
        carbohydrates: 36.1,
        fats: 61,
        foodTypeId: 3,
        imageId: images[3].id,
        grams: 100,
      },
      {
        name: "Apple",
        calories: 50,
        protein: 2.5,
        carbohydrates: 16.1,
        fats: 1,
        foodTypeId: 2,
        imageId: images[4].id,
        grams: 100,
      },
      {
        name: "Banana",
        calories: 100,
        protein: 4.5,
        carbohydrates: 26.1,
        fats: 8,
        foodTypeId: 2,
        imageId: images[5].id,
        grams: 100,
      },
    ]);
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
    //TODO: Add Transactions
    const t = await db.sequelize.transaction();
    const mealPlan = await MealPlan.create(
      {
        name: name,
        fitnessInstructorId: req.instructorId,
      },
      {
        transaction: t,
      }
    );

    const updatedClient = await Client.update(
      {
        mealPlanId: mealPlan.id,
      },
      {
        where: {
          id: clientId,
        },
        transaction: t,
      }
    );
    const meals = await MealType.findAll();
    const daysOfWeek = await DayOfWeek.findAll();

    for (const day of daysOfWeek) {
      const eatingDay = await EatingDay.create(
        {
          mealPlanId: mealPlan.id,
          dayOfWeekId: day.id,
        },
        {
          transaction: t,
        }
      );
      for (const meal of meals) {
        await Meal.create(
          {
            eatingDayId: eatingDay.id,
            mealTypeId: meal.id,
          },
          {
            transaction: t,
          }
        );
      }
    }
    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Meal plan successfully created!",
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createRoutine = async (req, res) => {
  const { name } = req.body;

  try {
    const routine = await Routine.create({
      name: name,
      fitnessInstructorId: req.instructorId,
    });

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
    const collection = await Routine.findAll({
      where: {
        fitnessInstructorId: req.instructorId,
      },
    });

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
    const workout = await Workout.create({
      name: name,
      routineId: routineId,
      dayOfWeekId: dayOfWeekId,
      workoutTypeId: workoutTypeId,
    });
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
    const workouts = await Workout.findAll({
      where: {
        routineId: routineId,
      },
    });

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
    const record = await ExerciseHasWorkout.create({
      sets: sets,
      reps: reps,
      exerciseId: exerciseId,
      workoutId: workoutId,
    });

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
    const collection = await Exercise.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: MuscleGroup,
          attributes: [["name", "muscleGroup"]],
        },
        {
          model: Image,
          attributes: ["path"],
        },
      ],
    });

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
    const myRecords = await Routine.findOne({
      where: {
        fitnessInstructorId: req.instructorId,
        id: routineId,
      },
      include: [
        {
          model: Workout,
          include: [
            {
              model: Exercise,
              attributes: ["name"],
              include: [
                {
                  attributes: ["path"],
                  model: Image,
                },
                {
                  attributes: ["name"],
                  model: MuscleGroup,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!myRecords) {
      return res.status(404).json({
        success: false,
        message: "Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      collection: myRecords,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        id: req.id,
      },
      attributes: ["name", "imageId"],
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
      ],
    });

    const clients = await Client.findAll({
      attributes: ["fitness_level", "weight", "userId"],
      where: {
        fitnessInstructorId: req.instructorId,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
          include: [
            {
              model: Image,
              attributes: ["path"],
            },
          ],
        },
      ],
    });

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
    const clients = await Client.findAll({
      where: {
        fitnessInstructorId: req.instructorId,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
          include: [
            {
              model: Image,
              attributes: ["path"],
            },
          ],
        },
      ],
    });

    if (clients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You don't have clients!",
      });
    }

    return res.status(200).json({
      success: true,
      collection: flatten.flattenArrayObjects(clients),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.editClient = async (req, res) => {
  const clientId = req.params.clientId;
  const { routineId, fitnessLevelId } = req.body;
  try {
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });
    console.log("THE CLIENT:", client);
    if (client.fitnessInstructorId !== req.instructorId) {
      return res.status(400).json({
        success: false,
        message: "This is not your client!",
      });
    }

    const updatedClient = await client.update(
      { routineId: routineId, fitness_level: fitnessLevelId },
      {
        where: {
          id: clientId,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Client updated successfully!",
      updatedClient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteExerciseFromWorkout = async (req, res) => {
  const exerciseHasWorkoutId = req.params.id;
  try {
    await ExerciseHasWorkout.destroy({
      where: {
        id: exerciseHasWorkoutId,
      },
    });

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
