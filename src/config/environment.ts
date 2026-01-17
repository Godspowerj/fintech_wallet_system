/*
 * Environment config - loads and validates all env vars
 * Keep your secrets in .env, not in the code!
 */

import dotenv from 'dotenv';
import { z } from 'zod';

// grab everything from .env
dotenv.config();

// schema for all our env vars
const envSchema = z.object({
  // -- general --
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),

  // -- database & cache --
  DATABASE_URL: z.string().url(), // postgres connection string
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),

  // -- jwt auth --
  JWT_ACCESS_SECRET: z.string().min(32), // keep this secret!
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // -- security --
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),

  // -- fraud detection --
  FRAUD_THRESHOLD_AMOUNT: z.string().transform(Number).default('10000'),
  FRAUD_NEW_ACCOUNT_DAYS: z.string().transform(Number).default('30'),
  FRAUD_LARGE_TRANSFER_MULTIPLIER: z.string().transform(Number).default('5'),

  // -- rate limiting --
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 mins
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  TRANSFER_RATE_LIMIT_WINDOW: z.string().transform(Number).default('3600000'), // 1 hour
  TRANSFER_RATE_LIMIT_MAX: z.string().transform(Number).default('10'),

  // -- email (resend) --
  RESEND_API_KEY: z.string().optional(),
  FROM_EMAIL: z.string().default('FinWallet <onboarding@resend.dev>'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // -- paystack --
  PAYSTACK_SECRET_KEY: z.string().optional(), // get from paystack dashboard
});

// validate on startup so we catch missing vars early
const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
      throw new Error(`Missing or invalid env vars: ${missingVars}`);
    }
    throw error;
  }
};

export const env = validateEnv();

// quick checks
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';