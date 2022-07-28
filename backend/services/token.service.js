const jwt = require("jsonwebtoken");
const ApiError = require("../exceptions/ApiError");

class TokenService {
  /*
    If auth string has valid format, and valid token, then return decoded info
    such as email and user_id. Otherwise return null
  */
  parseAuthString(authStr) {
    const access_token = authStr.split(" ").pop();
    if (!access_token) return null;

    const decoded = this.verifyAccessToken(access_token);
    if (!decoded) return null;

    return decoded;
  }

  verifyAccessToken(access_token) {
    try {
      const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);
      return decoded;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  verifyRefreshToken(access_token) {
    try {
      const decoded = jwt.verify(
        access_token,
        process.env.REFRESH_TOKEN_SECRET
      );
      return decoded;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  generateTokens(user) {
    const refresh_token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    const access_token = jwt.sign(
      {
        email: user.email,
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return { access_token, refresh_token };
  }
}

module.exports = new TokenService();
