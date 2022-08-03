const multer = require("multer");

const storageMiddleware = (req, res, next) => {
  next();
};

module.exports = storageMiddleware;
