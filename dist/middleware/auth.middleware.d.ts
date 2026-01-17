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
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
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
export declare const authenticate: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
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
export declare const authorize: (...roles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
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
export declare const optionalAuth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.middleware.d.ts.map