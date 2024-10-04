class ErrorBase extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

class BadRequestError extends ErrorBase {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

class UnauthorizedError extends ErrorBase {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

class ForbiddenError extends ErrorBase {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

class NotFoundError extends ErrorBase {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

class UnprocessableEntityError extends ErrorBase {
    constructor(message = "Unprocessable Entity") {
      super(message, 422)
    }
}

module.exports = {
    ErrorBase,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    UnprocessableEntityError
};