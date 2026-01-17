"use strict";
/**
 * =============================================================================
 * JWT.TS - JSON WEB TOKEN UTILITIES
 * =============================================================================
 *
 * WHAT IS JWT?
 * JWT (JSON Web Token) is a way to securely transmit information.
 * It's like a digital ID card that proves who you are.
 *
 * STRUCTURE (3 parts separated by dots):
 * eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMifQ.signature
 *        HEADER          .      PAYLOAD        . SIGNATURE
 *
 * - Header: Algorithm used (HS256)
 * - Payload: The data (userId, email, role, expiration)
 * - Signature: Proves the token wasn't tampered with
 *
 * HOW IT WORKS:
 * 1. User logs in with email/password
 * 2. Server creates JWT with user info, signs it with SECRET key
 * 3. Client stores the token (localStorage, cookies)
 * 4. Client sends token with every request
 * 5. Server verifies signature using the same SECRET key
 *
 * WHY TWO TOKENS?
 * - Access Token: Short-lived (15min), used for API requests
 * - Refresh Token: Long-lived (7 days), used to get new access tokens
 *
 * If someone steals your access token, they can only use it for 15 minutes.
 * The refresh token is stored more securely and rotated on use.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
const errors_1 = require("./errors");
/**
 * GENERATE ACCESS TOKEN
 *
 * Creates a short-lived token for API requests.
 *
 * @param payload - User info to encode in the token
 * @returns The signed JWT string
 *
 * Example:
 *   generateAccessToken({ userId: '123', email: 'user@example.com', role: 'USER' })
 *   // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, environment_1.env.JWT_ACCESS_SECRET, {
        expiresIn: environment_1.env.JWT_ACCESS_EXPIRY, // e.g., "15m" = 15 minutes
    });
};
exports.generateAccessToken = generateAccessToken;
/**
 * GENERATE REFRESH TOKEN
 *
 * Creates a long-lived token for getting new access tokens.
 * Uses a DIFFERENT secret than access tokens for extra security.
 */
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, environment_1.env.JWT_REFRESH_SECRET, {
        expiresIn: environment_1.env.JWT_REFRESH_EXPIRY, // e.g., "7d" = 7 days
    });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * VERIFY ACCESS TOKEN
 *
 * Checks if a token is valid (correct signature, not expired).
 * Returns the decoded payload if valid.
 * Throws UnauthorizedError if invalid.
 *
 * @param token - The JWT string to verify
 * @returns The decoded payload (userId, email, role)
 */
const verifyAccessToken = (token) => {
    try {
        // jwt.verify() checks the signature and expiration
        // If invalid, it throws an error
        return jsonwebtoken_1.default.verify(token, environment_1.env.JWT_ACCESS_SECRET);
    }
    catch (error) {
        // Convert JWT errors to our custom error
        throw new errors_1.UnauthorizedError('Invalid or expired access token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * VERIFY REFRESH TOKEN
 *
 * Same as verifyAccessToken but uses the refresh secret.
 */
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, environment_1.env.JWT_REFRESH_SECRET);
    }
    catch (error) {
        throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * DECODE TOKEN (WITHOUT VERIFICATION)
 *
 * Just reads the payload without checking if it's valid.
 * Useful for debugging or reading expired tokens.
 *
 * WARNING: Don't trust data from decoded tokens for security decisions!
 * Always verify first.
 */
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=jwt.js.map