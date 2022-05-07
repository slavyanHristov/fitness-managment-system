const { authJwt } = require("../middleware");
const controller = require("../controllers/test.controller");
const express = require('express')

const router = express.Router() 

router.get('/all', controller.allAccess)
.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard)

module.exports = router
