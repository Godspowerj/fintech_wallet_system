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
export const initializeFundingSchema = z.object({
    body: z.object({
        walletId: z.string().min(1, 'Wallet ID is required'),
        amount: z.number().min(100, 'Minimum amount is ₦100'),
    }),
});
