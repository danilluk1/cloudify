const jwt = require('jsonwebtoken');

class TokenService {

  verifyToken(token){
    try{
      const decoded = jwt.verify(token, 'secret123');
      return decoded;
    }
    catch(e){
      return null;
    }
  }

  generateTokens(user){
    const refresh_token = jwt.sign({
      email: user.email,
      id: user.id,
    }, 'secret123', {expiresIn: '30d'});

    const access_token = jwt.sign({
      email: user.email,
      id: user.id,
    }, 'secret123', {expiresIn: '1d'});


    return {access_token, refresh_token};
  }
}

module.exports = new TokenService();