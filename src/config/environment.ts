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

import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env file into process.env
// After this, process.env.DATABASE_URL will have the value from .env
dotenv.config();

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
const envSchema = z.object({
  // ==========================================================================
  // GENERAL SETTINGS
  // ==========================================================================

  // Which environment? Affects logging, error messages, etc.
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server port - transforms string "3000" to number 3000
  PORT: z.string().transform(Number).default('3000'),

  // ==========================================================================
  // DATABASE & CACHE
  // ==========================================================================

  // Full PostgreSQL connection string
  // Format: postgresql://user:password@host:port/database
  DATABASE_URL: z.string().url(),

  // Redis connection string (for caching and rate limiting)
  REDIS_URL: z.string().url(),

  // ==========================================================================
  // AUTHENTICATION (JWT)
  // ==========================================================================

  // Secret keys for signing JWT tokens - MUST be at least 32 characters!
  // If someone gets these, they can forge login tokens
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  // How long tokens last before expiring
  // Examples: "15m" = 15 minutes, "7d" = 7 days
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // ==========================================================================
  // SECURITY
  // ==========================================================================

  // Bcrypt rounds for password hashing
  // Higher = more secure but slower. 12 is a good balance.
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),

  // ==========================================================================
  // FRAUD DETECTION THRESHOLDS
  // ==========================================================================

  // Transactions above this amount get flagged for review
  FRAUD_THRESHOLD_AMOUNT: z.string().transform(Number).default('10000'),

  // Accounts newer than this many days are considered "high risk"
  FRAUD_NEW_ACCOUNT_DAYS: z.string().transform(Number).default('30'),

  // Large transfer multiplier for fraud detection
  FRAUD_LARGE_TRANSFER_MULTIPLIER: z.string().transform(Number).default('5'),

  // ==========================================================================
  // RATE LIMITING
  // ==========================================================================

  // General rate limit: time window in milliseconds (15 minutes = 900000ms)
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'),

  // Max requests per window
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),

  // Transfer-specific limits (stricter for money movements)
  TRANSFER_RATE_LIMIT_WINDOW: z.string().transform(Number).default('3600000'),
  TRANSFER_RATE_LIMIT_MAX: z.string().transform(Number).default('10'),
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Extract which variables failed validation
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

// Run validation and export the validated config
export const env = validateEnv();

// Helper flags for checking environment
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';