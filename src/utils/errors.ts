/*
 * Custom error classes for better error handling
 */

// base error - all others extend this
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - bad request
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

// 401 - not logged in
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

// 403 - logged in but not allowed
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

// 404 - not found
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

// 409 - already exists
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

// 422 - validation failed
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public errors?: any) {
    super(422, message);
  }
}

// not enough money
export class InsufficientFundsError extends AppError {
  constructor(message = 'Insufficient funds') {
    super(400, message);
  }
}

// wallet busy with another transaction
export class WalletLockedError extends AppError {
  constructor(message = 'Wallet is locked by another operation') {
    super(409, message);
  }
}

// suspicious transaction
export class FraudDetectedError extends AppError {
  constructor(message = 'Transaction flagged for fraud review') {
    super(403, message);
  }
}