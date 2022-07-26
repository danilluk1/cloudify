const ApiError = require("../exceptions/ApiError");
const repository = require("../repository");
const tokenService = require("../services/token.service");

const authMiddleware = (req, res, next) => {
  const authStr = req.headers["authorization"];
  if (!authStr) return next(ApiError.UnauthorizedError());

  const access_token = authStr.split(" ").pop();

  if (!access_token) return next(ApiError.UnauthorizedError());

  const decoded = tokenService.verifyAccessToken(access_token);
  if (!decoded) return next(ApiError.UnauthorizedError());

  const dbUser = repository.getUserById(decoded.id);
  if(!dbUser) return next(ApiError.UnauthorizedError());

  next();
};

module.exports = authMiddleware;
