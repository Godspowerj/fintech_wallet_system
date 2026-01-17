"use strict";
/**
 * =============================================================================
 * AUTH.MIDDLEWARE.TS - AUTHENTICATION & AUTHORIZATION
 * =============================================================================
 *
 * WHAT'S THE DIFFERENCE?
 * - AUTHENTICATION: "Who are you?" (checking the login token)
 * - AUTHORIZATION: "What can you do?" (checking permissions)
 *
 * HOW JWT AUTHENTICATION WORKS:
 *
 * 1. User logs in with email/password
 * 2. Server creates a JWT token (like a digital ID card)
 * 3. User sends this token with every request
 * 4. Server checks if the token is valid
 *
 * The token is sent in the "Authorization" header:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * "Bearer" is just a prefix that says "I'm sending a token"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
/**
 * AUTHENTICATE MIDDLEWARE
 *
 * This middleware checks if the user has a valid JWT token.
 * If valid: attaches user info to req.user and continues
 * If invalid: throws UnauthorizedError (401)
 *
 * USAGE IN ROUTES:
 *   router.get('/profile', authenticate, controller.getProfile)
 *
 * The request MUST include the header:
 *   Authorization: Bearer <token>
 */
const authenticate = async (req, _res, next) => {
    try {
        // Step 1: Get the Authorization header
        const authHeader = req.headers.authorization;
        // Step 2: Check if it exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.UnauthorizedError('No token provided');
        }
        // Step 3: Extract the token (remove "Bearer " prefix - 7 characters)
        const token = authHeader.substring(7);
        // Step 4: Verify the token and get the payload (user info)
        const payload = (0, jwt_1.verifyAccessToken)(token);
        // Step 5: Attach user info to the request object
        // Now any route handler can access req.user.userId, req.user.email, etc.
        req.user = payload;
        // Step 6: Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        // If anything fails, pass the error to the error handler
        next(error);
    }
};
exports.authenticate = authenticate;
/**
 * AUTHORIZE MIDDLEWARE
 *
 * This middleware checks if the user has the required ROLE.
 * Must be used AFTER authenticate (because we need req.user).
 *
 * USAGE IN ROUTES:
 *   router.get('/admin/users', authenticate, authorize('ADMIN'), controller.getUsers)
 *
 * This creates a "higher-order function" - a function that returns a function:
 *   authorize('ADMIN') returns a middleware function
 *
 * @param roles - Array of allowed roles (e.g., 'ADMIN', 'USER')
 */
const authorize = (...roles) => {
    // Return the actual middleware function
    return (req, _res, next) => {
        // Check if user is authenticated (authenticate should have run first)
        if (!req.user) {
            return next(new errors_1.UnauthorizedError('Authentication required'));
        }
        // Check if user's role is in the allowed roles
        // roles.includes('ADMIN') checks if 'ADMIN' is in the roles array
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.ForbiddenError('Insufficient permissions'));
        }
        // User has permission, continue
        next();
    };
};
exports.authorize = authorize;
/**
 * OPTIONAL AUTH MIDDLEWARE
 *
 * Similar to authenticate, but doesn't throw an error if no token.
 * Useful for routes that work for both guests and logged-in users.
 *
 * Example: A product page might show "Add to Wishlist" only for logged-in users
 *
 * USAGE:
 *   router.get('/products', optionalAuth, controller.getProducts)
 *   // In controller: if (req.user) { // user is logged in }
 */
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // If token is provided, try to verify it
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = (0, jwt_1.verifyAccessToken)(token);
            req.user = payload;
        }
        // If no token, that's fine - just continue without req.user
        next();
    }
    catch (error) {
        // If token is invalid, just continue without user (don't throw error)
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map