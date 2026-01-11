import Redis from 'ioredis';
import { env } from './environment';
import { logger } from '../utils/logger';

// Main Redis connection (for general use)
export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

// Separate Redis connection for BullMQ
// BullMQ REQUIRES maxRetriesPerRequest to be null
export const bullmqRedis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,  // Required by BullMQ!
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

redis.on('error', (err) => {
  logger.error('Redis error:', err);
});

redis.on('close', () => {
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