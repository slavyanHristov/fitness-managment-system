const express = require("express");
const register = require("../controllers/register.controller");
const {
  authJwt
} = require("../middleware");
const router = express.Router();

router.post("/users/admin", register.createAdmin);
router.post("/users/manager", [authJwt.verifyToken, authJwt.isAdmin], register.registerManager);
router.post("/users/client", register.registerClient);
router.post("/gym", /*[authJwt.verifyToken, authJwt.isAdmin],*/ register.createGym)
router.post("/users/instructor", /*[authJwt.verifyToken, authJwt.isManager],*/ register.registerInstuctor)

module.exports = router;

// require all functions from the given controller
// create the routes
// export the router