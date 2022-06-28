const express = require("express");
const {
    authJwt
} = require("../middleware");
const router = express.Router();
const controller = require("../controllers/admin.controller")

router.get('/gym/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.getOneGym)
router.get('/gyms', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllGyms)
router.get('/managers', [authJwt.verifyToken, authJwt.isAdmin], controller.getAllManagers)
router.get('/manager/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.getOneManager)
router.delete('/gym/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.deleteGym)
router.patch('/gym/update/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.updateGym)
router.post('/test/send-mail', [authJwt.verifyToken, authJwt.isAdmin], controller.sendMailManager)
router.post('/send-mail', controller.sendMail)
module.exports = router