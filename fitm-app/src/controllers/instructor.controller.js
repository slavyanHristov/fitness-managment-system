const db = require("../models");
const { getValidationErrors, flatten } = require("../utils");

const sequelize = db.sequelize;
const Food = db.food;
const FoodType = db.food_type;
const MealPlan = db.meal_plan;
const FitnessInstructor = db.fitness_instructor;
const EatingDay = db.eating_day;
const Meal = db.meal;
const MealHasFood = db.meal_has_food;
const EatingDayHasMeal = db.eatingDay_has_meal;
const DayOfWeek = db.day_of_week;
const Client = db.client;
// -------------- Routine Part --------------
const Routine = db.routine;
const MuscleGroup = db.muscle_group;
const ExerciseType = db.exercise_type;
const Exercise = db.exercise;
const Workout = db.workout;
const WorkoutType = db.workout_type;
const Image = db.image;
const ExerciseHasWorkout = db.exercise_has_workout;
const LogExercise = db.log_exercise;
const ExerciseWorkoutRoutine = db.exercise_workout_routine;
const User = db.user;

// -------------- Create Food record in the system --------------
exports.postFood = async (req, res) => {
  const {
    name,
    calories,
    protein,
    carbohydrates,
    fats,
    quantity, //TODO: should i leave qunatity in Food Table?
    foodTypeId,
  } = req.body;

  if (
    !name ||
    !calories ||
    !protein ||
    !carbohydrates ||
    !fats ||
    !quantity ||
    !foodTypeId
  ) {
    return res.status(401).json({
      success: false,
      message: "Empty fields!",
    });
  }
  try {
    const food = await Food.create({
      name,
      calories,
      protein,
      carbohydrates,
      fats,
      quantity,
      foodTypeId,
    });

    return res.status(200).json({
      success: true,
      message: "Added food to the system successfully!",
      food,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Create Meal_Plan --------------
// exports.createMealPlan = async (req, res) => {
//   const { name, description } = req.body;

//   if (!name) {
//     return res.status(404).json({
//       success: false,
//       message: "Please enter name for the meal plan!",
//     });
//   }

//   const loggedInstructor = await FitnessInstructor.getInstructor(
//     req.instructorId
//   );
//   if (!loggedInstructor) {
//     return res.status(404).json({
//       success: false,
//       message: "Instructor does not exist!",
//     });
//   }

//   try {
//     const mealPlan = await MealPlan.create({
//       name,
//       description,
//       fitnessInstructorId: loggedInstructor.id,
//     });
//     //TODO: After meal plan creation assign it to client, which has chosen you!
//     return res.status(200).json({
//       success: true,
//       message: "Created meal plan successfully!",
//       mealPlan,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// -------------- Create Eating_day --------------
exports.createEatingDay = async (req, res) => {
  const { dayOfWeekId, mealPlanId } = req.body;

  if (!dayOfWeekId || !mealPlanId) {
    return res.status(404).json({
      success: false,
      message: "Please enter day name",
    });
  }

  const loggedInstructor = await FitnessInstructor.getInstructor(
    req.instructorId
  );
  if (!loggedInstructor) {
    return res.status(404).json({
      success: false,
      message: "Instructor does not exist!",
    });
  }

  const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor);
  if (!mealPlan) {
    return res.status(404).json({
      success: false,
      message: "Meal Plan does not exist, or it doesn't belong  to you!",
    });
  }

  try {
    const eatingDay = await EatingDay.create({
      dayOfWeekId,
      mealPlanId,
    });

    return res.status(200).json({
      success: true,
      message: "Created eating day successfully!",
      eatingDay,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// -------------- Get All Meals --------------
exports.getAllMeals = async (req, res) => {
  try {
    const allMeals = await Meal.findAll();

    if (allMeals.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No meals added in the database! Try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      allMeals,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ------------- Get Foods (can search for specific food if search query is added) ---------------
exports.getFoods = async (req, res) => {
  const { search } = req.query;
  try {
    let foods = await Food.findAll();

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
exports.createMealFood = async (req, res) => {
  const { mealId, foodId } = req.body;

  if (!mealId || !foodId) {
    return res.status(404).json({
      success: false,
      message: "Please provide meal and food!",
    });
  }

  try {
    const foundFood = await Food.findFood(foodId);
    const foundMeal = await Meal.findMeal(mealId);
    if (!foundFood || !foundMeal) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find food or meal.",
      });
    }

    const mealHasFood = await MealHasFood.create({
      mealId: foundMeal.id,
      foodId: foundFood.id,
    });

    return res.status(200).json({
      success: true,
      message: "Meal_has_food inserted",
      mealHasFood,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ------------- Get all foods which are posted by instructor in meals -------------
exports.getFoodsInMeals = async (req, res) => {
  try {
    const allFoods = await Meal.findAll({
      include: [
        {
          model: Food,
          attributes: [
            "name",
            "calories",
            "protein",
            "carbohydrates",
            "fats",
            "quantity",
            "foodTypeId",
          ],
          required: false, // Does Outer Join
          include: [
            {
              model: FoodType,
              attributes: ["name"],
              required: true,
            },
          ],
        },
      ],
    });
    return res.status(200).json({
      success: true,
      allFoods,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ------------- Post meal with foods into eating day (Create Eating_Day_Meal_Has_Food record) -------------
exports.postMealFood_EatingDay = async (req, res) => {
  const { mealHasFoodId, eatingDayId } = req.body;

  if (!mealHasFoodId || !eatingDayId) {
    return res.status(404).json({
      success: false,
      message: "Please provide needed data!",
    });
  }

  try {
    const loggedInstructor = await FitnessInstructor.getInstructor(
      req.instructorId
    );
    if (!loggedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor does not exist!",
      });
    }

    const foundMealHasFood = await MealHasFood.findMealHasFood(mealHasFoodId);
    const foundEatingDay = await EatingDay.findEatingDay(eatingDayId); // ?
    if (!foundMealHasFood || !foundEatingDay) {
      return res.status(404).json({
        success: false,
        message: "Couldn't find eating day or meal_has_food record.",
      });
    }

    const eatingDayHasMealFood = await EatingDayHasMealFood.create({
      mealHasFoodId: foundMealHasFood.id,
      eatingDayId: foundEatingDay.id,
    });

    return res.status(200).json({
      success: true,
      message: "EatingDay_Has_MealFood inserted",
      eatingDayHasMealFood,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMealPlan = async (req, res) => {
  const mealPlanId = req.params.mealPlanId;
  try {
    const loggedInstructor = await FitnessInstructor.getInstructor(
      req.instructorId
    );
    if (!loggedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor does not exist!",
      });
    }

    const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor);
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal Plan does not exist, or it doesn't belong  to you!",
      });
    }

    const mealPlanInfo = await EatingDay.findAll({
      where: {
        mealPlanId: mealPlan.id,
      },
      include: [
        {
          model: DayOfWeek,
          attributes: ["name"],
        },
        {
          model: MealHasFood,
          include: [
            {
              model: Meal,
              attributes: ["name"],
            },
            {
              model: Food,
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Done",
      mealPlanInfo,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.testingBulk = async (req, res) => {
  try {
    // const loggedInstructor = await FitnessInstructor.getInstructor(
    //   req.instructorId
    // );
    // if (!loggedInstructor) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Instructor does not exist!",
    //   });
    // }

    // const myMealPlan = await MealPlan.create({
    //   name: "Tommy's Meal Plan",
    //   fitnessInstructorId: loggedInstructor.id,
    // });
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

    await Meal.bulkCreate([
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

    //TODO: Should add images as well
    await Food.bulkCreate([
      {
        name: "Pork Steak",
        calories: 300,
        protein: 27.5,
        carbohydrates: 36.1,
        fats: 61,
        quantity: 1,
        foodTypeId: 3,
        imageId: images[3].id,
      },
      {
        name: "Apple",
        calories: 50,
        protein: 2.5,
        carbohydrates: 16.1,
        fats: 1,
        quantity: 1,
        foodTypeId: 2,
        imageId: images[4].id,
      },
      {
        name: "Banana",
        calories: 100,
        protein: 4.5,
        carbohydrates: 26.1,
        fats: 8,
        quantity: 1,
        foodTypeId: 2,
        imageId: images[5].id,
      },
    ]);

    // await EatingDay.bulkCreate([
    //   {
    //     dayOfWeekId: 1,
    //     mealPlanId: myMealPlan.id,
    //   },
    //   {
    //     dayOfWeekId: 2,
    //     mealPlanId: myMealPlan.id,
    //   },
    //   {
    //     dayOfWeekId: 3,
    //     mealPlanId: myMealPlan.id,
    //   },
    //   {
    //     dayOfWeekId: 4,
    //     mealPlanId: myMealPlan.id,
    //   },
    //   {
    //     dayOfWeekId: 5,
    //     mealPlanId: myMealPlan.id,
    //   },
    // ]);

    // await MealHasFood.bulkCreate([
    //   {
    //     mealId: 1,
    //     foodId: 2,
    //     // eatingDayId: 1
    //   }, // this GameTeam will get id 1
    //   {
    //     mealId: 1,
    //     foodId: 3,
    //     // eatingDayId: 1
    //   }, // this GameTeam will get id 2
    //   {
    //     mealId: 2,
    //     foodId: 1,
    //     // eatingDayId: 1
    //   }, // this GameTeam will get id 3
    //   {
    //     mealId: 2,
    //     foodId: 3,
    //     // eatingDayId: 1
    //   }, // this GameTeam will get id 4
    //   {
    //     mealId: 3,
    //     foodId: 1,
    //     // eatingDayId: 2
    //   }, // this GameTeam will get id 5
    // ]);

    // await EatingDayHasMealFood.bulkCreate([
    //   // In 'Winter Showdown' (i.e. GameTeamIds 3 and 4):
    //   {
    //     eatingDayId: 1,
    //     mealHasFoodId: 1,
    //     // mealPlanId: myMealPlan.id
    //   }, // s0me0ne played for The Martians
    //   {
    //     eatingDayId: 1,
    //     mealHasFoodId: 2,
    //     // mealPlanId: myMealPlan.id
    //   }, // greenhead played for The Martians
    //   {
    //     eatingDayId: 1,
    //     mealHasFoodId: 3,
    //     // mealPlanId: myMealPlan.id
    //   }, // not_spock played for The Plutonians
    //   {
    //     eatingDayId: 1,
    //     mealHasFoodId: 4,
    //     // mealPlanId: myMealPlan.id
    //   }, // bowl_of_petunias played for The Plutonians
    //   {
    //     eatingDayId: 2,
    //     mealHasFoodId: 1,
    //     // mealPlanId: myMealPlan.id
    //   }, // bowl_of_petunias played for The Plutonians
    // ]);
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
    //TODO: FINISH ME
    //TODO: Add Transactions
    //TODO: Verify if client has active membership and his instructr matches your id
    const mealPlan = await MealPlan.create({
      name: name,
      fitnessInstructorId: req.instructorId,
    });

    const updatedClient = await Client.update(
      {
        mealPlanId: mealPlan.id,
      },
      {
        where: {
          id: clientId,
        },
      }
    );
    const meals = await Meal.findAll();
    const daysOfWeek = await DayOfWeek.findAll();

    for (const day of daysOfWeek) {
      const eatingDay = await EatingDay.create({
        mealPlanId: mealPlan.id,
        dayOfWeekId: day.id,
      });
      for (const meal of meals) {
        await EatingDayHasMeal.create({
          eatingDayId: eatingDay.id,
          mealId: meal.id,
        });
      }
    }

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

exports.testingFind = async (req, res) => {
  const clientId = req.params.id;
  try {
    // const myRecords = await EatingDay.findAll({
    //   where: {
    //     mealPlanId: 1,
    //   },
    //   include: [
    //     {
    //       model: DayOfWeek,
    //       attributes: ["name"],
    //     },
    //     {
    //       model: MealHasFood,
    //       include: [
    //         {
    //           model: Meal,
    //           attributes: ["name"],
    //         },
    //         {
    //           model: Food,
    //         },
    //       ],
    //       through: {
    //         attributes: [],
    //       },
    //     },
    //   ],
    // });

    const mealPlan = await Client.findOne({
      attributes: ["id", "mealPlanId"],
      where: {
        id: clientId,
      },
      include: [
        {
          model: MealPlan,
          include: [
            {
              model: EatingDay,
              include: [
                {
                  model: DayOfWeek,
                },
                {
                  model: EatingDayHasMeal,
                  include: [
                    {
                      model: Meal,
                    },
                    {
                      model: Food,
                      include: [
                        {
                          model: FoodType,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      collection: mealPlan,
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
      // attributes: ["id", "name"],
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
// exports.getSingleRoutine = async (req, res) => {
//   const routineId = req.params.id;
//   try {
//     const routine = await Routine.findOne({
//       where: {
//         id: routineId,
//         fitnessInstructorId: req.instructorId,
//       },
//     });

//     if (!routine) {
//       return res.status(404).json({
//         success: false,
//         message: "Routine not found!",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       item: routine,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.createWorkout = async (req, res) => {
  const { name, routineId, dayOfWeekId, workoutTypeId } = req.body;
  try {
    const workout = await Workout.create({
      name: name, // InputField
      routineId: routineId, //TODO: comes from route.params on front-end
      dayOfWeekId: dayOfWeekId, //TODO: Will come from ComboBox
      workoutTypeId: workoutTypeId, //TODO: Will come from ComboBox
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
      //TODO: Image path as well
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
    // const exercises = await ExerciseHasWorkout.findAll({
    //   //attributes
    //   where: {
    //     workoutId: workoutId,
    //   },
    //   //include
    // });
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

exports.testingBulkRoutine = async (req, res) => {
  try {
    const loggedInstructor = await FitnessInstructor.getInstructor(
      req.instructorId
    );
    if (!loggedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor does not exist!",
      });
    }
    // const routine = await Routine.create({
    //   name: "Todd's Fitness Routine",
    //   fitnessInstructorId: loggedInstructor.id, //TODO:req.InstructorId?
    // });

    // TODO: Figure out a way how to have exercise which targets multiple muscle groups

    // await Workout.bulkCreate([
    //   {
    //     name: "Workout Day 1",
    //     weekDayId: 1,
    //     workoutTypeId: 4,
    //     routineId: routine.id,
    //   },
    //   {
    //     name: "Workout Day 2",
    //     weekDayId: 2,
    //     workoutTypeId: 2,
    //     routineId: routine.id,
    //   },
    //   {
    //     name: "Workout Day 3",
    //     weekDayId: 3,
    //     workoutTypeId: 3,
    //     routineId: routine.id,
    //   },
    //   {
    //     name: "Workout Day 4",
    //     weekDayId: 4,
    //     workoutTypeId: 3,
    //     routineId: routine.id,
    //   },
    // ]);

    // await ExerciseHasWorkout.bulkCreate([
    //   {
    //     sets: 4,
    //     reps: 10,
    //     exerciseId: 1,
    //     workoutId: 1,
    //   },
    //   {
    //     sets: 5,
    //     reps: 12,
    //     exerciseId: 2,
    //     workoutId: 1,
    //   },
    //   {
    //     sets: 3,
    //     reps: 8,
    //     exerciseId: 3,
    //     workoutId: 1,
    //   },
    //   {
    //     sets: 4,
    //     reps: 12,
    //     exerciseId: 2,
    //     workoutId: 2,
    //   },
    // ]);

    // //TODO: Exercise_has_workout_has_routine => Bulk_create
    // await ExerciseWorkoutRoutine.bulkCreate([
    //   {
    //     exerciseHasWorkoutId: 1,
    //     routineId: routine.id,
    //   },
    //   {
    //     exerciseHasWorkoutId: 2,
    //     routineId: routine.id,
    //   },
    //   {
    //     exerciseHasWorkoutId: 3,
    //     routineId: routine.id,
    //   },
    //   {
    //     exerciseHasWorkoutId: 4,
    //     routineId: routine.id,
    //   },
    // ]);

    // await LogExercise.bulkCreate([
    //   {
    //     setNumber: 4,
    //     reps: 12,
    //     weight: 56,
    //     routineId: routine.id,
    //     exerciseWorkoutRoutineId: 1,
    //   },
    //   {
    //     setNumber: 3,
    //     reps: 10,
    //     weight: 76,
    //     routineId: routine.id,
    //     exerciseWorkoutRoutineId: 2,
    //   },
    //   {
    //     setNumber: 5,
    //     reps: 10,
    //     weight: 35,
    //     routineId: routine.id,
    //     exerciseWorkoutRoutineId: 3,
    //   },
    //   {
    //     setNumber: 3,
    //     reps: 16,
    //     weight: 20,
    //     routineId: routine.id,
    //     exerciseWorkoutRoutineId: 4,
    //   },
    // ]);

    return res.status(200).json({
      success: true,
      message: "Bulk created successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.testingFindRoutine = async (req, res) => {
  const routineId = req.params.routineId;
  try {
    // const myRecords = await Workout.findAll({
    //     include: [{
    //         model: Exercise
    //     }]
    // })
    const myRecords = await Routine.findOne({
      where: {
        fitnessInstructorId: 1,
        id: routineId,
      },
      include: [
        {
          model: Workout,
          include: [
            {
              model: Exercise,
            },
          ],
        },
      ],
    });
    // const myRecords = await LogExercise.findAll({
    //   where: {
    //     routineId: routineId,
    //   },
    //   include: [
    //     {
    //       model: ExerciseHasWorkout,
    //       include: [
    //         {
    //           model: Workout,
    //         },
    //         {
    //           model: Exercise,
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const myRecords = await LogExercise.findAll({
    //   where: {
    //     routineId: routineId,
    //   },
    //   include: [
    //     {
    //       model: ExerciseWorkoutRoutine,
    //     },
    //   ],
    // });

    return res.status(200).json({
      success: true,
      myRecords,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.assignMealPlan = async (req, res) => {
  const { mealPlanId, clientId } = req.body;

  if (!mealPlanId || !clientId) {
    return res.status(404).json({
      success: false,
      message: "Please provide needed values!",
    });
  }

  try {
    const loggedInstructor = await FitnessInstructor.getInstructor(
      req.instructorId
    );
    if (!loggedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor does not exist!",
      });
    }

    const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor);
    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal Plan does not exist, or it doesn't belong  to you!",
      });
    }
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client does not exist!",
      });
    }
    if (client.fitnessInstructorId !== loggedInstructor.id) {
      return res.status(400).json({
        success: false,
        message: "This is not your client!",
      });
    }
    await client.setMeal_plan(mealPlan);

    return res.status(200).json({
      success: true,
      message: "Meal Plan has been successfully assigned to your client!",
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
      //TODO: Attributes
      where: {
        fitnessInstructorId: req.instructorId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
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

exports.assignRoutine = async (req, res) => {
  const { routineId, clientId } = req.body;

  if (!routineId || !clientId) {
    return res.status(404).json({
      success: false,
      message: "Please provide needed values!",
    });
  }
  try {
    const loggedInstructor = await FitnessInstructor.getInstructor(
      req.instructorId
    );
    if (!loggedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor does not exist!",
      });
    }
    // const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor);
    const routine = await Routine.findOne({
      where: {
        id: routineId,
        fitnessInstructorId: loggedInstructor.id,
      },
    });
    if (!routine) {
      return res.status(404).json({
        success: false,
        message: "Routine does not exist, or it doesn't belong  to you!",
      });
    }
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client does not exist!",
      });
    }
    if (client.fitnessInstructorId !== loggedInstructor.id) {
      return res.status(400).json({
        success: false,
        message: "This is not your client!",
      });
    }

    client.routineId = routine.id;
    await client.save();
    return res.status(200).json({
      success: true,
      message: "Routine has been successfully assigned to your client!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
