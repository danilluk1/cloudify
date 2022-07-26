const { request } = require("express");
const multer = require("multer");
const ApiError = require("../exceptions/ApiError");
const storageService = require("../services/storage.service");
const tokenService = require("../services/token.service");
const StorageError = require("../exceptions/storage.error");
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
      const folder_id = req.headers["folder_id"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);
      const user = await storageService.updateFileInfoForUser(decoded, req.files, folder_id);
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

  async getUserFolders(req, res, next) {
    try {
      const { user_id } = req.params;
      const folders = await storageService
        .getUserFolders(user_id);
      console.log(folders);
      if (!folders) throw StorageError.DbError("Пользователь не существует");
      return res.json(folders);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StorageController();
