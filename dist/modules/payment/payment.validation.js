"use strict";
/**
 * =============================================================================
 * PAYMENT VALIDATION
 * =============================================================================
 *
 * Validation schemas for payment endpoints using Zod
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFundingSchema = void 0;
const zod_1 = require("zod");
/**
 * Validate initialize funding request
 *
 * Body: {
 *   walletId: string (required) - Which wallet to credit
 *   amount: number (required) - Amount in Naira (min ₦100)
 * }
 */
exports.initializeFundingSchema = zod_1.z.object({
    body: zod_1.z.object({
        walletId: zod_1.z.string().min(1, 'Wallet ID is required'),
        amount: zod_1.z.number().min(100, 'Minimum amount is ₦100'),
    }),
});
//# sourceMappingURL=payment.validation.js.map