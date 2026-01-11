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

import * as crypto from 'crypto';
import { env } from './environment';
import { logger } from '../utils/logger';

// Paystack API base URL
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Headers required for all Paystack requests
const getHeaders = () => ({
    'Authorization': `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
});

// Type definitions for Paystack responses
interface PaystackResponse {
    status: boolean;
    message: string;
    data?: any;
}

interface InitializeTransactionResponse {
    authorization_url: string;  // URL to redirect user to
    access_code: string;
    reference: string;
}

interface VerifyTransactionResponse {
    status: string;  // 'success', 'failed', 'abandoned'
    reference: string;
    amount: number;  // in kobo
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
export async function initializeTransaction(
    email: string,
    amount: number,  // in kobo!
    reference: string,
    metadata?: Record<string, any>
): Promise<InitializeTransactionResponse> {
    logger.info('Initializing Paystack transaction', { email, amount, reference });

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email,
            amount,  // Must be in kobo (₦100 = 10000)
            reference,
            metadata,
            callback_url: env.PAYSTACK_CALLBACK_URL,  // Where to redirect after payment
        }),
    });

    const data = await response.json() as PaystackResponse;

    if (!data.status) {
        logger.error('Failed to initialize Paystack transaction', { error: data.message });
        throw new Error(data.message || 'Failed to initialize transaction');
    }

    logger.info('Paystack transaction initialized', { reference, url: data.data.authorization_url });
    return data.data as InitializeTransactionResponse;
}

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
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResponse> {
    logger.info('Verifying Paystack transaction', { reference });

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    const data = await response.json() as PaystackResponse;

    if (!data.status) {
        logger.error('Failed to verify Paystack transaction', { error: data.message });
        throw new Error(data.message || 'Failed to verify transaction');
    }

    logger.info('Paystack transaction verified', { reference, status: data.data.status });
    return data.data as VerifyTransactionResponse;
}

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
export function validateWebhook(payload: string, signature: string): boolean {
    if (!env.PAYSTACK_SECRET_KEY) {
        logger.error('PAYSTACK_SECRET_KEY not configured');
        return false;
    }

    const hash = crypto
        .createHmac('sha512', env.PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest('hex');

    const isValid = hash === signature;

    if (!isValid) {
        logger.warn('Invalid Paystack webhook signature');
    }

    return isValid;
}

/**
 * Generate a unique transaction reference
 * Format: FINWALLET_timestamp_randomstring
 */
export function generateReference(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `FINWALLET_${timestamp}_${random}`;
}

/**
 * Convert Naira to Kobo
 * Paystack accepts amounts in kobo (100 kobo = ₦1)
 */
export function nairaToKobo(naira: number): number {
    return Math.round(naira * 100);
}

/**
 * Convert Kobo to Naira
 */
export function koboToNaira(kobo: number): number {
    return kobo / 100;
}