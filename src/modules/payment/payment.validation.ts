/*
 * Payment validation schemas
 */

import { z } from 'zod';

export const initializeFundingSchema = z.object({
    body: z.object({
        walletId: z.string().min(1, 'Wallet ID is required'),
        amount: z.number().min(100, 'Minimum amount is ₦100'),
    }),
});
