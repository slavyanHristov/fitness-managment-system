const express = require('express')
const auth = require('../controllers/auth.controller')
const register = require('../controllers/register.controller')
const { authJwt } = require("../middleware");
const router = express.Router()

router.post('/admin', register.createAdmin)
router.post('/manager', [authJwt.verifyToken, authJwt.isAdmin], register.registerManager)
router.post('/client', register.registerClient)
router.post('/login', auth.authenticateUser)
router.post('/refresh-token', auth.refreshToken)

module.exports = router

// require all functions from the given controller
// create the routes
// export the router