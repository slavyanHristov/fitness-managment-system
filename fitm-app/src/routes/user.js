const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const { authJwt, upload } = require("../middleware");

router.post("/new-password", controller.newPassword);
router.post("/reset-password-request", controller.resetPasswordRequest);
router.get("/isUserExpired", [authJwt.verifyToken], controller.isUserExpired);
router.get("/getUserData", [authJwt.verifyToken], controller.getUserData);
router.get("/getUserImage", [authJwt.verifyToken], controller.getUserImage);
router.post(
  "/changeProfilePicture",
  [authJwt.verifyToken, upload.single("profilePic")],
  controller.changeProfilePicture
);
router.get("/new", [authJwt.verifyToken], controller.getNewUser);
module.exports = router;
