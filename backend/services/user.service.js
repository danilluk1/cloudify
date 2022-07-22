const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const userRepository = require("../repository/index");
const ApiError = require("../exceptions/ApiError");

class UserService {
  /*
    email, password
  */
  async register(userRegisterDto) {
    const { email, password } = userRegisterDto;
    const passHash = await bcrypt.hash(password, 10);

    await userRepository.addNewUser(email, passHash);
    const user = await userRepository.getUserByEmail(email);

    const tokens = tokenService.generateTokens(user);
    await userRepository.setUserToken(user.id, tokens.refresh_token);

    delete user["password"];
    return {...user, ...tokens};
  }

  async login(userRegisterDto){
    const { email, password } = userRegisterDto;
    const user = await userRepository.getUserByEmail(email);
    if(!user){
      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const isCorrectPassword = bcrypt.compare(user.password, password);

    if(!isCorrectPassword){
      throw ApiError.BadRequest("Неверный логин или пароль");
    }

    const tokens = tokenService.generateTokens(user);
    await userRepository.setUserToken(user.id, tokens.refresh_token);

    delete user["password"];
    return {...user, ...tokens};
  }

  async refresh(refresh_token){
    const decoded = tokenService.verifyToken(refresh_token);
    if(!decoded) throw ApiError.UnauthorizedError();

    const user = await userRepository.getUserById(decoded.id);

    const tokens = tokenService.generateTokens(user);
    await userRepository.setUserToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(refresh_token){
    const user = await userRepository.getUserByToken(refresh_token);

    if(!user) throw ApiError.UnauthorizedError();

    await userRepository.setUserToken(user.id, '');
  }
}

module.exports = new UserService();
