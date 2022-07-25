const repository = require("../repository");
const fs = require("fs");
const multer = require("multer");
const tokenService = require("./token.service");
const { callbackify } = require("util");
const ApiError = require("../exceptions/ApiError");
const StorageError = require("../exceptions/storage.error");
class StorageService {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const authStr = req.headers["authorization"];
      const access_token = authStr.split(" ").pop();
      const decoded = tokenService.verifyToken(access_token);
      const folder = req.headers["folder"];
      cb(null, `${process.env.STORAGE}/${decoded.email}/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },

  });

  upload = multer({ storage: this.storage });

  async createUserBaseFolder(user) {
    const folderName = user.email;
    await repository.createNewFolder(folderName, 0);
    const folder = await repository.getFolderByName(folderName);
    await repository.setUserFolder(user.id, folder.id);

    if (!fs.existsSync(process.env.STORAGE + "/" + folderName)) {
      fs.mkdirSync(process.env.STORAGE + "/" + folderName, { recursive: true });
    }
  }
  /*
    @param folderPath - path without user root folder
  */
  createFolder(user, folderPath) {
    if (
      !fs.existsSync(process.env.STORAGE + "/" + user.email + "/" + folderPath)
    ) {
      const res = fs.mkdirSync(
        process.env.STORAGE + "/" + user.email + "/" + folderPath,
        { recursive: true }
      );

      if (!res) throw StorageError.UnableToCreateFolder();

      repository.addFolderForUser(user, user.email + "/" + folderPath);
    }
  }
  //TODO правильный путь папок для удаления
  deleteFolder(user, folderPath) {
    const fullPath = process.env.STORAGE + "/" + user.email + "/" + folderPath;

    if (fs.existsSync(fullPath)) {
      let res = 1;
      folderPath.split("/").forEach((folder) => {
        res = fs.rmdirSync(
          process.env.STORAGE + "/" + user.email + "/" + folder
        );
      });
      if (!res) throw StorageError.UnableToDeleteFolder();

      repository.deleteFolderForUser(user.id, user.email + "/" + folderPath);
    } else {
      throw StorageError.UnableToDeleteFolder();
    }
  }
  /*
    @param folderPath - path without user root folder
    @param files - array of files, comes after multer middleware
  */
  async updateSizeInfo(decoded, files){
    let totalSize = 0;
    for(let i = 0; i < files.length; i++) {
      totalSize += files[i].size;
    }
    console.log(totalSize);
    const user = await repository.updateUserAvailableSpace(decoded, totalSize);

    return user;
  }
}

module.exports = new StorageService();
