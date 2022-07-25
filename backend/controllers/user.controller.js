const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/ApiError");
const storageService = require("../services/storage.service");
const userService = require("../services/user.service");

class UserController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка валидации", errors.array()));
      }

      const userRegisterDto = req.body;
      const user = await userService.register(userRegisterDto);
      storageService.createUserBaseFolder(user);
      res.cookie("refresh_token", user.refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      delete user["refresh_token"];

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      req.headers
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Ошибка валидации", errors.array()));
      }

      const user = await userService.login(req.body);

      res.cookie("refresh_token", user.refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      delete user["refresh_token"];

      return res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      const tokens = await userService.refresh(refresh_token);

      return res.json(tokens);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const { refresh_token } = req.cookies;
      await userService.logout(refresh_token);

      res.clearCookie("refresh_token");

      return res.status(200).json({
        message: "Success",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
