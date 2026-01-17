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
export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    DATABASE_URL: string;
    REDIS_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRY: string;
    JWT_REFRESH_EXPIRY: string;
    BCRYPT_ROUNDS: number;
    FRAUD_THRESHOLD_AMOUNT: number;
    FRAUD_NEW_ACCOUNT_DAYS: number;
    FRAUD_LARGE_TRANSFER_MULTIPLIER: number;
    RATE_LIMIT_WINDOW: number;
    RATE_LIMIT_MAX: number;
    TRANSFER_RATE_LIMIT_WINDOW: number;
    TRANSFER_RATE_LIMIT_MAX: number;
    FROM_EMAIL: string;
    FRONTEND_URL: string;
    PAYSTACK_CALLBACK_URL: string;
    RESEND_API_KEY?: string | undefined;
    PAYSTACK_SECRET_KEY?: string | undefined;
};
export declare const isProduction: boolean;
export declare const isDevelopment: boolean;
export declare const isTest: boolean;
//# sourceMappingURL=environment.d.ts.map