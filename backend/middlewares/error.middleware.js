const StorageError = require("../exceptions/storage.error");
const ApiError = require("./../exceptions/ApiError");

const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  if (err instanceof ApiError || err instanceof StorageError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.error });
  }

  return res.status(500).json({ message: "Unexpected error" });
};
module.exports = errorMiddleware;
