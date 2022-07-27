const { request } = require("express");
const multer = require("multer");
const ApiError = require("../exceptions/ApiError");
const storageService = require("../services/storage.service");
const tokenService = require("../services/token.service");
const StorageError = require("../exceptions/storage.error");
const _ = require("lodash");
class StorageController {
  // async upload(req, res, next) {
  //   try {
  //     const folder = req.headers["folder"];
  //     if (!folder) throw ApiError.BadRequest("Invalid folder");
  //     const authStr = req.headers["authorization"];
  //     const access_token = authStr.split(" ").pop();
  //     const decoded = tokenService.verifyToken(access_token);
  //     storageService.createFolder(decoded, folder);
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  async upload(req, res, next) {
    try {
      /*Our request must contain files, folderPath(realtive from user root), folder_id */
      if (!req.files || !req.body.folder || !req.body.folder_id) {
        next(ApiError.BadRequest("No files specified"));
      }

      /*Get authStr from header authorization*/
      const authStr = req.headers["authorization"];
      const decoded_user = tokenService.parseAuthString(authStr);

      const storageInfo = await storageService.uploadFiles(
        decoded_user,
        req.files,
        req.body.folder,
        req.body.folder_id
      );
      return res.json(storageInfo);
    } catch (err) {
      console.log(err);
      next(err);
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
      const folders = await storageService.getUserFolders(user_id);
      console.log(folders);
      if (!folders) throw StorageError.DbError("Пользователь не существует");
      return res.json(folders);
    } catch (e) {
      next(e);
    }
  }

  async getFolderFiles(req, res, next) {
    try {
      const { folder_id } = req.params;
      const files = await storageService.getFolderFiles(folder_id);
      console.log(files);
      return res.json(files);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new StorageController();
