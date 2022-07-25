const { request } = require("express");
const multer = require("multer");
const ApiError = require("../exceptions/ApiError");
const storageService = require("../services/storage.service");
const tokenService = require("../services/token.service");

class StorageController {
  async upload(req, res, next) {
    try {
      const folder = req.headers["folder"];
      if (!folder) throw ApiError.BadRequest("Invalid folder");
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);
      storageService.createFolder(decoded, folder);
      next();
    } catch (e) {
      next(e);
    }
  }

  async uploadFinished(req, res, next) {
    try {
      console.log(req.files);
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);
      const user = await storageService.updateSizeInfo(decoded, req.files);
      return res.status(200).json({
        space_available: user.space_available,
      });
    } catch (e) {
      next(e);
    }
  }

  async createFolder(req, res, next) {
    try {
      const { folderPath } = req.body;
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);

      storageService.createFolder(decoded, folderPath);

      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteFolder(req, res, next) {
    try {
      const { folderPath } = req.body;
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);

      storageService.deleteFolder(decoded, folderPath);

      return res.status(200).json({
        message: "Success",
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StorageController();
