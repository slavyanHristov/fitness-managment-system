const express = require("express");
const {
    upload
} = require("../middleware")
const router = express.Router();
const controller = require("../controllers/image.controller")

router.post('/upload', controller.uploadFiles)
router.post('/uploadGymImage', controller.uploadGymImage)
router.get('/getImages', controller.getImages)
router.get('/getAllImagesForGym/:gymId', controller.getAllImagesForGym)

module.exports = router;