"use strict";
/**
 * =============================================================================
 * ENVIRONMENT.TS - ENVIRONMENT VARIABLES VALIDATION
 * =============================================================================
 *
 * WHAT ARE ENVIRONMENT VARIABLES?
 * They're configuration values stored OUTSIDE your code:
 * - DATABASE_URL: Where your database lives
 * - JWT_SECRET: Secret key for authentication
 * - PORT: Which port the server runs on
 *
 * WHY USE THEM?
 * 1. Security: Secrets aren't in your code (which might be on GitHub!)
 * 2. Flexibility: Same code can run in dev/staging/production
 * 3. Easy config: Change settings without changing code
 *
 * WHERE DO THEY COME FROM?
 * The .env file in your project root. dotenv.config() loads it.
 *
 * WHY VALIDATE THEM?
 * If DATABASE_URL is missing, your app will crash with a confusing error.
 * Better to check at startup and give a clear error message!
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isDevelopment = exports.isProduction = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load .env file into process.env
// After this, process.env.DATABASE_URL will have the value from .env
dotenv_1.default.config();
/**
 * ZOD SCHEMA FOR ENVIRONMENT VARIABLES
 *
 * Zod is a validation library. This schema defines:
 * - What environment variables we need
 * - What type they should be
 * - Default values if not provided
 *
 * Example: z.string().min(32) means "must be a string, at least 32 characters"
 */
const envSchema = zod_1.z.object({
    // ==========================================================================
    // GENERAL SETTINGS
    // ==========================================================================
    // Which environment? Affects logging, error messages, etc.
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    // Server port - transforms string "3000" to number 3000
    PORT: zod_1.z.string().transform(Number).default('3000'),
    // ==========================================================================
    // DATABASE & CACHE
    // ==========================================================================
    // Full PostgreSQL connection string
    // Format: postgresql://user:password@host:port/database
    DATABASE_URL: zod_1.z.string().url(),
    // Redis connection string (for caching and queues)
    // Optional - app will still work without Redis but with reduced functionality
    REDIS_URL: zod_1.z.string().optional().default('redis://localhost:6379'),
    // ==========================================================================
    // AUTHENTICATION (JWT)
    // ==========================================================================
    // Secret keys for signing JWT tokens - MUST be at least 32 characters!
    // If someone gets these, they can forge login tokens
    JWT_ACCESS_SECRET: zod_1.z.string().min(32),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32),
    // How long tokens last before expiring
    // Examples: "15m" = 15 minutes, "7d" = 7 days
    JWT_ACCESS_EXPIRY: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRY: zod_1.z.string().default('7d'),
    // ==========================================================================
    // SECURITY
    // ==========================================================================
    // Bcrypt rounds for password hashing
    // Higher = more secure but slower. 12 is a good balance.
    BCRYPT_ROUNDS: zod_1.z.string().transform(Number).default('12'),
    // ==========================================================================
    // FRAUD DETECTION THRESHOLDS
    // ==========================================================================
    // Transactions above this amount get flagged for review
    FRAUD_THRESHOLD_AMOUNT: zod_1.z.string().transform(Number).default('10000'),
    // Accounts newer than this many days are considered "high risk"
    FRAUD_NEW_ACCOUNT_DAYS: zod_1.z.string().transform(Number).default('30'),
    // Large transfer multiplier for fraud detection
    FRAUD_LARGE_TRANSFER_MULTIPLIER: zod_1.z.string().transform(Number).default('5'),
    // ==========================================================================
    // RATE LIMITING
    // ==========================================================================
    // General rate limit: time window in milliseconds (15 minutes = 900000ms)
    RATE_LIMIT_WINDOW: zod_1.z.string().transform(Number).default('900000'),
    // Max requests per window
    RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('100'),
    // Transfer-specific limits (stricter for money movements)
    TRANSFER_RATE_LIMIT_WINDOW: zod_1.z.string().transform(Number).default('3600000'),
    TRANSFER_RATE_LIMIT_MAX: zod_1.z.string().transform(Number).default('10'),
    // ==========================================================================
    // EMAIL (Resend)
    // ==========================================================================
    // Resend API key - get it from https://resend.com/api-keys
    RESEND_API_KEY: zod_1.z.string().optional(),
    // Email sender address (must be verified domain in production)
    FROM_EMAIL: zod_1.z.string().default('FinWallet <onboarding@resend.dev>'),
    // Frontend URL for email links
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    // ==========================================================================
    // PAYSTACK (Payment Gateway)
    // ==========================================================================
    // Paystack Secret Key - get from https://dashboard.paystack.com/settings/developers
    // Use test key (sk_test_xxx) for development, live key (sk_live_xxx) for production
    PAYSTACK_SECRET_KEY: zod_1.z.string().optional(),
    // Where to redirect user after payment (your frontend URL)
    PAYSTACK_CALLBACK_URL: zod_1.z.string().default('http://localhost:5173/payment/callback'),
});
/**
 * VALIDATE ENVIRONMENT VARIABLES
 *
 * This function runs when the app starts.
 * If any required variable is missing or invalid,
 * it throws an error with a clear message.
 */
const validateEnv = () => {
    try {
        // envSchema.parse() validates process.env against our schema
        // If valid, it returns the validated (and transformed) values
        return envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // Extract which variables failed validation
            const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
            throw new Error(`Missing or invalid environment variables: ${missingVars}`);
        }
        throw error;
    }
};
// Run validation and export the validated config
exports.env = validateEnv();
// Helper flags for checking environment
exports.isProduction = exports.env.NODE_ENV === 'production';
exports.isDevelopment = exports.env.NODE_ENV === 'development';
exports.isTest = exports.env.NODE_ENV === 'test';
//# sourceMappingURL=environment.js.map