/*
 * Paystack integration - handles payments
 * Docs: https://paystack.com/docs/api
 */

import * as crypto from 'crypto';
import { env } from './environment';
import { logger } from '../utils/logger';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const getHeaders = () => ({
    'Authorization': `Bearer ${env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
});

interface PaystackResponse {
    status: boolean;
    message: string;
    data?: any;
}

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

/*
 * Start a payment - returns a checkout URL
 * Amount should be in kobo (100 kobo = ₦1)
 */
export async function initializeTransaction(
    email: string,
    amount: number,
    reference: string,
    metadata?: Record<string, any>,
    currency: string = 'NGN'
): Promise<InitializeTransactionResponse> {
    logger.info('Initializing Paystack transaction', { email, amount, reference, currency });

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email,
            amount,
            reference,
            metadata,
            currency,
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

/*
 * Check if a payment went through
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

/*
 * Validate webhook signature - checks if the webhook is legit
 */
export function validateWebhook(payload: string, signature: string): boolean {
    if (!env.PAYSTACK_SECRET_KEY) {
        logger.error('PAYSTACK_SECRET_KEY not set');
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

// generate unique reference for each transaction
export function generateReference(): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `FINWALLET_${timestamp}_${random}`;
}

// convert naira to kobo (₦1 = 100 kobo)
export function nairaToKobo(naira: number): number {
    return Math.round(naira * 100);
}

// convert kobo to naira
export function koboToNaira(kobo: number): number {
    return kobo / 100;
}