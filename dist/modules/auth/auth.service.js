"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../../config/database");
const environment_1 = require("../../config/environment");
const jwt_1 = require("../../utils/jwt");
const helpers_1 = require("../../utils/helpers");
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
const email_1 = require("../../utils/email");
class AuthService {
    /**
     * REGISTER A NEW USER
     *
     * @param data - User registration data (email, password, name)
     * @returns The created user (without sensitive fields) and a message
     */
    async register(data) {
        // We use .toLowerCase() to make email comparison case-insensitive
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });
        if (existingUser) {
            // 409 Conflict - resource already exists
            throw new errors_1.ConflictError('User with this email already exists');
        }
        // NEVER store plain text passwords! bcrypt creates a one-way hash.
        // env.BCRYPT_ROUNDS controls how many times the hash is computed
        // Higher = more secure but slower (12 is a good balance)
        const passwordHash = await bcrypt_1.default.hash(data.password, environment_1.env.BCRYPT_ROUNDS);
        // Step 3: Generate email verification token
        // This would be sent in a verification email link
        const emailVerifyToken = (0, helpers_1.generateRandomToken)();
        // Step 4: Create the user in the database
        const user = await database_1.prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
                emailVerifyToken,
                role: client_1.UserRole.USER, // New users are regular users, not admins
            },
        });
        // Step 5: Create a default wallet for the user
        // Every user needs at least one wallet to send/receive money
        await database_1.prisma.wallet.create({
            data: {
                userId: user.id,
                currency: 'USD',
            },
        });
        // In production, you would send a verification email here:
        await (0, email_1.sendWelcomeEmail)(user.email, user.firstName);
        // Return the user (without password hash) and a success message
        return {
            user: (0, helpers_1.sanitizeUser)(user), // Removes passwordHash and other sensitive fields
            message: 'Registration successful. Please verify your email.',
        };
    }
    /**
     * LOGIN A USER
     *
     * @param email - User's email
     * @param password - User's password (plain text - will be compared to hash)
     * @returns User info and JWT tokens
     */
    async login(data) {
        // Step 1: Find the user by email
        const user = await database_1.prisma.user.findUnique({
            where: { email: data.email.toLowerCase() },
        });
        // Security tip: Don't say "user not found" vs "wrong password"
        // That would let attackers know which emails are registered!
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // Step 2: Verify password using bcrypt
        // bcrypt.compare() hashes the input and compares it to the stored hash
        const isValidPassword = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
        // Step 3: Update last login timestamp
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        // Step 4: Generate JWT tokens
        // Access token: Short-lived (15min), used for API requests
        // Refresh token: Long-lived (7 days), used to get new access tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(payload);
        const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
        // Step 5: Store refresh token in database
        // This allows us to invalidate it (logout) and track sessions
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
        await database_1.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        // Return everything the client needs
        return {
            user: (0, helpers_1.sanitizeUser)(user),
            accessToken,
            refreshToken,
        };
    }
    /**
     * REFRESH ACCESS TOKEN
     *
     * When the access token expires (after 15 min), the client uses
     * the refresh token to get a new access token without re-logging in.
     *
     * @param refreshToken - The refresh token from the previous login
     * @returns New access token and refresh token
     */
    async refreshToken(refreshToken) {
        // Step 1: Verify the refresh token is valid (not expired, correct signature)
        const payload = (0, jwt_1.verifyRefreshToken)(refreshToken);
        // Step 2: Check if token exists in database (hasn't been revoked)
        const storedToken = await database_1.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
        }
        // Step 3: Get the user
        const user = await database_1.prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        // Step 4: Generate new tokens
        const newPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = (0, jwt_1.generateAccessToken)(newPayload);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(newPayload);
        // Step 5: Rotate refresh token (delete old, create new)
        // This is a security best practice - each refresh token is single-use
        await database_1.prisma.refreshToken.delete({
            where: { token: refreshToken },
        });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await database_1.prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: user.id,
                expiresAt,
            },
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    /**
     * LOGOUT
     *
     * Deletes the refresh token from the database.
     * The access token will still work until it expires,
     * but the user can't refresh it anymore.
     */
    async logout(refreshToken) {
        await database_1.prisma.refreshToken.deleteMany({
            where: { token: refreshToken },
        });
        return { message: 'Logged out successfully' };
    }
    /**
     * VERIFY EMAIL
     *
     * When user clicks the link in verification email,
     * this marks their email as verified.
     */
    async verifyEmail(token) {
        const user = await database_1.prisma.user.findFirst({
            where: { emailVerifyToken: token },
        });
        if (!user) {
            throw new errors_1.BadRequestError('Invalid verification token');
        }
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerifyToken: null, // Clear the token so it can't be reused
            },
        });
        await (0, email_1.sendVerificationEmail)(user.email, token);
        return { message: 'Email verified successfully' };
    }
    /**
     * FORGOT PASSWORD
     *
     * User requests a password reset. We generate a token
     * and would email it to them (in production).
     */
    async forgotPassword(email) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        // Security: Don't reveal if email exists or not
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        const resetToken = (0, helpers_1.generateRandomToken)();
        const resetExpiry = new Date();
        resetExpiry.setHours(resetExpiry.getHours() + 1); // Token valid for 1 hour
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiry: resetExpiry,
            },
        });
        await (0, email_1.sendPasswordResetEmail)(user.email, resetToken);
        return { message: 'If the email exists, a reset link has been sent' };
    }
    /**
     * RESET PASSWORD
     *
     * User clicks the reset link and provides a new password.
     */
    async resetPassword(token, newPassword) {
        // Find user with valid (non-expired) reset token
        const user = await database_1.prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiry: { gt: new Date() }, // gt = greater than (not expired)
            },
        });
        if (!user) {
            throw new errors_1.BadRequestError('Invalid or expired reset token');
        }
        // Hash the new password
        const passwordHash = await bcrypt_1.default.hash(newPassword, environment_1.env.BCRYPT_ROUNDS);
        // Update password and clear reset token
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                resetPasswordToken: null,
                resetPasswordExpiry: null,
            },
        });
        // Security: Delete all refresh tokens so user must login again everywhere
        await database_1.prisma.refreshToken.deleteMany({
            where: { userId: user.id },
        });
        return { message: 'Password reset successfully' };
    }
    /**
     * GET USER PROFILE
     *
     * Returns the current user's information including their wallets.
     */
    async getProfile(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                wallets: true, // Include related wallets in the response
            },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        return (0, helpers_1.sanitizeUser)(user);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map