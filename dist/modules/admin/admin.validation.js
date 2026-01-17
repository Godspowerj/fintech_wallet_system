"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogsQuerySchema = exports.walletIdParamSchema = exports.userIdParamSchema = exports.getUsersQuerySchema = void 0;
const zod_1 = require("zod");
exports.getUsersQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .refine((val) => val >= 1, 'Page must be at least 1'),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20))
            .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
        search: zod_1.z.string().optional(),
        role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
    }),
});
exports.userIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        userId: zod_1.z.string().uuid('Invalid user ID format'),
    }),
});
exports.walletIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        walletId: zod_1.z.string().uuid('Invalid wallet ID format'),
    }),
});
exports.getAuditLogsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 50)),
        action: zod_1.z.string().optional(),
        resource: zod_1.z.string().optional(),
        userId: zod_1.z.string().uuid().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
    }),
});
//# sourceMappingURL=admin.validation.js.map