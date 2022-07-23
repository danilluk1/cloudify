const repository = require('../repository');
const fs = require('fs');
class StorageService {
  async createUserBaseFolder(user){
    const folderName = user.email;
    await repository.createNewFolder(folderName);
    const folder = await repository.getFolderByName(folderName);
    await repository.setUserFolder(user.id, folder.id);

    if(!fs.existsSync(process.env.STORAGE + folderName)){
      fs.mkdirSync(process.env.STORAGE + folderName, { recursive: true });
    }
  }
}

module.exports = new StorageService();