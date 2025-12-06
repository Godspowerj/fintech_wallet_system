import { z } from 'zod';

export const getUsersQuerySchema = z.object({
    query: z.object({
        page: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .refine((val) => val >= 1, 'Page must be at least 1'),
        limit: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20))
            .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
        search: z.string().optional(),
        role: z.enum(['USER', 'ADMIN']).optional(),
    }),
});

export const userIdParamSchema = z.object({
    params: z.object({
        userId: z.string().uuid('Invalid user ID format'),
    }),
});

export const walletIdParamSchema = z.object({
    params: z.object({
        walletId: z.string().uuid('Invalid wallet ID format'),
    }),
});

export const getAuditLogsQuerySchema = z.object({
    query: z.object({
        page: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 50)),
        action: z.string().optional(),
        resource: z.string().optional(),
        userId: z.string().uuid().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }),
});

export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
export type UserIdParam = z.infer<typeof userIdParamSchema>['params'];
export type WalletIdParam = z.infer<typeof walletIdParamSchema>['params'];
export type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>['query'];
