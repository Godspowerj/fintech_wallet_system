/**
 * =============================================================================
 * PAYMENT SERVICE
 * =============================================================================
 * 
 * This service handles:
 * 1. Initiating wallet funding (user wants to add money)
 * 2. Processing Paystack webhooks (payment confirmed)
 * 3. Handling payment verification
 * 
 * FLOW:
 * 
 * 1. User clicks "Add Money" → initializeFunding()
 *    → Creates pending transaction
 *    → Returns Paystack checkout URL
 * 
 * 2. User pays on Paystack → Paystack sends webhook → handleWebhook()
 *    → Verifies webhook signature
 *    → Credits wallet balance
 *    → Updates transaction to COMPLETED
 */

import { prisma } from '../../config/database';
import {
    initializeTransaction,
    verifyTransaction,
    validateWebhook,
    generateReference,
    nairaToKobo,
    koboToNaira,
} from '../../config/paystack';
import { TransactionType, TransactionStatus, LedgerEntryType } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { queueEmailNotification } from '../../queues/notification.queue';

export class PaymentService {
    /**
     * Initialize wallet funding
     * 
     * Creates a pending transaction and returns Paystack checkout URL
     * 
     * @param userId - The user's ID
     * @param walletId - Which wallet to credit
     * @param amount - Amount in Naira (we convert to kobo)
     * @returns Paystack authorization URL to redirect user to
     */
    async initializeFunding(userId: string, walletId: string, amount: number) {
        logger.info('Initializing wallet funding', { userId, walletId, amount });

        // Validate amount
        if (amount <= 0) {
            throw new BadRequestError('Amount must be greater than zero');
        }

        // Get user email (required by Paystack)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Verify wallet exists and belongs to user
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
        });

        if (!wallet || wallet.userId !== userId) {
            throw new NotFoundError('Wallet not found');
        }

        // Generate unique reference
        const reference = generateReference();

        // Create PENDING transaction in our database
        // This will be updated to COMPLETED when Paystack confirms payment
        const transaction = await prisma.transaction.create({
            data: {
                transactionType: TransactionType.DEPOSIT,
                amount: amount,
                currency: wallet.currency,
                status: TransactionStatus.PENDING,  // Will change to COMPLETED after payment
                receiverId: userId,
                receiverWalletId: walletId,
                description: 'Wallet funding via Paystack',
                externalReference: reference,  // Link to Paystack transaction
            },
        });

        // Initialize Paystack transaction
        const paystackResult = await initializeTransaction(
            user.email,
            nairaToKobo(amount),  // Convert to kobo
            reference,
            {
                userId,
                walletId,
                transactionId: transaction.id,
                type: 'wallet_funding',
            }
        );

        logger.info('Wallet funding initialized', {
            transactionId: transaction.id,
            reference,
            checkoutUrl: paystackResult.authorization_url,
        });

        return {
            transactionId: transaction.id,
            reference,
            authorizationUrl: paystackResult.authorization_url,
            accessCode: paystackResult.access_code,
        };
    }

    /**
     * Handle Paystack webhook
     * 
     * Called when Paystack sends a notification about a payment
     * 
     * @param payload - Raw request body
     * @param signature - x-paystack-signature header
     */
    async handleWebhook(payload: string, signature: string) {
        logger.info('Processing Paystack webhook');

        // Validate webhook signature
        if (!validateWebhook(payload, signature)) {
            logger.error('Invalid webhook signature');
            throw new BadRequestError('Invalid webhook signature');
        }

        const event = JSON.parse(payload);
        logger.info('Webhook event received', { event: event.event });

        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await this.handleChargeSuccess(event.data);
                break;
            case 'charge.failed':
                await this.handleChargeFailed(event.data);
                break;
            default:
                logger.info('Unhandled webhook event', { event: event.event });
        }
    }

    /**
     * Handle successful payment
     */
    private async handleChargeSuccess(data: any) {
        const reference = data.reference;
        const amountInKobo = data.amount;
        const amountInNaira = koboToNaira(amountInKobo);

        logger.info('Processing successful charge', { reference, amountInNaira });

        // Find our transaction by the reference
        const transaction = await prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiver: { select: { id: true, email: true, firstName: true } },
                receiverWallet: true,
            },
        });

        if (!transaction) {
            logger.error('Transaction not found for reference', { reference });
            return;  // Don't throw - webhook would retry forever
        }

        // Check if already processed (idempotency)
        if (transaction.status === TransactionStatus.COMPLETED) {
            logger.info('Transaction already processed', { reference });
            return;
        }

        // Update wallet balance and transaction status
        const wallet = transaction.receiverWallet!;
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore.add(amountInNaira);

        await prisma.$transaction([
            // Create ledger entry
            prisma.ledgerEntry.create({
                data: {
                    walletId: wallet.id,
                    transactionId: transaction.id,
                    entryType: LedgerEntryType.CREDIT,
                    amount: amountInNaira,
                    balanceBefore,
                    balanceAfter,
                    description: 'Wallet funding via Paystack',
                },
            }),
            // Update wallet balance
            prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: balanceAfter },
            }),
            // Update transaction status
            prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: TransactionStatus.COMPLETED,
                    processedAt: new Date(),
                },
            }),
        ]);

        logger.info('Wallet funded successfully', {
            walletId: wallet.id,
            amount: amountInNaira,
            newBalance: balanceAfter.toString(),
        });

        // Send notification email
        if (transaction.receiver) {
            await queueEmailNotification(
                transaction.receiver.id,
                'Wallet Funded Successfully! 💰',
                `Your wallet has been credited with ₦${amountInNaira.toLocaleString()}. Your new balance is ₦${balanceAfter.toString()}.`
            );
        }
    }

    /**
     * Handle failed payment
     */
    private async handleChargeFailed(data: any) {
        const reference = data.reference;

        logger.info('Processing failed charge', { reference });

        // Find and update our transaction
        const transaction = await prisma.transaction.findFirst({
            where: { externalReference: reference },
        });

        if (!transaction) {
            logger.error('Transaction not found for reference', { reference });
            return;
        }

        await prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                status: TransactionStatus.FAILED,
                failureReason: 'Payment failed on Paystack',
            },
        });

        logger.info('Transaction marked as failed', { reference });
    }

    /**
     * Verify payment status
     * 
     * Called when user returns from Paystack checkout
     * to check if payment was successful
     */
    async verifyPayment(reference: string) {
        logger.info('Verifying payment', { reference });

        // Verify with Paystack
        const paystackResult = await verifyTransaction(reference);

        // Find our transaction
        const transaction = await prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiverWallet: true,
            },
        });

        if (!transaction) {
            throw new NotFoundError('Transaction not found');
        }

        return {
            reference,
            paystackStatus: paystackResult.status,
            transactionStatus: transaction.status,
            amount: koboToNaira(paystackResult.amount),
            walletId: transaction.receiverWalletId,
        };
    }

    /**
     * Get user's payment history
     */
    async getPaymentHistory(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    receiverId: userId,
                    transactionType: TransactionType.DEPOSIT,
                    externalReference: { not: null },  // Only Paystack transactions
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.transaction.count({
                where: {
                    receiverId: userId,
                    transactionType: TransactionType.DEPOSIT,
                    externalReference: { not: null },
                },
            }),
        ]);

        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}