const db = require("../models");
const membershipService = require("./membershipService");

const Client = db.client;
const Membership = db.membership;
const MembershipType = db.membership_type;
const Gym = db.gym;
const FitnessInstructor = db.fitness_instructor;
const Image = db.image;
const Employee = db.employee;
const User = db.user;
const Routine = db.routine;
const Exercise = db.exercise;
const Workout = db.workout;
const DayOfWeek = db.day_of_week;
const EatingDay = db.eating_day;
const Meal = db.meal;
const MealHasFood = db.meal_has_food;
const MealType = db.meal_type;
const FoodInfo = db.food_info;
const FoodType = db.food_type;
const Food = db.food;

const MuscleGroup = db.muscle_group;
const WorkoutType = db.workout_type;
const ExerciseType = db.exercise_type;
const MealPlan = db.meal_plan;

const instructorJoins = [
  {
    model: FitnessInstructor,
    attributes: ["id"],
    include: [
      {
        model: User,
        attributes: ["name", "email"],
        include: [
          {
            model: Image,
            attributes: ["path"],
          },
        ],
      },
    ],
  },
  {
    model: Gym,
    attributes: ["name"],
  },
];

const setInstructor = async (instructorId, clientId) => {
  try {
    const foundMembership = await membershipService.verifyValidity(clientId);
    if (!foundMembership) {
      throw {
        status: 404,
        message: "User doesn't have membership or it's not valid!",
      };
    }

    if (membershipService.verifyEndDate(foundMembership)) {
      await Client.update(
        { fitnessInstructorId: null },
        { where: { id: clientId } }
      );
      foundMembership.status = "expired";
      await foundMembership.save();
    }

    const instructor = await FitnessInstructor.findOne({
      where: { id: instructorId },
    });
    if (!instructor) {
      throw { status: 404, message: "Instructor doesn't exist!" };
    }
    const loggedClient = await Client.findOne({ where: clientId });
    const validMembership = await membershipService.verifyValidity(clientId);

    if (!validMembership) {
      throw {
        status: 404,
        message: "You don't have a valid membership to hire an instructor!",
      };
    }
    if (loggedClient.fitnessInstructorId !== null) {
      throw { status: 404, message: "You already have an instructor!" };
    }
    loggedClient.fitnessInstructorId = instructor.id;
    await loggedClient.save();
    return loggedClient;
  } catch (err) {
    throw err;
  }
};

const getInstructorsInGym = async (clientId) => {
  try {
    const memb = await Membership.findOne({
      attributes: ["gymId"],
      where: {
        clientId: clientId,
      },
    });
    let instructors = null;
    if (memb) {
      instructors = await Employee.findAll({
        attributes: ["id", "name", "phone"],
        where: {
          position: 1,
          gymId: memb.gymId,
        },
        include: instructorJoins,
      });
    } else {
      instructors = await Employee.findAll({
        attributes: ["id", "name", "phone"],
        where: {
          position: 1,
        },
        include: instructorJoins,
      });
    }

    if (instructors.length === 0) {
      throw {
        status: 404,
        message: "Couldn't find instructors.",
      };
    }
    return instructors;
  } catch (err) {
    throw err;
  }
};
const findMembership = async (clientId) => {
  try {
    const isMembershipExistent = await Membership.findOne({
      where: {
        clientId: clientId,
      },
    });
    return isMembershipExistent;
    // return forwardLink;
  } catch (err) {
    throw err;
  }
};

const splitString = (membershipValuesString) => {
  return membershipValuesString.split(",");
};

const createOrRenewMembership = async (membershipData) => {
  try {
    const foundGym = await Gym.findOne({
      where: {
        id: parseInt(membershipData[1]), //gymId
      },
    });
    await membershipService.createMembership(
      foundGym,
      parseInt(membershipData[2]),
      parseInt(membershipData[0])
    );
  } catch (err) {
    throw err;
  }
};

const resetMembershipExtras = async (client) => {
  if (client.fitnessInstructorId !== null || client.routineId !== null) {
    client.fitnessInstructorId = null;
    client.routineId = null;
    await client.save().catch(() => {
      throw new Error("Something went wrong with client update!");
    });
    return;
  }
  return;
};

const getMembership = async (clientId) => {
  try {
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });

    const membership = await Membership.findOne({
      attributes: [
        "id",
        "status",
        "clientId",
        "membershipTypeId",
        "end_date",
        "start_date",
        "fee",
        "gymId",
      ],
      where: {
        clientId: clientId,
      },
      include: [
        {
          model: Gym,
          attributes: ["name"],
        },
        {
          model: MembershipType,
          attributes: ["name"],
        },
      ],
    });
    if (!membership) {
      throw {
        status: 404,
        message: "Membership not found!",
      };
    }

    if (membershipService.verifyEndDate(membership)) {
      await resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: {
            id: client.mealPlanId,
          },
        });
      }
      if (membership.status === "active")
        await membershipService.setToExpired(membership);
    }

    return membership;
  } catch (err) {
    throw err;
  }
};
const getRoutine = async (clientId) => {
  try {
    const client = await Client.findOne({
      where: {
        id: clientId,
      },
    });
    const clientRoutine = await Client.findOne({
      attributes: [],
      where: {
        id: client.id,
      },
      include: [
        {
          attributes: ["name"],
          model: Routine,
          include: [
            {
              attributes: ["userId"],
              model: FitnessInstructor,
              include: [
                {
                  model: User,
                  attributes: ["name"],
                },
              ],
            },
            {
              attributes: ["id", "name"],
              model: Workout,
              include: [
                {
                  model: DayOfWeek,
                  attributes: ["name"],
                },
                {
                  model: WorkoutType,
                  attributes: ["name"],
                },
                {
                  model: Exercise,
                  attributes: ["id", "name"],
                  include: [
                    {
                      attributes: ["path"],
                      model: Image,
                    },
                    {
                      attributes: ["name"],
                      model: MuscleGroup,
                    },
                    {
                      attributes: ["name"],
                      model: ExerciseType,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    const membership = await Membership.findOne({
      where: {
        clientId: clientId,
      },
    });
    if (!membership) {
      throw {
        status: 404,
        message: "Not found membership! Please create one.",
      };
    }

    console.log("MEMBERSHIP", membership);
    if (membershipService.verifyEndDate(membership)) {
      await resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: {
            id: client.mealPlanId,
          },
        });
      }
      if (membership.status === "active")
        await membershipService.setToExpired(membership);
      throw {
        status: 403,
        message: "Your membership has expired!",
      };
    }

    if (!clientRoutine.routine) {
      throw {
        status: 404,
        message: "You don't have a routine!",
      };
    }
    return clientRoutine.routine;
  } catch (err) {
    throw err;
  }
};
const getMealPlan = async (clientId) => {
  try {
    const client = await Client.findOne({ where: { id: clientId } });

    const mealPlan = await Client.findOne({
      attributes: ["id", "mealPlanId", "calories"],
      where: { id: client.id },
      include: [
        {
          model: MealPlan,
          include: [
            {
              model: EatingDay,
              include: [
                { model: DayOfWeek },
                {
                  model: Meal,
                  include: [
                    { model: MealType },
                    {
                      model: Food,
                      include: [
                        {
                          model: FoodInfo,
                          include: [
                            { model: FoodType },
                            { attributes: ["path"], model: Image },
                          ],
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

    const membership = await Membership.findOne({
      where: { clientId: clientId },
    });

    if (!membership) {
      throw {
        status: 404,
        message: "Not found membership! Please create one.",
      };
    }

    if (membershipService.verifyEndDate(membership)) {
      await resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: { id: client.mealPlanId },
        });
      }
      if (membership.status === "active")
        await membershipService.setToExpired(membership);
      throw { status: 403, message: "Your membership has expired!" };
    }

    if (!mealPlan.meal_plan) {
      throw { status: 404, message: "You don't have a meal plan!" };
    }
    return mealPlan;
  } catch (err) {
    throw err;
  }
};
const addFoodToMeal = async (foodId, mealId, quantity) => {
  try {
    const foodInfo = await FoodInfo.findOne({
      where: { id: foodId },
    });
    if (foodInfo) {
      const food = await Food.create({
        quantity: quantity,
        total_calories: foodInfo.calories * quantity,
        total_protein: foodInfo.protein * quantity,
        total_carbohydrates: foodInfo.carbohydrates * quantity,
        total_fats: foodInfo.fats * quantity,
        foodInfoId: foodInfo.id,
      });
      await MealHasFood.create({ foodId: food.id, mealId: mealId });
      return {
        status: 200,
        success: true,
        message: "Successfully inserted food to meal",
      };
    }
  } catch (err) {
    throw err;
  }
};
const deleteFoodFromMeal = async (foodId) => {
  try {
    await Food.destroy({
      where: {
        id: foodId,
      },
    });
  } catch (err) {
    throw err;
  }
};
const getDashboardData = async (userId, clientId) => {
  try {
    const userData = await User.findOne({
      attributes: ["name"],
      where: {
        id: userId,
      },
      include: [
        {
          model: Image,
          attributes: ["path"],
        },
      ],
    });
    const client = await Client.findOne({
      attributes: ["calories", "id"],
      where: {
        id: clientId,
      },
    });

    const membership = await Membership.findOne({
      attributes: ["status"],
      where: {
        clientId: client.id,
      },
    });

    return {
      userData,
      client,
      membership,
    };
  } catch (err) {
    throw err;
  }
};
const getAllFoods = async () => {
  try {
    const foods = await FoodInfo.findAll({
      attributes: [
        "id",
        "name",
        "calories",
        "protein",
        "carbohydrates",
        "fats",
      ],
      include: [
        { attributes: [["name", "foodType"]], model: FoodType },
        { attributes: ["path"], model: Image },
      ],
    });

    return foods;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  setInstructor,
  getInstructorsInGym,
  findMembership,
  createOrRenewMembership,
  splitString,
  getMembership,
  getRoutine,
  getMealPlan,
  addFoodToMeal,
  deleteFoodFromMeal,
  getDashboardData,
  getAllFoods,
};
