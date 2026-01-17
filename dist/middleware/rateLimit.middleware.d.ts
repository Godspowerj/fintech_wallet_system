export declare const generalRateLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const createRedisRateLimiter: (prefix: string, windowMs: number, maxRequests: number) => (req: any, res: any, next: any) => Promise<any>;
export declare const transferRateLimiter: (req: any, res: any, next: any) => Promise<any>;
//# sourceMappingURL=rateLimit.middleware.d.ts.map