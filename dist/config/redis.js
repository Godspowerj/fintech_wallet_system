"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.RedisLock = exports.bullmqRedis = exports.redis = exports.redisAvailable = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const environment_1 = require("./environment");
const logger_1 = require("../utils/logger");
// Track if Redis is available
exports.redisAvailable = false;
// Redis connection options with better error handling
const redisOptions = {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
        if (times > 3) {
            logger_1.logger.warn('Redis connection failed after 3 retries. Running without Redis.');
            return null; // Stop retrying
        }
        return Math.min(times * 200, 2000); // Retry with backoff
    },
    lazyConnect: true, // Don't connect immediately
};
// Main Redis connection (for general use)
exports.redis = new ioredis_1.default(environment_1.env.REDIS_URL, redisOptions);
// Separate Redis connection for BullMQ
// BullMQ REQUIRES maxRetriesPerRequest to be null
exports.bullmqRedis = new ioredis_1.default(environment_1.env.REDIS_URL, {
    ...redisOptions,
    maxRetriesPerRequest: null, // Required by BullMQ!
});
exports.redis.on('connect', () => {
    exports.redisAvailable = true;
    logger_1.logger.info('Redis connected');
});
exports.redis.on('error', (err) => {
    exports.redisAvailable = false;
    logger_1.logger.error('Redis error:', err);
});
exports.redis.on('close', () => {
    exports.redisAvailable = false;
    logger_1.logger.warn('Redis connection closed');
});
// Redis lock helper
class RedisLock {
    lockKey;
    ttl;
    lockValue = null;
    constructor(key, ttl = 10000) {
        this.lockKey = `lock:${key}`;
        this.ttl = ttl;
    }
    async acquire() {
        this.lockValue = `${Date.now()}-${Math.random()}`;
        const result = await exports.redis.set(this.lockKey, this.lockValue, 'PX', this.ttl, 'NX');
        return result === 'OK';
    }
    async release() {
        if (!this.lockValue)
            return false;
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
        const result = await exports.redis.eval(script, 1, this.lockKey, this.lockValue);
        return result === 1;
    }
    async extend(additionalTime) {
        if (!this.lockValue)
            return false;
        const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;
        const result = await exports.redis.eval(script, 1, this.lockKey, this.lockValue, additionalTime.toString());
        return result === 1;
    }
}
exports.RedisLock = RedisLock;
// Graceful shutdown
const disconnectRedis = async () => {
    await exports.redis.quit();
    logger_1.logger.info('Redis disconnected');
};
exports.disconnectRedis = disconnectRedis;
//# sourceMappingURL=redis.js.map