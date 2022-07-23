const multer = require("multer");



const storageMiddleware = (req, res, next) => {
  console.log(req.body.file)
  next();
};

module.exports = storageMiddleware;
