import { z } from 'zod';
export declare const getUsersQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>;
        limit: z.ZodEffects<z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>, number, string | undefined>;
        search: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["USER", "ADMIN"]>>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        search?: string | undefined;
        role?: "USER" | "ADMIN" | undefined;
    }, {
        limit?: string | undefined;
        search?: string | undefined;
        role?: "USER" | "ADMIN" | undefined;
        page?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        search?: string | undefined;
        role?: "USER" | "ADMIN" | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        search?: string | undefined;
        role?: "USER" | "ADMIN" | undefined;
        page?: string | undefined;
    };
}>;
export declare const userIdParamSchema: z.ZodObject<{
    params: z.ZodObject<{
        userId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        userId: string;
    }, {
        userId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        userId: string;
    };
}, {
    params: {
        userId: string;
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
export declare const getAuditLogsQuerySchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        limit: z.ZodEffects<z.ZodOptional<z.ZodString>, number, string | undefined>;
        action: z.ZodOptional<z.ZodString>;
        resource: z.ZodOptional<z.ZodString>;
        userId: z.ZodOptional<z.ZodString>;
        startDate: z.ZodOptional<z.ZodString>;
        endDate: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        limit: number;
        page: number;
        userId?: string | undefined;
        action?: string | undefined;
        resource?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }, {
        limit?: string | undefined;
        userId?: string | undefined;
        action?: string | undefined;
        resource?: string | undefined;
        page?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        limit: number;
        page: number;
        userId?: string | undefined;
        action?: string | undefined;
        resource?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}, {
    query: {
        limit?: string | undefined;
        userId?: string | undefined;
        action?: string | undefined;
        resource?: string | undefined;
        page?: string | undefined;
        startDate?: string | undefined;
        endDate?: string | undefined;
    };
}>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
export type UserIdParam = z.infer<typeof userIdParamSchema>['params'];
export type WalletIdParam = z.infer<typeof walletIdParamSchema>['params'];
export type GetAuditLogsQuery = z.infer<typeof getAuditLogsQuerySchema>['query'];
//# sourceMappingURL=admin.validation.d.ts.map