/**
 * =============================================================================
 * PAYSTACK CONFIGURATION
 * =============================================================================
 *
 * Paystack is a payment gateway for Africa.
 * We use it to:
 * 1. Accept payments (user adds money to wallet)
 * 2. Send payouts (user withdraws to bank)
 *
 * Get your keys from: https://dashboard.paystack.com/settings/developers
 */
interface InitializeTransactionResponse {
    authorization_url: string;
    access_code: string;
    reference: string;
}
interface VerifyTransactionResponse {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer: {
        email: string;
    };
    metadata?: Record<string, any>;
}
/**
 * Initialize a payment transaction
 * This creates a checkout page for the user to pay
 *
 * @param email - Customer's email
 * @param amount - Amount in KOBO (₦100 = 10000 kobo)
 * @param reference - Unique transaction reference
 * @param metadata - Extra data (like walletId, userId)
 * @returns authorization_url, reference, access_code
 *
 * @example
 * const result = await initializeTransaction(
 *     'user@email.com',
 *     500000,  // ₦5000 in kobo
 *     'txn_abc123',
 *     { walletId: 'wallet_xyz', userId: 'user_123' }
 * );
 * // Redirect user to: result.authorization_url
 */
export declare function initializeTransaction(email: string, amount: number, // in kobo!
reference: string, metadata?: Record<string, any>): Promise<InitializeTransactionResponse>;
/**
 * Verify a payment transaction
 * Call this to confirm if payment was successful
 *
 * @param reference - The transaction reference
 * @returns Transaction details including status, amount, customer info
 *
 * @example
 * const result = await verifyTransaction('txn_abc123');
 * if (result.status === 'success') {
 *     // Payment successful! Credit the wallet
 * }
 */
export declare function verifyTransaction(reference: string): Promise<VerifyTransactionResponse>;
/**
 * Validate Paystack webhook signature
 * Paystack signs webhooks with a secret - we verify it matches
 * This prevents fake webhook calls from hackers
 *
 * @param payload - The raw request body (as string)
 * @param signature - The x-paystack-signature header
 * @returns true if valid, false if not
 *
 * @example
 * if (validateWebhook(req.body, req.headers['x-paystack-signature'])) {
 *     // Webhook is legitimate, process it
 * }
 */
export declare function validateWebhook(payload: string, signature: string): boolean;
/**
 * Generate a unique transaction reference
 * Format: FINWALLET_timestamp_randomstring
 */
export declare function generateReference(): string;
/**
 * Convert Naira to Kobo
 * Paystack accepts amounts in kobo (100 kobo = ₦1)
 */
export declare function nairaToKobo(naira: number): number;
/**
 * Convert Kobo to Naira
 */
export declare function koboToNaira(kobo: number): number;
export {};
//# sourceMappingURL=paystack.d.ts.map