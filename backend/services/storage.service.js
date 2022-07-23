const repository = require("../repository");
const fs = require("fs");
const multer = require("multer");
const tokenService = require("./token.service");
const { callbackify } = require("util");
const ApiError = require("../exceptions/ApiError");
class StorageService {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);
      console.log(req.file);
      cb(null, `${process.env.STORAGE}/${decoded.email}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  upload = multer({ storage: this.storage });

  async createUserBaseFolder(user) {
    const folderName = user.email;
    await repository.createNewFolder(folderName);
    const folder = await repository.getFolderByName(folderName);
    await repository.setUserFolder(user.id, folder.id);

    if (!fs.existsSync(process.env.STORAGE + folderName)) {
      fs.mkdirSync(process.env.STORAGE + folderName, { recursive: true });
    }
  }
  /*
    @param folderPath - path without user root folder
  */
  createFolder(user, folderPath) {
    if (!fs.existsSync(process.env.STORAGE + user.email + "/" + folderPath)) {
      const res = fs.mkdirSync(
        process.env.STORAGE + "/" + user.email + "/" + folderPath,
        { recursive: true }
      );

      if (!res) throw new ApiError.BadRequest("Couldn't create folder");

      repository.addFolderForUser(user.id, user.email + "/" + folderPath);
    }
  }
  /*
    @param folderPath - path without user root folder
    @param files - array of files, comes after multer middleware
  */
  createFiles(files, folderPath){

  }
}

module.exports = new StorageService();
