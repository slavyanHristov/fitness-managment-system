const express = require("express");
const {
    authJwt
} = require("../middleware");
const router = express.Router();
const controller = require('../controllers/client.controller')

router.post('/membership/create', [authJwt.verifyToken, authJwt.isClient], controller.createMembership)
router.post('/membership/verifyEndDate', /*add auth*/ controller.verifyEndDate)
router.patch('/setInstructor/:id', [authJwt.verifyToken, authJwt.isClient], controller.setInstructor)

module.exports = router