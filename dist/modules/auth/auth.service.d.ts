/**
 * =============================================================================
 * AUTH.SERVICE.TS - AUTHENTICATION BUSINESS LOGIC
 * =============================================================================
 *
 * WHAT IS A SERVICE?
 * Services contain the "business logic" - the actual work of your app.
 *
 * Controller vs Service:
 * - Controller: Handles HTTP (receives request, sends response)
 * - Service: Does the actual work (database operations, calculations)
 *
 * WHY SEPARATE THEM?
 * 1. Reusability: Services can be used by controllers, workers, tests
 * 2. Testing: Easier to test business logic without HTTP
 * 3. Clean code: Each file has one responsibility
 *
 * AUTHENTICATION FLOW:
 *
 * REGISTER:
 * 1. Check if email already exists
 * 2. Hash the password (never store plain passwords!)
 * 3. Create user in database
 * 4. Create a wallet for the user
 * 5. Return success (in production, send verification email)
 *
 * LOGIN:
 * 1. Find user by email
 * 2. Compare password with stored hash
 * 3. Generate JWT tokens (access + refresh)
 * 4. Store refresh token in database
 * 5. Return tokens to client
 */
export declare class AuthService {
    /**
     * REGISTER A NEW USER
     *
     * @param data - User registration data (email, password, name)
     * @returns The created user (without sensitive fields) and a message
     */
    register(data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<{
        user: any;
        message: string;
    }>;
    /**
     * LOGIN A USER
     *
     * @param email - User's email
     * @param password - User's password (plain text - will be compared to hash)
     * @returns User info and JWT tokens
     */
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * REFRESH ACCESS TOKEN
     *
     * When the access token expires (after 15 min), the client uses
     * the refresh token to get a new access token without re-logging in.
     *
     * @param refreshToken - The refresh token from the previous login
     * @returns New access token and refresh token
     */
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    /**
     * LOGOUT
     *
     * Deletes the refresh token from the database.
     * The access token will still work until it expires,
     * but the user can't refresh it anymore.
     */
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    /**
     * VERIFY EMAIL
     *
     * When user clicks the link in verification email,
     * this marks their email as verified.
     */
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    /**
     * FORGOT PASSWORD
     *
     * User requests a password reset. We generate a token
     * and would email it to them (in production).
     */
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    /**
     * RESET PASSWORD
     *
     * User clicks the reset link and provides a new password.
     */
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    /**
     * GET USER PROFILE
     *
     * Returns the current user's information including their wallets.
     */
    getProfile(userId: string): Promise<any>;
}
//# sourceMappingURL=auth.service.d.ts.map