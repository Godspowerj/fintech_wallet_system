import Redis from 'ioredis';
import { env } from './environment';
import { logger } from '../utils/logger';

// Track if Redis is available
export let redisAvailable = false;

// Redis connection options with better error handling
const redisOptions = {
  maxRetriesPerRequest: 3,
  retryStrategy: (times: number) => {
    if (times > 3) {
      logger.warn('Redis connection failed after 3 retries. Running without Redis.');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000); // Retry with backoff
  },
  lazyConnect: true, // Don't connect immediately
};

// Main Redis connection (for general use)
export const redis = new Redis(env.REDIS_URL, redisOptions);

// Separate Redis connection for BullMQ
// BullMQ REQUIRES maxRetriesPerRequest to be null
export const bullmqRedis = new Redis(env.REDIS_URL, {
  ...redisOptions,
  maxRetriesPerRequest: null,  // Required by BullMQ!
});

redis.on('connect', () => {
  redisAvailable = true;
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  redisAvailable = false;
  logger.error('Redis error:', err);
});

redis.on('close', () => {
  redisAvailable = false;
  logger.warn('Redis connection closed');
});

// Redis lock helper
export class RedisLock {
  private readonly lockKey: string;
  private readonly ttl: number;
  private lockValue: string | null = null;

  constructor(key: string, ttl: number = 10000) {
    this.lockKey = `lock:${key}`;
    this.ttl = ttl;
  }

  async acquire(): Promise<boolean> {
    this.lockValue = `${Date.now()}-${Math.random()}`;
    const result = await redis.set(
      this.lockKey,
      this.lockValue,
      'PX',
      this.ttl,
      'NX'
    );
    return result === 'OK';
  }

  async release(): Promise<boolean> {
    if (!this.lockValue) return false;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await redis.eval(script, 1, this.lockKey, this.lockValue);
    return result === 1;
  }

  async extend(additionalTime: number): Promise<boolean> {
    if (!this.lockValue) return false;

    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;

    const result = await redis.eval(
      script,
      1,
      this.lockKey,
      this.lockValue,
      additionalTime.toString()
    );
    return result === 1;
  }
}

// Graceful shutdown
export const disconnectRedis = async () => {
  await redis.quit();
  logger.info('Redis disconnected');
};