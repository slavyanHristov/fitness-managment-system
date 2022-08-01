const express = require("express");
const router = express.Router();
const controller = require("../controllers/fullAccess.controller");

router.get("/gyms/:id", controller.getOneGym);
router.get("/gyms", controller.getAllGyms);
router.get("/instructors", controller.getAllInstructors);

module.exports = router;
