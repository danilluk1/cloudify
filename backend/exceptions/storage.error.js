class StorageError extends Error {
  status;
  error;

  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.error = error;
  }

  static UnableToCreateFolder() {
    return new StorageError(500, "Unable to create folder");
  }

  static UnableToDeleteFolder() {
    return new StorageError(500, "Unable to delete folder");
  }
}

module.exports = StorageError;
