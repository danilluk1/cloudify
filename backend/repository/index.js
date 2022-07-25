const pool = require("./../db");

class Repository {
  pool;

  constructor(pool) {
    this.pool = pool;
  }

  async addNewUser(email, pass_hash) {
    await pool.query(
      `INSERT INTO users (email, password) VALUES ('${email}', '${pass_hash}');`
    );
  }

  async setUserToken(id, token) {
    await pool.query(
      `UPDATE users SET refresh_token = '${token}' WHERE id = ${id};`
    );
  }

  async getUserByToken(refresh_token) {
    const res = await pool.query(
      `SELECT * FROM users WHERE refresh_token = '${refresh_token}';`
    );
    return res.rows[0];
  }

  async getUserByEmail(email) {
    const res = await pool.query(
      `SELECT * FROM users WHERE email = '${email}';`
    );
    return res.rows[0];
  }

  async getUserById(id) {
    const res = await pool.query(`SELECT * FROM users WHERE id = '${id}';`);
    return res.rows[0];
  }

  async createNewFolder(name, parentId) {
    await pool.query(
      `INSERT INTO folders (name, parent_id) VALUES ('${name}', ${parentId});`
    );
  }

  async getFolderByName(name) {
    const res = await pool.query(`SELECT * FROM folders WHERE name='${name}';`);
    return await res.rows[0];
  }

  async setUserFolder(userId, folderId) {
    await pool.query(
      `INSERT INTO user_folders (user_id, folder_id) VALUES (${userId}, ${folderId});`
    );
  }

  async updateUserAvailableSpace(user, fileSize) {
    const dbUser = await this.getUserById(user.id);
    await pool.query(
      `UPDATE users SET space_available=${
        dbUser.space_available - fileSize
      }WHERE id=${user.id};`
    );

    return await this.getUserById(user.id);
  }

  async addFolderForUser(user, folderPath) {
    let folders = folderPath.split("/");
    const userRootFolder = await this.getFolderByName(user.email);
    folders.shift();
    let parentFolder = userRootFolder;
    for (let i = 0; i < folders.length; i++) {
      await this.createNewFolder(folders[i], parentFolder.id);
      parentFolder = await this.getFolderByName(folders[i]);
      await this.setUserFolder(user.id, parentFolder.id);
    }
  }

  async deleteFolder(folder, userId) {
    await pool.query(`DELETE FROM folders WHERE folder.id=${folder.id}`);
    await pool.query(
      `DELETE FROM user_folders WHERE folder_id${(folder.id =
        id)} AND user_id=${userId}`
    );
  }

  async deleteFolderForUser(userId, folderPath) {
    const folders = folderPath.split("/");

    folders.forEach(async (folder) => {
      const folderDb = await this.getFolderByName(folder);
      await this.deleteFolder(folder, userId);
    });
  }
}

module.exports = new Repository(pool);
