const ApiError = require("../exceptions/ApiError");


const authMiddleware = (req, res, next) => {
  const authStr = req.headers['authorization'];
  if(!authStr) return next(ApiError.UnauthorizedError());

  const access_token = authStr.split(' ').pop();

  if(!access_token) return next(ApiError.UnauthorizedError());

  const decoded = tokenService.verifyToken(access_token);
  if (!decoded) return next(ApiError.UnautorizedError());

  next();
}

module.exports = authMiddleware;