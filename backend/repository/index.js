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

  async createNewFolder(name) {
    await pool.query(`INSERT INTO folders (name) VALUES ('${name}');`);
  }

  async getFolderByName(name) {
    const res = await pool.query(`SELECT * FROM folders WHERE name='${name}';`);
    return res.rows[0];
  }

  async setUserFolder(userId, folderId) {
    await pool.query(
      `INSERT INTO user_folders (user_id, folder_id) VALUES (${userId}, ${folderId});`
    );
  }

  async updateUserAvailableSpace(userId, fileSize){
    const user = this.getUserById(userId);
    await pool.query(`UPDATE users SET space_available = '${user.space_available - fileSize / 1024 / 1024/ 1024}' WHERE id='${userId}'`);
  }
  /*
    @param folderPath - path without user root folder
  */
  async addFolderForUser(userId, folderPath){
    const folders = folderPath.split();

    folders.forEach(async folder => {
      await this.createNewFolder(folder);
      const folderDb = await this.getFolderByName(folder);
      await this.setUserFolder(userId, folderDb.id);
    });
  }
}

module.exports = new Repository(pool);
