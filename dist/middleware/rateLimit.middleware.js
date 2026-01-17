"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferRateLimiter = exports.createRedisRateLimiter = exports.generalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const redis_1 = require("../config/redis");
const environment_1 = require("../config/environment");
// Basic rate limiter using in-memory store
exports.generalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: environment_1.env.RATE_LIMIT_WINDOW,
    limit: environment_1.env.RATE_LIMIT_MAX,
    message: {
        success: false,
        error: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Redis-based rate limiter for specific routes
const createRedisRateLimiter = (prefix, windowMs, maxRequests) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId || req.ip;
            const key = `ratelimit:${prefix}:${userId}`;
            const current = await redis_1.redis.incr(key);
            if (current === 1) {
                await redis_1.redis.pexpire(key, windowMs);
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
        }
        catch (error) {
            // If Redis fails, allow the request but log the error
            console.error('Rate limiter error:', error);
            next();
        }
    };
};
exports.createRedisRateLimiter = createRedisRateLimiter;
// Transfer-specific rate limiter
exports.transferRateLimiter = (0, exports.createRedisRateLimiter)('transfer', environment_1.env.TRANSFER_RATE_LIMIT_WINDOW, environment_1.env.TRANSFER_RATE_LIMIT_MAX);
//# sourceMappingURL=rateLimit.middleware.js.map