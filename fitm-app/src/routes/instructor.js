const express = require("express");
const { authJwt } = require("../middleware");
const router = express.Router();
const controller = require("../controllers/instructor.controller");

router.post(
  "/meal-plan/create",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.createMealPlan
);

router.get("/getFoods", controller.getFoods);
router.post("/bulk-create", controller.insertMandatoryRecords);
router.get(
  "/routines",
  [authJwt.verifyToken, authJwt.isInstructor],
  controller.getYourRoutines
);
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
