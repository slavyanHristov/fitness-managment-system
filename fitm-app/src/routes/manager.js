const express = require("express");
const {
    authJwt
} = require("../middleware");
const router = express.Router();
const controller = require('../controllers/manager.controller')

router.get('/employees', [authJwt.verifyToken, authJwt.isManager], controller.getAllEmployees)
router.get('/employees/:id', [authJwt.verifyToken, authJwt.isManager], controller.getOneEmployee)
router.delete('/employees/:id', [authJwt.verifyToken, authJwt.isManager], controller.deleteEmployee)
router.patch('/employees/update/:id', [authJwt.verifyToken, authJwt.isManager], controller.updateEmployee)
router.get('/clients', [authJwt.verifyToken, authJwt.isManager], controller.getAllClients)
router.get('/clients/:id', [authJwt.verifyToken, authJwt.isManager], controller.getOneClient)

module.exports = router