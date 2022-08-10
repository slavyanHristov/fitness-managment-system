const express = require("express");
const { authJwt } = require("../middleware");
const router = express.Router();
const controller = require("../controllers/instructor.controller");

router.post("/food/create", /* add auth*/ controller.postFood);
router.post(
  "/meal-plan/create",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.createMealPlan
);
router.post(
  "/eating-day/create",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.createEatingDay
);
// router.post("/meals/addFood", controller.createMealFood);
router.post(
  "/eating-day/addMealFood",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.postMealFood_EatingDay
);
router.get("/meals", controller.getAllMeals);
router.get("/getFoods", controller.getFoods);
router.get("/getFoodsInMeals", controller.getFoodsInMeals);
router.get(
  "/getMealPlan/:mealPlanId",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getMealPlan
);
router.post(
  "/assignMealPlan",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.assignMealPlan
);
router.post(
  "/routines/assign",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.assignRoutine
);
// -------------TEST-------------
router.post("/bulk-create", controller.testingBulk);
router.get(
  "/find-bulk/:id",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.testingFind
);
router.get(
  "/routines",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getYourRoutines
);
// router.get(
//   "/routines/:id",
//   [authJwt.verifyToken, authJwt.isInstructor],
//   controller.getSingleRoutine
// );
router.get(
  "/routines/workouts/:routineId",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getWorkouts
);
router.get(
  "/routines/:id",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getRoutine
);
router.get(
  "/exercises",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getAllExercises
);
router.post(
  "/bulk-create-routine",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.testingBulkRoutine
);
router.get("/find-bulk-routine/:routineId", controller.testingFindRoutine);

router.post(
  "/routines/create",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.createRoutine
);
router.post(
  "/routines/create/workout",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.createWorkout
);
router.post(
  "/routines/add/exercise",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.addExerciseToWorkout
);

router.get(
  "/clients",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getYourClients
);
router.delete(
  "/routines/delete/exercise/:id",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.deleteExerciseFromWorkout
);
router.patch(
  "/edit/client/:clientId",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.editClient
);

router.get(
  "/dashboard-data",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getDashboardData
);
module.exports = router;
