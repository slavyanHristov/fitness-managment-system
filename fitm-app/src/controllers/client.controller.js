const env = process.env.NODE_ENV || "development";
const { CLIENT_URL, APP_DOMAIN } = require("../../config/config")[env];
const db = require("../models");
const paypal = require("paypal-rest-sdk");
const { flatten } = require("../utils");
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

exports.setInstructor = async (req, res) => {
  const instructorId = req.params.id;

  if (!instructorId) {
    return res.status(404).json({
      success: false,
      message: "Please provide an instructor!",
    });
  }

  try {
    const foundMembership = await Membership.verifyValidity(req.clientId);
    if (!foundMembership) {
      return res.status(404).json({
        success: false,
        message: "User doesn't have membership or it's not valid!",
      });
    }

    if (Membership.verifyEndDate(foundMembership)) {
      await Client.update(
        { fitnessInstructorId: null },
        {
          where: {
            id: req.clientId,
          },
        }
      );
      foundMembership.status = "expired";
      await foundMembership.save();
    }

    const instructor = await FitnessInstructor.findOne({
      where: {
        id: instructorId,
      },
    });
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor doesn't exist!",
      });
    }
    const loggedClient = await Client.findOne({
      where: req.clientId,
    });
    const validMembership = await Membership.verifyValidity(req.clientId);

    if (!validMembership) {
      return res.status(400).json({
        success: false,
        message: "You don't have a valid membership to hire an instructor!",
      });
    }
    if (loggedClient.fitnessInstructorId !== null) {
      return res.status(400).json({
        success: false,
        message: "You already have an instructor!",
      });
    }
    loggedClient.fitnessInstructorId = instructor.id;
    await loggedClient.save();

    return res.status(200).json({
      success: true,
      message: "You now have a fitness instructor!",
      loggedClient,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getInstructorsInGym = async (req, res) => {
  try {
    const memb = await Membership.findOne({
      attributes: ["gymId"],
      where: {
        clientId: req.clientId,
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
      return res.status(404).json({
        success: false,
        message: "Couldn't find instructors.",
      });
    }
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

exports.payment = async (req, res) => {
  const { fee, name, membershipTypeId, gymId } = req.body;
  try {
    console.log("NAME:", name);
    console.log("PRICE:", fee);
    console.log("MEMBERSHIP:", membershipTypeId);

    const isMembershipExistent = await Membership.findOne({
      where: {
        clientId: req.clientId,
      },
    });
    if (!isMembershipExistent || isMembershipExistent.status !== "active") {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          //APP_DOMAIN
          return_url: `http://${APP_DOMAIN}/api/client/success`,
          cancel_url: `http://${APP_DOMAIN}/api/client/cancel`,
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: name,
                  sku: "001",
                  price: fee,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: fee,
            },
            description: "Fit-M Gym Membership.",
            custom: `${membershipTypeId},${gymId},${req.clientId}`,
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log("Create Payment Response");
          console.log(payment);

          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              return res.json({
                forwardLink: payment.links[i].href,
              });
            }
          }
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Client already has active membership in a gym.",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const splitString = (membershipValuesString) => {
  return membershipValuesString.split(",");
};

exports.paymentSuccess = async (req, res) => {
  //execute payment json
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
  };

  //execute payment
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async (error, payment) => {
      if (error) {
        console.log(error);
        throw error;
      } else {
        console.log("Get payment response");
        console.log(JSON.stringify(payment));
        const membershipData = splitString(payment.transactions[0].custom);
        console.log("Vals,", membershipData);

        const foundGym = await Gym.findOne({
          where: {
            id: parseInt(membershipData[1]), //gymId
          },
        });
        await Membership.createMembership(
          foundGym,
          parseInt(membershipData[2]), //clientId
          parseInt(membershipData[0]) // membershipTypeId
        );
        return res.redirect(`${CLIENT_URL}/success`);
      }
    }
  );
};

exports.paymentCancel = (req, res) => {
  return res.redirect(`${CLIENT_URL}`);
};

exports.getMembership = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.clientId,
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
        clientId: req.clientId,
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
      return res.status(404).json({
        success: false,
        message: "Membership not found!",
      });
    }

    if (Membership.verifyEndDate(membership)) {
      await Client.resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: {
            id: client.mealPlanId,
          },
        });
      }
      if (membership.status === "active")
        await Membership.setToExpired(membership);
    }

    return res.status(200).json({
      success: true,
      membership: membership,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRoutine = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.clientId,
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
        clientId: req.clientId,
      },
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Not found membership! Please create one.",
      });
    }

    console.log("MEMBERSHIP", membership);
    if (Membership.verifyEndDate(membership)) {
      await Client.resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: {
            id: client.mealPlanId,
          },
        });
      }
      if (membership.status === "active")
        await Membership.setToExpired(membership);
      return res.status(403).json({
        success: false,
        message: "Your membership has expired!",
      });
    }

    if (!clientRoutine.routine) {
      return res.status(404).json({
        success: false,
        message: "You don't have a routine!",
      });
    }

    return res.status(200).json({
      success: true,
      routine: clientRoutine.routine,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMealPlan = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: {
        id: req.clientId,
      },
    });

    const mealPlan = await Client.findOne({
      attributes: ["id", "mealPlanId", "calories"],
      where: {
        id: client.id,
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
                  model: Meal,
                  include: [
                    {
                      model: MealType,
                    },
                    {
                      model: Food,
                      include: [
                        {
                          model: FoodInfo,
                          include: [
                            {
                              model: FoodType,
                            },

                            {
                              attributes: ["path"],
                              model: Image,
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
        },
      ],
    });

    const membership = await Membership.findOne({
      where: {
        clientId: req.clientId,
      },
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Not found membership! Please create one.",
      });
    }

    if (Membership.verifyEndDate(membership)) {
      await Client.resetMembershipExtras(client);
      if (client.mealPlanId !== null) {
        await MealPlan.destroy({
          where: {
            id: client.mealPlanId,
          },
        });
      }
      if (membership.status === "active")
        await Membership.setToExpired(membership);
      return res.status(403).json({
        success: false,
        message: "Your membership has expired!",
      });
    }

    if (!mealPlan.meal_plan) {
      return res.status(404).json({
        success: false,
        message: "You don't have a meal plan!",
      });
    }

    return res.status(200).json({
      success: true,
      mealPlan: mealPlan,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.addFoodToMeal = async (req, res) => {
  const { foodId, mealId, quantity } = req.body;
  try {
    const foodInfo = await FoodInfo.findOne({
      where: {
        id: foodId,
      },
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

      await MealHasFood.create({
        foodId: food.id,
        mealId: mealId,
      });
      return res.status(200).json({
        success: true,
        message: "Successfully inserted food to meal",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteFoodFromMeal = async (req, res) => {
  const foodId = req.params.id;
  try {
    await Food.destroy({
      where: {
        id: foodId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Food removed from meal.",
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
      attributes: ["name"],
      where: {
        id: req.id,
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
        id: req.clientId,
      },
    });

    const membership = await Membership.findOne({
      attributes: ["status"],
      where: {
        clientId: client.id,
      },
    });

    return res.status(200).json({
      success: true,
      userData: userData,
      clientData: client,
      membershipStatus: membership,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllFoods = async (req, res) => {
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
        {
          attributes: [["name", "foodType"]],
          model: FoodType,
        },
        {
          attributes: ["path"],
          model: Image,
        },
      ],
    });
    return res.status(200).json({
      success: true,
      collection: flatten.flattenArrayObjects(foods),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
