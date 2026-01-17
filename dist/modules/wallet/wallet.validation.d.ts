import { z } from 'zod';
export declare const createWalletSchema: z.ZodObject<{
    body: z.ZodObject<{
        currency: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        currency: string;
    }, {
        currency?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        currency: string;
    };
}, {
    body: {
        currency?: string | undefined;
    };
}>;
export declare const walletIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        walletId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        walletId: string;
    }, {
        walletId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        walletId: string;
    };
}, {
    params: {
        walletId: string;
    };
}>;
export declare const getTransactionsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>;
        limit: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
    }, {
        limit?: string | undefined;
        page?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
    };
}, {
    query: {
        limit?: string | undefined;
        page?: string | undefined;
    };
}>;
export type CreateWalletInput = z.infer<typeof createWalletSchema>['body'];
export type WalletIdParam = z.infer<typeof walletIdParamSchema>['params'];
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>['query'];
//# sourceMappingURL=wallet.validation.d.ts.map