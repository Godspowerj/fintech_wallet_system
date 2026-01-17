"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionsQuerySchema = exports.walletIdParamSchema = exports.createWalletSchema = void 0;
const zod_1 = require("zod");
exports.createWalletSchema = zod_1.z.object({
    body: zod_1.z.object({
        currency: zod_1.z.string()
            .length(3, 'Currency must be a 3-letter code')
            .toUpperCase()
            .default('USD'),
    }),
});
exports.walletIdParamSchema = zod_1.z.object({
    params: zod_1.z.object({
        walletId: zod_1.z.string().uuid('Invalid wallet ID format'),
    }),
});
exports.getTransactionsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 1))
            .refine((val) => val >= 1, 'Page must be at least 1'),
        limit: zod_1.z.string()
            .optional()
            .transform((val) => (val ? parseInt(val, 10) : 20))
            .refine((val) => val >= 1 && val <= 100, 'Limit must be between 1 and 100'),
    }),
});
//# sourceMappingURL=wallet.validation.js.map