const express = require("express");
const { authJwt } = require("../middleware");
const router = express.Router();
const controller = require("../controllers/client.controller");

router.patch(
  "/setInstructor/:id",
  [authJwt.verifyToken, authJwt.isClient],
  controller.setInstructor
);
router.get(
  "/instructors",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getInstructorsInGym
);
router.get(
  "/dashboard-data",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getDashboardData
);
router.get(
  "/routine",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getRoutine
);
router.get(
  "/mealPlan",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getMealPlan
);
router.post(
  "/pay",
  [authJwt.verifyToken, authJwt.isClient],
  controller.payment
);
router.get(
  "/foods",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getAllFoods
);
router.post(
  "/mealPlan/add/food",
  [authJwt.verifyToken, authJwt.isClient],
  controller.addFoodToMeal
);
router.delete(
  "/mealPlan/delete/food/:id",
  [authJwt.verifyToken, authJwt.isClient],
  controller.deleteFoodFromMeal
);

router.get("/success", controller.paymentSuccess);
router.get("/cancel", controller.paymentCancel);
router.get(
  "/membership/get",
  [authJwt.verifyToken, authJwt.isClient],
  controller.getMembership
);

module.exports = router;
