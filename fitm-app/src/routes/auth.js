const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();


router.post("/login", controller.authenticateUser);
router.post("/refresh-token", controller.refreshToken);
router.delete("/logout", controller.logout)
router.post("/finalize-account", controller.finalizeAccount)

module.exports = router