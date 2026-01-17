import Redis from 'ioredis';
export declare let redisAvailable: boolean;
export declare const redis: Redis;
export declare const bullmqRedis: Redis;
export declare class RedisLock {
    private readonly lockKey;
    private readonly ttl;
    private lockValue;
    constructor(key: string, ttl?: number);
    acquire(): Promise<boolean>;
    release(): Promise<boolean>;
    extend(additionalTime: number): Promise<boolean>;
}
export declare const disconnectRedis: () => Promise<void>;
//# sourceMappingURL=redis.d.ts.map