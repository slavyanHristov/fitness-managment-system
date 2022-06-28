const express = require("express");
const {
    authJwt
} = require("../middleware");
const router = express.Router();
const controller = require('../controllers/instructor.controller')

router.post('/food/create', /* add auth*/ controller.postFood)
router.post('/meal-plan/create', [authJwt.verifyToken, authJwt.isInstructor], controller.createMealPlan)
router.post('/eating-day/create', [authJwt.verifyToken, authJwt.isInstructor], controller.createEatingDay)
router.post('/meals/addFood', controller.createMealFood)
router.post('/eating-day/addMealFood', [authJwt.verifyToken, authJwt.isInstructor], controller.postMealFood_EatingDay)
router.get('/meals', controller.getAllMeals)
router.get('/getFoods', controller.getFoods)
router.get('/getFoodsInMeals', controller.getFoodsInMeals)
router.get('/getMealPlan/:mealPlanId', [authJwt.verifyToken, authJwt.isInstructor], controller.getMealPlan)
router.post('/assignMealPlan', [authJwt.verifyToken, authJwt.isInstructor], controller.assignMealPlan)
// -------------TEST-------------
router.post('/bulk-create', [authJwt.verifyToken, authJwt.isInstructor], controller.testingBulk)
router.get('/find-bulk', controller.testingFind)
router.post('/bulk-create-routine', [authJwt.verifyToken, authJwt.isInstructor], controller.testingBulkRoutine)
router.get('/find-bulk-routine/:routineId', controller.testingFindRoutine)



module.exports = router