const repository = require("../repository");
const fs = require("fs");
const multer = require("multer");
const tokenService = require("./token.service");
const { callbackify } = require("util");
const ApiError = require("../exceptions/ApiError");
const StorageError = require("../exceptions/storage.error");
class StorageService {

  /*
    !!!
    We don't need to care about the folder creation cus the express-upload do it for us,
    so @param files is array of files, in this framework format.
    @folder is the folder, that contains our file(path is relative from user root path)
    @folder_id is the id of the folder, that is last in @folder path
  */
  async uploadFiles(user, files, folder, folder_id){
    /*This array will contain a response info about uploaded files */
    let data = [];
    
    /*User root folder is his email, so let's assign it to constanst*/
    const user_root = user.email;
    /*
      Iterate through the array of file, and upload them into folders, with
      cheking names for duplicates etc....
    */
    _.forEach(_.keysIn(files), (key) => {
      let file = files.files[key];
      
      /*Write file into folder*/
      file.mv(`${process.env.STORAGE}/`)
    });
  }

  async createUserBaseFolder(user) {
    const folderName = user.email;
    await repository.createNewFolder(folderName, 0, true);
    const folder = await repository.getFolderByName(folderName);
    await repository.setUserFolder(user.id, folder.id);
    console.log(process.env.STORAGE);
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
  async updateFileInfoForUser(decoded, files, folder_id) {
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize += files[i].size;
    }
    console.log(totalSize);
    await repository.updateUserFileInfo(decoded, files, folder_id);
    const user = await repository.updateUserAvailableSpace(decoded, totalSize);

    return user;
  }
  

  async getUserFolders(user_id) {
    return repository.getUserFolders(user_id);
  }
}

module.exports = new StorageService();
