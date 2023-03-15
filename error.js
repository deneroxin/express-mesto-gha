const Status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

class GeneralError extends Error {
  constructor(message, statusCode = Status.NOT_FOUND) {
    super(message);
    this.name = 'GeneralError';
    this.statusCode = statusCode;
  }
}

module.exports = {
  GeneralError,
  Status,
};
