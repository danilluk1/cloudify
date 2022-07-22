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

  async getUserByToken(refresh_token){
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
}

module.exports = new Repository(pool);
