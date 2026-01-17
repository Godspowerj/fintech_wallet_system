"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTransaction = initializeTransaction;
exports.verifyTransaction = verifyTransaction;
exports.validateWebhook = validateWebhook;
exports.generateReference = generateReference;
exports.nairaToKobo = nairaToKobo;
exports.koboToNaira = koboToNaira;
const crypto = __importStar(require("crypto"));
const environment_1 = require("./environment");
const logger_1 = require("../utils/logger");
// Paystack API base URL
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
// Headers required for all Paystack requests
const getHeaders = () => ({
    'Authorization': `Bearer ${environment_1.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
});
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
async function initializeTransaction(email, amount, // in kobo!
reference, metadata) {
    logger_1.logger.info('Initializing Paystack transaction', { email, amount, reference });
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            email,
            amount, // Must be in kobo (₦100 = 10000)
            reference,
            metadata,
            callback_url: environment_1.env.PAYSTACK_CALLBACK_URL, // Where to redirect after payment
        }),
    });
    const data = await response.json();
    if (!data.status) {
        logger_1.logger.error('Failed to initialize Paystack transaction', { error: data.message });
        throw new Error(data.message || 'Failed to initialize transaction');
    }
    logger_1.logger.info('Paystack transaction initialized', { reference, url: data.data.authorization_url });
    return data.data;
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
async function verifyTransaction(reference) {
    logger_1.logger.info('Verifying Paystack transaction', { reference });
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: getHeaders(),
    });
    const data = await response.json();
    if (!data.status) {
        logger_1.logger.error('Failed to verify Paystack transaction', { error: data.message });
        throw new Error(data.message || 'Failed to verify transaction');
    }
    logger_1.logger.info('Paystack transaction verified', { reference, status: data.data.status });
    return data.data;
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
function validateWebhook(payload, signature) {
    if (!environment_1.env.PAYSTACK_SECRET_KEY) {
        logger_1.logger.error('PAYSTACK_SECRET_KEY not configured');
        return false;
    }
    const hash = crypto
        .createHmac('sha512', environment_1.env.PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest('hex');
    const isValid = hash === signature;
    if (!isValid) {
        logger_1.logger.warn('Invalid Paystack webhook signature');
    }
    return isValid;
}
/**
 * Generate a unique transaction reference
 * Format: FINWALLET_timestamp_randomstring
 */
function generateReference() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `FINWALLET_${timestamp}_${random}`;
}
/**
 * Convert Naira to Kobo
 * Paystack accepts amounts in kobo (100 kobo = ₦1)
 */
function nairaToKobo(naira) {
    return Math.round(naira * 100);
}
/**
 * Convert Kobo to Naira
 */
function koboToNaira(kobo) {
    return kobo / 100;
}
//# sourceMappingURL=paystack.js.map