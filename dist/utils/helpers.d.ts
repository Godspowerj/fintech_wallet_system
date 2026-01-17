export declare const generateRandomToken: (length?: number) => string;
export declare const hashToken: (token: string) => string;
export declare const sleep: (ms: number) => Promise<void>;
export declare const generateIdempotencyKey: (userId: string, data: any) => string;
export declare const sanitizeUser: (user: any) => any;
export declare const formatCurrency: (amount: number | string, currency?: string) => string;
export declare const calculateFee: (amount: number, feePercentage?: number) => number;
export declare const isValidEmail: (email: string) => boolean;
export declare const paginate: (page?: number, limit?: number) => {
    skip: number;
    take: number;
};
export declare const buildPaginationMeta: (total: number, page: number, limit: number) => {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};
//# sourceMappingURL=helpers.d.ts.map