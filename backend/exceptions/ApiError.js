class ApiError extends Error {
  status;
  error;
  
  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.error = error;
  }

  static UnauthorizedError() {
    return new ApiError(401, "Unauthorized error");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, "Bad request", errors);
  }
}

module.exports = ApiError;
