const db = require("../models")
const sequelize = db.sequelize
const Food = db.food
const FoodType = db.food_type
const MealPlan = db.meal_plan
const FitnessInstructor = db.fitness_instructor
const EatingDay = db.eating_day
const Meal = db.meal
const MealHasFood = db.meal_has_food
const EatingDayHasMealFood = db.eating_day_has_meal_has_food
const DayOfWeek = db.day_of_week
const Client = db.client
// -------------- Routine Part -------------- 
const Routine = db.routine
const MuscleGroup = db.muscle_group
const ExerciseType = db.exercise_type
const Exercise = db.exercise
const Workout = db.workout
const WorkoutType = db.workout_type
const WeekDay = db.week_day
const ExerciseHasWorkout = db.exercise_has_workout
const LogExercise = db.log_exercise
const ExerciseWorkoutRoutine = db.exercise_workout_routine

// -------------- Create Food record in the system --------------
exports.postFood = async (req, res) => {
    const {
        name,
        calories,
        protein,
        carbohydrates,
        fats,
        quantity, //TODO: should i leave qunatity in Food Table?
        foodTypeId
    } = req.body;

    if (!name || !calories || !protein || !carbohydrates || !fats || !quantity || !foodTypeId) {
        return res.status(401).json({
            success: false,
            message: "Empty fields!"
        })
    }
    try {
        const food = await Food.create({
            name,
            calories,
            protein,
            carbohydrates,
            fats,
            quantity,
            foodTypeId
        })

        return res.status(200).json({
            success: true,
            message: "Added food to the system successfully!",
            food
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Create Meal_Plan --------------
exports.createMealPlan = async (req, res) => {
    const {
        name,
        description
    } = req.body

    if (!name) {
        return res.status(404).json({
            success: false,
            message: "Please enter name for the meal plan!"
        })
    }

    const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
    if (!loggedInstructor) {
        return res.status(404).json({
            success: false,
            message: "Instructor does not exist!"
        })
    }

    try {
        const mealPlan = await MealPlan.create({
            name,
            description,
            fitnessInstructorId: loggedInstructor.id
        })
        //TODO: After meal plan creation assign it to client, which has chosen you!
        return res.status(200).json({
            success: true,
            message: "Created meal plan successfully!",
            mealPlan
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// -------------- Create Eating_day --------------
exports.createEatingDay = async (req, res) => {
    const {
        dayOfWeekId,
        mealPlanId
    } = req.body

    if (!dayOfWeekId || !mealPlanId) {
        return res.status(404).json({
            success: false,
            message: "Please enter day name"
        })
    }

    const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
    if (!loggedInstructor) {
        return res.status(404).json({
            success: false,
            message: "Instructor does not exist!"
        })
    }

    const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor)
    if (!mealPlan) {
        return res.status(404).json({
            success: false,
            message: "Meal Plan does not exist, or it doesn't belong  to you!"
        })
    }

    try {
        const eatingDay = await EatingDay.create({
            dayOfWeekId,
            mealPlanId
        })

        return res.status(200).json({
            success: true,
            message: "Created eating day successfully!",
            eatingDay
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

// -------------- Get All Meals --------------
exports.getAllMeals = async (req, res) => {
    try {
        const allMeals = await Meal.findAll()

        if (allMeals.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No meals added in the database! Try again later."
            })
        }

        return res.status(200).json({
            success: true,
            allMeals
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ------------- Get Foods (can search for specific food if search query is added) ---------------
exports.getFoods = async (req, res) => {
    const {
        search
    } = req.query
    try {
        let foods = await Food.findAll()


        if (search) {
            foods = foods.filter((food) => {
                return food.name.startsWith(search)
            })
        }

        if (foods.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No foods in the database"
            })
        }

        return res.status(200).json({
            success: true,
            foods
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

// ------------- Post food to meal section (Create Meal_Food record) -------------
exports.createMealFood = async (req, res) => {
    const {
        mealId,
        foodId
    } = req.body

    if (!mealId || !foodId) {
        return res.status(404).json({
            success: false,
            message: "Please provide meal and food!"
        })
    }

    try {
        const foundFood = await Food.findFood(foodId)
        const foundMeal = await Meal.findMeal(mealId)
        if (!foundFood || !foundMeal) {
            return res.status(404).json({
                success: false,
                message: "Couldn't find food or meal."
            })
        }

        const mealHasFood = await MealHasFood.create({
            mealId: foundMeal.id,
            foodId: foundFood.id
        })

        return res.status(200).json({
            success: true,
            message: "Meal_has_food inserted",
            mealHasFood
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ------------- Get all foods which are posted by instructor in meals -------------
exports.getFoodsInMeals = async (req, res) => {

    try {
        const allFoods = await Meal.findAll({
            include: [{
                model: Food,
                attributes: ['name', 'calories', 'protein', 'carbohydrates', 'fats', 'quantity', 'foodTypeId'],
                required: false, // Does Outer Join
                include: [{
                    model: FoodType,
                    attributes: ['name'],
                    required: true
                }]
            }]
        })
        return res.status(200).json({
            success: true,
            allFoods
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ------------- Post meal with foods into eating day (Create Eating_Day_Meal_Has_Food record) -------------
exports.postMealFood_EatingDay = async (req, res) => {
    const {
        mealHasFoodId,
        eatingDayId,
    } = req.body

    if (!mealHasFoodId || !eatingDayId) {
        return res.status(404).json({
            success: false,
            message: "Please provide needed data!"
        })
    }

    try {


        const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
        if (!loggedInstructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor does not exist!"
            })
        }

        const foundMealHasFood = await MealHasFood.findMealHasFood(mealHasFoodId)
        const foundEatingDay = await EatingDay.findEatingDay(eatingDayId) // ?
        if (!foundMealHasFood || !foundEatingDay) {
            return res.status(404).json({
                success: false,
                message: "Couldn't find eating day or meal_has_food record."
            })
        }

        const eatingDayHasMealFood = await EatingDayHasMealFood.create({
            mealHasFoodId: foundMealHasFood.id,
            eatingDayId: foundEatingDay.id
        })

        return res.status(200).json({
            success: true,
            message: "EatingDay_Has_MealFood inserted",
            eatingDayHasMealFood
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

exports.assignMealPlan = async (req, res) => {
    const {
        mealPlanId,
        clientId
    } = req.body

    if (!mealPlanId || !clientId) {
        return res.status(404).json({
            success: false,
            message: "Please provide needed values!"
        })
    }


    try {
        const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
        if (!loggedInstructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor does not exist!"
            })
        }

        const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor)
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal Plan does not exist, or it doesn't belong  to you!"
            })
        }
        const client = await Client.findOne({
            where: {
                id: clientId
            }
        })
        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Client does not exist!"
            })
        }
        if (client.fitnessInstructorId !== loggedInstructor.id) {
            return res.status(400).json({
                success: false,
                message: "This is not your client!"
            })
        }
        await client.setMeal_plan(mealPlan)


        return res.status(200).json({
            success: true,
            message: "Meal Plan has been successfully assigned to your client!",
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getMealPlan = async (req, res) => {
    const mealPlanId = req.params.mealPlanId
    try {
        const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
        if (!loggedInstructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor does not exist!"
            })
        }

        const mealPlan = await MealPlan.getMealPlan(mealPlanId, loggedInstructor)
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal Plan does not exist, or it doesn't belong  to you!"
            })
        }

        const mealPlanInfo = await EatingDay.findAll({
            where: {
                mealPlanId: mealPlan.id
            },
            include: [{
                    model: DayOfWeek,
                    attributes: ['name']
                },
                {
                    model: MealHasFood,
                    include: [{
                            model: Meal,
                            attributes: ['name']
                        },
                        {
                            model: Food
                        },
                    ],
                    through: {
                        attributes: []
                    }
                }
            ]
        })
        return res.status(200).json({
            success: true,
            message: "Done",
            mealPlanInfo
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.testingBulk = async (req, res) => {

    try {
        const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
        if (!loggedInstructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor does not exist!"
            })
        }

        const myMealPlan = await MealPlan.create({
            name: "Tommy's Meal Plan",
            fitnessInstructorId: loggedInstructor.id
        })

        await DayOfWeek.bulkCreate([{
                name: 'Monday'
            },
            {
                name: 'Tuesday'
            },
            {
                name: 'Wednesday'
            },
            {
                name: 'Thursday'
            },
            {
                name: 'Friday'
            }
        ]);
        await EatingDay.bulkCreate([{
                dayOfWeekId: 1,
                mealPlanId: myMealPlan.id
            },
            {
                dayOfWeekId: 2,
                mealPlanId: myMealPlan.id
            },
            {
                dayOfWeekId: 3,
                mealPlanId: myMealPlan.id
            },
            {
                dayOfWeekId: 4,
                mealPlanId: myMealPlan.id
            },
            {
                dayOfWeekId: 5,
                mealPlanId: myMealPlan.id
            }
        ]);

        await Meal.bulkCreate([{
                name: 'Breakfast'
            },
            {
                name: 'Lunch'
            },
            {
                name: 'Dinner'
            },
            {
                name: 'Snack'
            }
        ]);

        await FoodType.bulkCreate([{
                name: "drink"
            },
            {
                name: "diary"
            },
            {
                name: "fruit/vegetable"
            },
            {
                name: "Steak"
            }
        ])

        await Food.bulkCreate([{
                name: 'Steak',
                calories: 300,
                protein: 17.5,
                carbohydrates: 36.1,
                fats: 61,
                quantity: 1,
                foodTypeId: 4

            },
            {
                name: 'Apple',
                calories: 50,
                protein: 2.5,
                carbohydrates: 16.1,
                fats: 1,
                quantity: 1,
                foodTypeId: 3
            },
            {
                name: 'Banana',
                calories: 100,
                protein: 4.5,
                carbohydrates: 36.1,
                fats: 8,
                quantity: 1,
                foodTypeId: 3
            }
        ]);


        await MealHasFood.bulkCreate([{
                mealId: 1,
                foodId: 2,
                // eatingDayId: 1
            }, // this GameTeam will get id 1
            {
                mealId: 1,
                foodId: 3,
                // eatingDayId: 1
            }, // this GameTeam will get id 2
            {
                mealId: 2,
                foodId: 1,
                // eatingDayId: 1
            }, // this GameTeam will get id 3
            {
                mealId: 2,
                foodId: 3,
                // eatingDayId: 1
            }, // this GameTeam will get id 4
            {
                mealId: 3,
                foodId: 1,
                // eatingDayId: 2
            }, // this GameTeam will get id 5
        ]);


        await EatingDayHasMealFood.bulkCreate([
            // In 'Winter Showdown' (i.e. GameTeamIds 3 and 4):
            {
                eatingDayId: 1,
                mealHasFoodId: 1,
                // mealPlanId: myMealPlan.id
            }, // s0me0ne played for The Martians
            {
                eatingDayId: 1,
                mealHasFoodId: 2,
                // mealPlanId: myMealPlan.id
            }, // greenhead played for The Martians
            {
                eatingDayId: 1,
                mealHasFoodId: 3,
                // mealPlanId: myMealPlan.id
            }, // not_spock played for The Plutonians
            {
                eatingDayId: 1,
                mealHasFoodId: 4,
                // mealPlanId: myMealPlan.id
            }, // bowl_of_petunias played for The Plutonians
            {
                eatingDayId: 2,
                mealHasFoodId: 1,
                // mealPlanId: myMealPlan.id
            } // bowl_of_petunias played for The Plutonians
        ]);
        return res.status(200).json({
            success: true,
            message: "Bulk creates complete."
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.testingFind = async (req, res) => {
    try {
        const myRecords = await EatingDay.findAll({
            where: {
                mealPlanId: 1
            },
            include: [{
                    model: DayOfWeek,
                    attributes: ['name']
                },
                {
                    model: MealHasFood,
                    include: [{
                            model: Meal,
                            attributes: ['name']
                        },
                        {
                            model: Food
                        },
                    ],
                    through: {
                        attributes: []
                    }
                }
            ]
        })

        return res.status(200).json({
            success: true,
            myRecords
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.testingBulkRoutine = async (req, res) => {
    try {
        const loggedInstructor = await FitnessInstructor.getInstructor(req.instructorId)
        if (!loggedInstructor) {
            return res.status(404).json({
                success: false,
                message: "Instructor does not exist!"
            })
        }
        const routine = await Routine.create({
            name: "Todd's Fitness Routine",
            fitnessInstructorId: loggedInstructor.id
        })

        // TODO: Figure out a way how to have exercise which targets multiple muscle groups
        await MuscleGroup.bulkCreate([{
                name: "Shoulders"
            },
            {
                name: "Chest"
            },
            {
                name: "Back"
            },
            {
                name: "Legs"
            },
            {
                name: "Arms"
            },
        ])

        await ExerciseType.bulkCreate([{
                name: "Muscle-Bulding"
            },
            {
                name: "Cardio-vascular"
            },
            {
                name: "Wellness"
            },
        ])

        await Exercise.bulkCreate([{
                name: "Shoulder Press",
                muscleGroupId: 1,
                exerciseTypeId: 1
            },
            {
                name: "Jump-ups",
                muscleGroupId: 4,
                exerciseTypeId: 2
            },
            {
                name: "Back streches",
                muscleGroupId: 3,
                exerciseTypeId: 3
            },
        ])

        await WorkoutType.bulkCreate([{
                name: "Yoga"
            },
            {
                name: "Stretching"
            },
            {
                name: "Aerobic"
            },
            {
                name: "Anaerobic"
            },
        ])

        await WeekDay.bulkCreate([{ //TODO: Do I need this? maybe use Days_Of_Week?
                name: "Monday"
            },
            {
                name: "Tuesday"
            },
            {
                name: "Wednesday"
            },
            {
                name: "Thursday"
            },
            {
                name: "Friday"
            },
        ])


        await Workout.bulkCreate([{
                name: "Workout Day 1",
                weekDayId: 1,
                workoutTypeId: 4,
                routineId: routine.id
            },
            {
                name: "Workout Day 2",
                weekDayId: 2,
                workoutTypeId: 2,
                routineId: routine.id

            },
            {
                name: "Workout Day 3",
                weekDayId: 3,
                workoutTypeId: 3,
                routineId: routine.id

            },
            {
                name: "Workout Day 4",
                weekDayId: 4,
                workoutTypeId: 3,
                routineId: routine.id

            },
        ])

        await ExerciseHasWorkout.bulkCreate([{
                sets: 4,
                reps: 10,
                exerciseId: 1,
                workoutId: 1,
            },
            {
                sets: 5,
                reps: 12,
                exerciseId: 2,
                workoutId: 1,
            },
            {
                sets: 3,
                reps: 8,
                exerciseId: 3,
                workoutId: 1,
            },
            {
                sets: 4,
                reps: 12,
                exerciseId: 2,
                workoutId: 2,
            },
        ])

        //TODO: Exercise_has_workout_has_routine => Bulk_create
        await ExerciseWorkoutRoutine.bulkCreate([{
                exerciseHasWorkoutId: 1,
                routineId: routine.id
            },
            {
                exerciseHasWorkoutId: 2,
                routineId: routine.id
            },
            {
                exerciseHasWorkoutId: 3,
                routineId: routine.id
            },
            {
                exerciseHasWorkoutId: 4,
                routineId: routine.id
            },
        ])

        await LogExercise.bulkCreate([{
                setNumber: 4,
                reps: 12,
                weight: 56,
                routineId: routine.id,
                exerciseWorkoutRoutineId: 1
            },
            {
                setNumber: 3,
                reps: 10,
                weight: 76,
                routineId: routine.id,
                exerciseWorkoutRoutineId: 2
            },
            {
                setNumber: 5,
                reps: 10,
                weight: 35,
                routineId: routine.id,
                exerciseWorkoutRoutineId: 3
            },
            {
                setNumber: 3,
                reps: 16,
                weight: 20,
                routineId: routine.id,
                exerciseWorkoutRoutineId: 4
            },
        ])

        return res.status(200).json({
            success: true,
            message: "Bulk created successfully!"
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.testingFindRoutine = async (req, res) => {
    const routineId = req.params.routineId
    try {
        // const myRecords = await Workout.findAll({
        //     include: [{
        //         model: Exercise
        //     }]
        // })
        const myRecords = await Routine.findOne({
            where: {
                fitnessInstructorId: 1,
                id: routineId
            },
            include: [{
                model: Workout,
                include: [{
                    model: Exercise,
                }]
            }]
        })
        // const myRecords = await LogExercise.findAll({
        //     where: {
        //         routineId: routineId
        //     },
        //     include: [{
        //         model: ExerciseHasWorkout,
        //         include: [{
        //                 model: Workout,
        //             },
        //             {
        //                 model: Exercise
        //             }
        //         ]
        //     }]
        // })

        // const myRecords = await LogExercise.findAll({
        //     where: {
        //         routineId: routineId
        //     },
        //     include: [{
        //         model: ExerciseHasWorkout,

        //     }]
        // })

        return res.status(200).json({
            success: true,
            myRecords
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}