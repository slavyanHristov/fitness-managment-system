const db = require("../models");
const paypal = require("paypal-rest-sdk");
const { flatten } = require("../utils");
const Client = db.client;
const Membership = db.membership;
const MembershipType = db.membership_type;
const Gym = db.gym;
const FitnessInstructor = db.fitness_instructor;
const Notification = db.notification;
const NotificationRecipient = db.notification_recipient;
const Image = db.image;
const Employee = db.employee;
const User = db.user;
const Routine = db.routine;
const Exercise = db.exercise;
const Workout = db.workout;
// const WeekDay = db.week_day;
const DayOfWeek = db.day_of_week;
const EatingDay = db.eating_day;
const EatingDayHasMeal = db.eatingDay_has_meal;
const MealHasFood = db.meal_has_food;
const Meal = db.meal;
const Food = db.food;
const FoodType = db.food_type;

const MuscleGroup = db.muscle_group;
const WorkoutType = db.workout_type;
const ExerciseType = db.exercise_type;
const MealPlan = db.meal_plan;

// paypal configs

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

exports.createMembership = async (req, res) => {
  const { gymId, membershipTypeId } = req.body;
  const foundGym = await Gym.findOne({
    where: {
      id: gymId,
    },
  });
  //   const foundClient = await Client.findOne({
  //     where: {
  //       id: req.clientId,
  //     },
  //   });
  if (!foundGym) {
    return res.status(404).json({
      success: false,
      message: "Gym does not exist!",
    });
  }

  try {
    const isMembershipExistent = await Membership.findOne({
      where: {
        clientId: req.clientId,
        gymId: gymId,
      },
    });
    if (isMembershipExistent) {
      // TODO: Renewal should be called only when there is a membership for the given client AND
      // it's status is expired or cancelled
      //TODO: Figure out where you can call renew client's expired or paused membership
      //TODO: On renewal it should update start_date, end_date, status, fee and membershipTypeId
      return res.status(400).json({
        success: false,
        message: "Client already has membership in this gym.",
      });
    }

    const membership = await Membership.createMembership(
      foundGym,
      req.clientId,
      membershipTypeId
    );
    return res.status(200).json({
      success: true,
      membership,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
//TODO: Maybe I need this to be changed to Patch method instead of Post?
exports.verifyEndDate = async (req, res) => {
  //   const foundClient = await Client.findOne({
  //     where: {
  //       id: req.clientId,
  //     },
  //   });
  //   if (!foundClient) {
  //     return res.status(404).json({
  //       success: false,
  //       message: "Client doesn't exist",
  //     });
  //   }

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

    return res.status(200).json({
      success: true,
      message: foundMembership.status,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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
    //TODO: On the front-end before setInstructor is called, verifyEndDate should be called
    // before it
    const validMembership = await Membership.verifyValidity(req.clientId);

    if (!validMembership) {
      return res.status(400).json({
        success: false,
        message: "You don't have a valid membership to hire an instructor!",
      });
    }
    loggedClient.fitnessInstructorId = instructor.id;
    await loggedClient.save();
    // await loggedClient.setFitness_instructor(instructor);
    // const loggedClient = await Client.update(
    //   { fitnessInstructorId: instructor.id },
    //   {
    //     where: {
    //       id: req.clientId,
    //     },
    //   }
    // );

    // await createNotification(loggedClient, instructor);
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

const createNotification = async (sender, recipient) => {
  const notification = await Notification.create({
    title: "New client!",
    description: "You've been chosen for instructor by a client!",
    userId: sender.userId,
  });
  await notification.createNotification_recipient({
    is_read: 2,
    userId: recipient.userId,
  });
};

// Send, Recieve notifications?
exports.payment = async (req, res) => {
  const { fee, name, membershipTypeId, gymId } = req.body;
  try {
    console.log("NAME:", name);
    console.log("PRICE:", fee);
    console.log("MEMBERSHIP:", membershipTypeId);

    const isMembershipExistent = await Membership.findOne({
      where: {
        clientId: req.clientId,
        // gymId: gymId,
      },
    });
    if (!isMembershipExistent || isMembershipExistent.status !== "active") {
      // TODO: Renewal should be called only when there is a membership for the given client AND
      // it's status is expired or cancelled
      //TODO: Figure out where you can call renew client's expired or paused membership
      //TODO: On renewal it should update start_date, end_date, status, fee and membershipTypeId
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:5000/api/client/success",
          cancel_url: "http://localhost:5000/api/client/cancel",
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
  const token = req.query.token;

  const execute_payment_json = {
    payer_id: payerId,
    // transactions: [
    //   {
    //     amount: {
    //       currency: "USD",
    //       total:
    //     },
    //   },
    // ],
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
        // const foundMembership = await Membership.findOne({
        //   where: {
        //     clientId: membershipData[2],
        //   },
        // });
        // if (foundMembership) {
        // await Membership.renewMembership(
        //   foundGym,
        //   parseInt(membershipData[2]),
        //   parseInt(membershipData[0])
        // );
        // } else {
        await Membership.createMembership(
          foundGym,
          parseInt(membershipData[2]), //clientId
          parseInt(membershipData[0]) // membershipTypeId
        );
        // }

        //TODO: FIRST WAY WITH QUERY STRING AND GET REQUEST ON SUCCESS PAGE AND THEN SET IN AUTH STORE AND LOCALSTORAGE
        //TODO: SECOND WAY WITH LOGOUT ON SUCCESS PAGE
        //TODO: THIRD WAY GET MEMBERSHIP AND CLIENT DATA ON EACH REFERSH ?
        // const params = new URLSearchParams();
        // params.append("clientId", parseInt(membershipData[2]));
        // params.append("membershipId", membership.id);
        return res.redirect("http://localhost:3000/success");
      }
    }
  );

  // const { gymId, membershipTypeId } = req.body;
  // const foundGym = await Gym.findOne({
  //   where: {
  //     id: gymId,
  //   },
  // });
  //   const foundClient = await Client.findOne({
  //     where: {
  //       id: req.clientId,
  //     },
  //   });
  // if (!foundGym) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Gym does not exist!",
  //   });
  // }

  // try {
  //   const isMembershipExistent = await Membership.findOne({
  //     where: {
  //       clientId: req.clientId,
  //       gymId: gymId,
  //     },
  //   });
  //   if (isMembershipExistent) {
  //     // TODO: Renewal should be called only when there is a membership for the given client AND
  //     // it's status is expired or cancelled
  //     //TODO: Figure out where you can call renew client's expired or paused membership
  //     //TODO: On renewal it should update start_date, end_date, status, fee and membershipTypeId
  //     return res.status(400).json({
  //       success: false,
  //       message: "Client already has membership in this gym.",
  //     });
  //   }

  //   const membership = await Membership.createMembership(
  //     foundGym,
  //     req.clientId,
  //     membershipTypeId
  //   );
  //   return res.status(200).json({
  //     success: true,
  //     membership,
  //   });
  // } catch (err) {
  //   return res.status(500).json({
  //     success: false,
  //     message: err.message,
  //   });
  // }
};

exports.paymentCancel = (req, res) => {
  return res.redirect("http://localhost:3000");
};

exports.getMembership = async (req, res) => {
  // const clientId = req.params.clientId;
  // const membershipId = req.params.clientId;
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
    if (Membership.verifyEndDate(membership)) {
      if (client.fitnessInstructorId !== null || client.routineId !== null) {
        client.fitnessInstructorId = null;
        client.routineId = null;
        await client.save();
      }
      // await Client.update(
      //   { fitnessInstructorId: null, routineId: null },
      //   {
      //     where: {
      //       id: client.id,
      //     },
      //   }
      // );
      membership.status = "expired";
      await membership.save();
    }
    // if (membership.status !== "active") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Your membership is not active!",
    //   });
    // }

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
  // const routineId = req.params.id;
  try {
    // const exercises = await ExerciseHasWorkout.findAll({
    //   //attributes
    //   where: {
    //     workoutId: workoutId,
    //   },
    //   //include
    // });
    const client = await Client.findOne({
      where: {
        id: req.clientId,
      },
    });
    const clientRoutine = await Client.findOne({
      attributes: [],
      where: {
        // fitnessInstructorId: req.instructorId,
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
      // attributes: [
      //   "id",
      //   "status",
      //   "clientId",
      //   "membershipTypeId",
      //   "end_date",
      //   "start_date",
      //   "fee",
      //   "gymId",
      // ],
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
      if (client.fitnessInstructorId !== null || client.routineId !== null) {
        client.fitnessInstructorId = null;
        client.routineId = null;
        await client.save();
      }
      // await Client.update(
      //   { fitnessInstructorId: null, routineId: null },
      //   {
      //     where: {
      //       id: client.id,
      //     },
      //   }
      // );
      membership.status = "expired";
      await membership.save();
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
    const mealPlan = await Client.findOne({
      attributes: ["id", "mealPlanId"],
      where: {
        id: req.clientId,
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
  const { foodId, mealId } = req.body;
  try {
    const record = await MealHasFood.create({
      foodId: foodId,
      eatingDayHasMealId: mealId,
    });
    return res.status(200).json({
      success: true,
      message: "Successfully inserted food to meal",
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
    const foods = await Food.findAll({
      attributes: ["name", "calories", "protein", "carbohydrates", "fats"],
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
