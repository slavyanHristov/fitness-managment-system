const express = require("express");
const register = require("../controllers/register.controller");
const { authJwt, upload, checkFileType } = require("../middleware");
const router = express.Router();

router.post("/users/admin", register.createAdmin);
router.post(
  "/users/manager",
  [authJwt.verifyToken, authJwt.isAdmin],
  register.registerManager
);
router.post("/users/client", register.registerClient);
router.post(
  "/gym",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    upload.array("multiFiles", 4),
    checkFileType,
  ],
  register.createGym
);
router.post(
  "/users/instructor",
  [authJwt.verifyToken, authJwt.isManager],
  register.registerInstuctor
);
router.post(
  "/users/employee",
  [authJwt.verifyToken, authJwt.isManager],
  register.registerEmployee
);

module.exports = router;
