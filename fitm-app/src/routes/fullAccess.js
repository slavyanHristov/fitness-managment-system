const express = require("express");
const router = express.Router();
const controller = require("../controllers/fullAccess.controller");

router.get("/gyms/:id", controller.getOneGym);
router.get("/gyms", controller.getAllGyms);
router.get("/instructors", controller.getAllInstructors);
router.get("/data-count", controller.getDataCount);

module.exports = router;
