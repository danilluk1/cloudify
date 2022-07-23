const storageController = require("./../controllers/storage.controller");
const { body } = require("express-validator");
const Router = require("express");
const storageMiddleware = require("../middlewares/storage.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const router = new Router();
const multer = require("multer");
const storageService = require("../services/storage.service");
const upload = multer({ dest: "public/storage" });
router.post(
  "/upload",
  authMiddleware,
  storageService.upload.array("files"),
  storageController.upload
);

router.post(
  "/create-folder",
  authMiddleware,
  storageController.createFolder
);

module.exports = router;
