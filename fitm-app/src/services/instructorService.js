const db = require("../models");
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

const getFoods = async (search) => {
  try {
    let foods = await FoodInfo.findAll();

    if (search) {
      foods = foods.filter((food) => {
        return food.name.startsWith(search);
      });
    }

    if (foods.length === 0) {
      throw {
        status: 404,
        message: "No foods in the database",
      };
    }
    return foods;
  } catch (err) {
    throw err;
  }
};

const insertMandatoryRecords = async () => {
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
  } catch (err) {
    throw err;
  }
};
const createMealPlan = async (instructorId, clientId, name) => {
  const t = await db.sequelize.transaction().catch((err) => {
    throw { status: 500, message: `TRANSACTION ERROR: ${err}` };
  });
  try {
    const mealPlan = await MealPlan.create(
      { name: name, fitnessInstructorId: instructorId },
      { transaction: t }
    );

    await Client.update(
      { mealPlanId: mealPlan.id },
      { where: { id: clientId }, transaction: t }
    );
    const meals = await MealType.findAll();
    const daysOfWeek = await DayOfWeek.findAll();

    for (const day of daysOfWeek) {
      const eatingDay = await EatingDay.create(
        { mealPlanId: mealPlan.id, dayOfWeekId: day.id },
        { transaction: t }
      );
      for (const meal of meals) {
        await Meal.create(
          { eatingDayId: eatingDay.id, mealTypeId: meal.id },
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
const createRoutine = async (instructorId, name) => {
  try {
    const routine = await Routine.create({
      name: name,
      fitnessInstructorId: instructorId,
    });
    return routine;
  } catch (err) {
    throw err;
  }
};
const getYourRoutines = async (instructorId) => {
  try {
    const collection = await Routine.findAll({
      where: {
        fitnessInstructorId: instructorId,
      },
    });

    return collection;
  } catch (err) {
    throw err;
  }
};
const createWorkout = async (name, routineId, dayOfWeekId, workoutTypeId) => {
  try {
    const workout = await Workout.create({
      name: name,
      routineId: routineId,
      dayOfWeekId: dayOfWeekId,
      workoutTypeId: workoutTypeId,
    });

    return workout;
  } catch (err) {
    throw err;
  }
};
const getWorkouts = async (routineId) => {
  try {
    const workouts = await Workout.findAll({ where: { routineId: routineId } });
    return workouts;
  } catch (err) {
    throw err;
  }
};
const addExerciseToWorkout = async (sets, reps, exerciseId, workoutId) => {
  try {
    const record = await ExerciseHasWorkout.create({
      sets: sets,
      reps: reps,
      exerciseId: exerciseId,
      workoutId: workoutId,
    });

    return record;
  } catch (err) {
    throw err;
  }
};
const getAllExercises = async () => {
  try {
    const collection = await Exercise.findAll({
      attributes: ["id", "name"],
      include: [
        { model: MuscleGroup, attributes: [["name", "muscleGroup"]] },
        { model: Image, attributes: ["path"] },
      ],
    });

    return collection;
  } catch (err) {
    throw err;
  }
};
const getRoutine = async (routineId, instructorId) => {
  try {
    const foundRoutine = await Routine.findOne({
      where: { fitnessInstructorId: instructorId, id: routineId },
      include: [
        {
          model: Workout,
          include: [
            {
              model: Exercise,
              attributes: ["name"],
              include: [
                { attributes: ["path"], model: Image },
                { attributes: ["name"], model: MuscleGroup },
              ],
            },
          ],
        },
      ],
    });

    if (!foundRoutine) {
      throw { status: 404, message: "Not Found" };
    }

    return foundRoutine;
  } catch (err) {
    throw err;
  }
};
const getDashboardData = async (userId, instructorId) => {
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

    const clients = await Client.findAll({
      attributes: ["fitness_level", "weight", "userId"],
      where: {
        fitnessInstructorId: instructorId,
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

    return {
      userData,
      clients,
    };
  } catch (err) {
    throw err;
  }
};
const getYourClients = async (instructorId) => {
  try {
    const clients = await Client.findAll({
      where: {
        fitnessInstructorId: instructorId,
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
      throw {
        status: 404,
        message: "You don't have clients!",
      };
    }

    return clients;
  } catch (err) {
    throw err;
  }
};
const editClient = async (
  instructorId,
  clientId,
  routineId,
  fitnessLevelId
) => {
  try {
    const client = await Client.findOne({
      where: { id: clientId },
    });
    if (client.fitnessInstructorId !== instructorId) {
      throw { status: 400, message: "This is not your client!" };
    }

    const updatedClient = await client.update(
      { routineId: routineId, fitness_level: fitnessLevelId },
      { where: { id: clientId } }
    );
    return updatedClient;
  } catch (err) {
    throw err;
  }
};
const deleteExerciseFromWorkout = async (exerciseHasWorkoutId) => {
  try {
    await ExerciseHasWorkout.destroy({ where: { id: exerciseHasWorkoutId } });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getFoods,
  insertMandatoryRecords,
  createMealPlan,
  createRoutine,
  getYourRoutines,
  createWorkout,
  getWorkouts,
  addExerciseToWorkout,
  getAllExercises,
  getRoutine,
  getDashboardData,
  getYourClients,
  editClient,
  deleteExerciseFromWorkout,
};
