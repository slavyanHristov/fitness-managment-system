const express = require("express");
const auth = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", auth.authenticateUser);
router.post("/refresh-token", auth.refreshToken);
router.delete("/logout", auth.logout)
router.post("/new-password", auth.newPassword)
router.post("/reset-password-request", auth.resetPasswordRequest)
router.post("/finalize-account", auth.finalizeAccount)

module.exports = router