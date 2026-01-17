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
/**
 * PAYLOAD INTERFACE
 *
 * This defines what information we store in the token.
 * Keep it minimal - tokens are sent with every request!
 */
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
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
export declare const generateAccessToken: (payload: JwtPayload) => string;
/**
 * GENERATE REFRESH TOKEN
 *
 * Creates a long-lived token for getting new access tokens.
 * Uses a DIFFERENT secret than access tokens for extra security.
 */
export declare const generateRefreshToken: (payload: JwtPayload) => string;
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
export declare const verifyAccessToken: (token: string) => JwtPayload;
/**
 * VERIFY REFRESH TOKEN
 *
 * Same as verifyAccessToken but uses the refresh secret.
 */
export declare const verifyRefreshToken: (token: string) => JwtPayload;
/**
 * DECODE TOKEN (WITHOUT VERIFICATION)
 *
 * Just reads the payload without checking if it's valid.
 * Useful for debugging or reading expired tokens.
 *
 * WARNING: Don't trust data from decoded tokens for security decisions!
 * Always verify first.
 */
export declare const decodeToken: (token: string) => JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map