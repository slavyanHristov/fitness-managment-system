const env = process.env.NODE_ENV || "development";
const { CLIENT_URL, APP_DOMAIN } = require("../../config/config")[env];
const clientService = require("../services/clientService");
const { flatten } = require("../utils");
const paypal = require("paypal-rest-sdk");

exports.setInstructor = async (req, res) => {
  const instructorId = req.params.id;

  if (!instructorId) {
    return res.status(404).json({
      success: false,
      message: "Please provide an instructor!",
    });
  }

  try {
    const loggedClient = await clientService.setInstructor(
      instructorId,
      req.clientId
    );

    return res.status(200).json({
      success: true,
      message: "You now have a fitness instructor!",
      loggedClient,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getInstructorsInGym = async (req, res) => {
  try {
    const instructors = await clientService.getInstructorsInGym(req.clientId);
    return res.status(200).json({
      success: true,
      collection: instructors,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
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

    const isMembershipExistent = await clientService.findMembership(
      req.clientId
    );
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

exports.paymentSuccess = async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
  };
  try {
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async (error, payment) => {
        if (error) {
          console.log(error);
          throw error;
        } else {
          const membershipData = clientService.splitString(
            payment.transactions[0].custom
          );
          await clientService.createOrRenewMembership(membershipData);
          return res.redirect(`${CLIENT_URL}/success`);
        }
      }
    );
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.paymentCancel = (req, res) => {
  return res.redirect(`${CLIENT_URL}`);
};

exports.getMembership = async (req, res) => {
  try {
    const membership = await clientService.getMembership(req.clientId);
    return res.status(200).json({
      success: true,
      membership: membership,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getRoutine = async (req, res) => {
  try {
    const clientRoutine = await clientService.getRoutine(req.clientId);
    return res.status(200).json({
      success: true,
      routine: clientRoutine,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await clientService.getMealPlan(req.clientId);
    return res.status(200).json({
      success: true,
      mealPlan: mealPlan,
    });
  } catch (err) {
    return res.status(err?.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.addFoodToMeal = async (req, res) => {
  const { foodId, mealId, quantity } = req.body;
  try {
    const serviceResponse = await clientService.addFoodToMeal(
      foodId,
      mealId,
      quantity
    );
    return res.status(serviceResponse?.status || 400).json({
      success: serviceResponse?.success || false,
      message: serviceResponse?.message || "Something went wrong!",
    });
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
    await clientService.deleteFoodFromMeal(foodId);
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
    const { userData, client, membership } =
      await clientService.getDashboardData(req.id, req.clientId);
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
    const foods = await clientService.getAllFoods();
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
