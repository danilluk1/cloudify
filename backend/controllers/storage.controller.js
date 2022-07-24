const multer = require("multer");
const storageService = require("../services/storage.service");
const tokenService = require("../services/token.service");

class StorageController {
  async upload(req, res, next) {
    try {
    } catch (e) {}
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
