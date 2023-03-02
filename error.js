const Status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 202,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

class DatabaseError extends Error {
  constructor(message, statusCode = Status.NOT_FOUND) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = statusCode;
  }
}

module.exports = {
  DatabaseError,
  Status,
};
