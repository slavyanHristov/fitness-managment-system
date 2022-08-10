const express = require("express");
const { authJwt, upload, checkFileType, updates } = require("../middleware");
const multer = require("multer");

const router = express.Router();
const controller = require("../controllers/admin.controller");

router.get(
  "/managers",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getAllManagers
);
router.get(
  "/dashboard-data",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getDashboardData
);
router.get(
  "/manager/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.getOneManager
);
router.delete(
  "/gym/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.deleteGym
);
router.patch(
  "/gym/update/:id",
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    upload.array("gymImgs", 4),
    checkFileType,
  ],
  controller.updateGym
);
router.post(
  "/test/send-mail",
  [authJwt.verifyToken, authJwt.isAdmin],
  controller.sendMailManager
);
router.post("/send-mail", controller.sendMail);
module.exports = router;
