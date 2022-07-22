const storageController = require("./../controllers/storage.controller");
const {body} = require("express-validator");
const Router = require("express");
const router = new Router();


router.post("/upload", authMiddleware, storageController.upload);
