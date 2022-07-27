const repository = require("../repository");
const fs = require("fs");
const multer = require("multer");
const tokenService = require("./token.service");
const ApiError = require("../exceptions/ApiError");
const StorageError = require("../exceptions/storage.error");
const _ = require("lodash");
class StorageService {
  /*
    !!!
    We don't need to care about the folder creation cus the express-upload do it for us,
    so @param files is array of files, in this framework format.
    @folder is the folder, that contains our file(path is relative from user root path)
    @folder_id is the id of the folder, that is last in @folder path
  */
  async uploadFiles(user, files, folder, folder_id) {
    /*This array will contain a response info about uploaded files */
    let data = [];

    /*Check, that user is exists in our database*/
    let dbUser = await repository.getUserById(user.id);
    if (!dbUser) throw StorageError.DbError("Unable to find info about user");

    /*Lets' get our path from user root folder to dbFolder*/
    const user_root = await repository.getUserRootFolder(dbUser.id);

    // /*Let's get the last folder of our path to file*/
    const dbFolder = await repository.getFolderById(folder_id);
    if (!dbFolder) throw StorageError.DbError("Folder id is wrong.");
    if (dbFolder.name !== folder.split("/").pop())
      throw StorageError.DbError("Folder is doesn't exist.");

    if (dbFolder.id !== Number(folder_id))
      throw StorageError.DbError("Folder id is wrong.");
    /*
      Iterate through the array of file, and upload them into folders, with
      cheking names for duplicates etc....
    */

    _.forEach(_.keysIn(files.files), (key) => {
      let file = files.files[key];
      /*Getting a full path to file basing on user_root*/
      const filePath = `${process.env.STORAGE}/${user_root.name}/${folder}`;
      /*To change, file.name after write it into variable*/
      let fileName = file.name;
      /*
        We need to checkup, that file with the same name is exists in folder,
        if yes, we need(to add (number) to the end of path name), otherwise, just
        upload it to cloudify with original name
        Maybe, we need to count number of file with the same name, and
        chnage Data.now() to count + 1, but this is unnecessary
      */
      if (fs.existsSync(`${filePath}/${fileName}`)) {
        fileName = Date.now() + "-" + fileName;
      }
      /*Write file into folder*/
      /*Folder will created if doesn't exist*/
      file.mv(`${filePath}/${fileName}`);

      /*
        We need to fill data, cus we changes fileName outside the array, so
        we need a new one
      */
      data.push({
        name: fileName,
        size: file.size,
      });
    });
    /*Make changes about new files in our db*/
    await repository.updateUserFilesInfo(dbUser, data, folder_id);

    /*Let's update info about user in our code cus, we need to know how much space left*/
    dbUser = await repository.getUserById(user.id);
    
    return {files: [...data], space_available: dbUser.space_available};
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
