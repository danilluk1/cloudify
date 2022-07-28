class StorageError extends Error {
  status;
  error;

  constructor(status, message, error = []) {
    super(message);
    this.status = status;
    this.error = error;
  }

  static UnableToCreateFolder(message = "Unable to create folder") {
    return new StorageError(500, message);
  }

  static UnableToDeleteFolder() {
    return new StorageError(500, "Unable to delete folder");
  }

  static DbError(message){
    return new StorageError(500, message);
  }
}

module.exports = StorageError;
