/**
 * =============================================================================
 * PAYMENT VALIDATION
 * =============================================================================
 *
 * Validation schemas for payment endpoints using Zod
 */
import { z } from 'zod';
/**
 * Validate initialize funding request
 *
 * Body: {
 *   walletId: string (required) - Which wallet to credit
 *   amount: number (required) - Amount in Naira (min ₦100)
 * }
 */
export declare const initializeFundingSchema: z.ZodObject<{
    body: z.ZodObject<{
        walletId: z.ZodString;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        walletId: string;
    }, {
        amount: number;
        walletId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        amount: number;
        walletId: string;
    };
}, {
    body: {
        amount: number;
        walletId: string;
    };
}>;
//# sourceMappingURL=payment.validation.d.ts.map