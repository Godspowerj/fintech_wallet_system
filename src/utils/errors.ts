/**
 * =============================================================================
 * ERRORS.TS - CUSTOM ERROR CLASSES
 * =============================================================================
 * 
 * WHY CUSTOM ERRORS?
 * Instead of throwing generic errors like:
 *   throw new Error('Not found')
 * 
 * We throw specific errors like:
 *   throw new NotFoundError('User not found')
 * 
 * Benefits:
 * 1. Each error knows its HTTP status code (404, 401, etc.)
 * 2. Error handler can identify the type and respond appropriately
 * 3. Better debugging - you know what type of error occurred
 * 
 * HTTP STATUS CODES REFRESHER:
 * - 400 Bad Request: Client sent invalid data
 * - 401 Unauthorized: Not logged in / invalid token
 * - 403 Forbidden: Logged in but not allowed
 * - 404 Not Found: Resource doesn't exist
 * - 409 Conflict: Resource already exists
 * - 422 Unprocessable Entity: Validation failed
 * - 500 Internal Server Error: Something broke on our side
 */

/**
 * BASE ERROR CLASS
 * 
 * All our custom errors extend this class.
 * It adds:
 * - statusCode: HTTP status to return
 * - isOperational: true = expected error, false = bug
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true // Operational errors are expected (not bugs)
  ) {
    super(message);
    // This line fixes a TypeScript issue with extending Error
    Object.setPrototypeOf(this, AppError.prototype);
    // Capture the stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 BAD REQUEST
 * Use when: Client sent data that doesn't make sense
 * Example: Trying to transfer negative money
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

/**
 * 401 UNAUTHORIZED
 * Use when: User is not logged in or token is invalid
 * Example: Accessing /profile without a token
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

/**
 * 403 FORBIDDEN
 * Use when: User is logged in but doesn't have permission
 * Example: Regular user trying to access admin routes
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

/**
 * 404 NOT FOUND
 * Use when: The requested resource doesn't exist
 * Example: Looking for wallet ID that doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

/**
 * 409 CONFLICT
 * Use when: Trying to create something that already exists
 * Example: Registering with an email that's already taken
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

/**
 * 422 VALIDATION ERROR
 * Use when: Input data fails validation rules
 * Example: Password too short, invalid email format
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public errors?: any) {
    super(422, message);
  }
}

/**
 * DOMAIN-SPECIFIC ERRORS
 * These are errors specific to our fintech domain
 */

/**
 * INSUFFICIENT FUNDS
 * Use when: User tries to send more money than they have
 */
export class InsufficientFundsError extends AppError {
  constructor(message = 'Insufficient funds') {
    super(400, message);
  }
}

/**
 * WALLET LOCKED
 * Use when: Another transaction is processing on the same wallet
 * This prevents double-spending race conditions
 */
export class WalletLockedError extends AppError {
  constructor(message = 'Wallet is locked by another operation') {
    super(409, message);
  }
}

/**
 * FRAUD DETECTED
 * Use when: Transaction is flagged by fraud detection
 */
export class FraudDetectedError extends AppError {
  constructor(message = 'Transaction flagged for fraud review') {
    super(403, message);
  }
}