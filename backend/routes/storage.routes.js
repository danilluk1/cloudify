const storageController = require("./../controllers/storage.controller");
const { body } = require("express-validator");
const Router = require("express");
const storageMiddleware = require("../middlewares/storage.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const {upload} = require("../index");
const router = new Router();

router.post(
  "/upload",
  authMiddleware,
  storageController.uploadFile
);

module.exports = router;
