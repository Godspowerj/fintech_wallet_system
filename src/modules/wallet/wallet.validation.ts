import { z } from 'zod';

export const createWalletSchema = z.object({
    body: z.object({
        currency: z.string()
            .length(3, 'Currency must be a 3-letter code')
            .toUpperCase()
            .default('NGN'),
    }),
});

export const walletIdParamSchema = z.object({
    params: z.object({
        walletId: z.string().uuid('Invalid wallet ID format'),
    }),
});

export const getTransactionsQuerySchema = z.object({
    query: z.object({
        page: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .refine((val) => val >= 1, 'Page must be at least 1'),
        limit: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20))
            .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
    }),
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>['body'];
export type WalletIdParam = z.infer<typeof walletIdParamSchema>['params'];
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>['query'];
