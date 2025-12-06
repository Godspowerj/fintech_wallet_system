import rateLimit from 'express-rate-limit';
import { redis } from '../config/redis';
import { env } from '../config/environment';

// Basic rate limiter using in-memory store
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW,
  max: env.RATE_LIMIT_MAX,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Redis-based rate limiter for specific routes
export const createRedisRateLimiter = (
  prefix: string,
  windowMs: number,
  maxRequests: number
) => {
  return async (req: any, res: any, next: any) => {
    try {
      const userId = req.user?.userId || req.ip;
      const key = `ratelimit:${prefix}:${userId}`;

      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, windowMs);
      }

      if (current > maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        });
      }

      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current).toString());

      next();
    } catch (error) {
      // If Redis fails, allow the request but log the error
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

// Transfer-specific rate limiter
export const transferRateLimiter = createRedisRateLimiter(
  'transfer',
  env.TRANSFER_RATE_LIMIT_WINDOW,
  env.TRANSFER_RATE_LIMIT_MAX
);