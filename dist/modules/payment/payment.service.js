"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const database_1 = require("../../config/database");
const paystack_1 = require("../../config/paystack");
const client_1 = require("@prisma/client");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const notification_queue_1 = require("../../queues/notification.queue");
class PaymentService {
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
    async initializeFunding(userId, walletId, amount) {
        logger_1.logger.info('Initializing wallet funding', { userId, walletId, amount });
        // Validate amount
        if (amount <= 0) {
            throw new errors_1.BadRequestError('Amount must be greater than zero');
        }
        // Get user email (required by Paystack)
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true },
        });
        if (!user) {
            throw new errors_1.NotFoundError('User not found');
        }
        // Verify wallet exists and belongs to user
        const wallet = await database_1.prisma.wallet.findUnique({
            where: { id: walletId },
        });
        if (!wallet || wallet.userId !== userId) {
            throw new errors_1.NotFoundError('Wallet not found');
        }
        // Generate unique reference
        const reference = (0, paystack_1.generateReference)();
        // Create PENDING transaction in our database
        // This will be updated to COMPLETED when Paystack confirms payment
        const transaction = await database_1.prisma.transaction.create({
            data: {
                transactionType: client_1.TransactionType.DEPOSIT,
                amount: amount,
                currency: wallet.currency,
                status: client_1.TransactionStatus.PENDING, // Will change to COMPLETED after payment
                receiverId: userId,
                receiverWalletId: walletId,
                description: 'Wallet funding via Paystack',
                externalReference: reference, // Link to Paystack transaction
            },
        });
        // Initialize Paystack transaction
        const paystackResult = await (0, paystack_1.initializeTransaction)(user.email, (0, paystack_1.nairaToKobo)(amount), // Convert to kobo
        reference, {
            userId,
            walletId,
            transactionId: transaction.id,
            type: 'wallet_funding',
        });
        logger_1.logger.info('Wallet funding initialized', {
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
    async handleWebhook(payload, signature) {
        logger_1.logger.info('Processing Paystack webhook');
        // Validate webhook signature
        if (!(0, paystack_1.validateWebhook)(payload, signature)) {
            logger_1.logger.error('Invalid webhook signature');
            throw new errors_1.BadRequestError('Invalid webhook signature');
        }
        const event = JSON.parse(payload);
        logger_1.logger.info('Webhook event received', { event: event.event });
        // Handle different event types
        switch (event.event) {
            case 'charge.success':
                await this.handleChargeSuccess(event.data);
                break;
            case 'charge.failed':
                await this.handleChargeFailed(event.data);
                break;
            default:
                logger_1.logger.info('Unhandled webhook event', { event: event.event });
        }
    }
    /**
     * Handle successful payment
     */
    async handleChargeSuccess(data) {
        const reference = data.reference;
        const amountInKobo = data.amount;
        const amountInNaira = (0, paystack_1.koboToNaira)(amountInKobo);
        logger_1.logger.info('Processing successful charge', { reference, amountInNaira });
        // Find our transaction by the reference
        const transaction = await database_1.prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiver: { select: { id: true, email: true, firstName: true } },
                receiverWallet: true,
            },
        });
        if (!transaction) {
            logger_1.logger.error('Transaction not found for reference', { reference });
            return; // Don't throw - webhook would retry forever
        }
        // Check if already processed (idempotency)
        if (transaction.status === client_1.TransactionStatus.COMPLETED) {
            logger_1.logger.info('Transaction already processed', { reference });
            return;
        }
        // Update wallet balance and transaction status
        const wallet = transaction.receiverWallet;
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore.add(amountInNaira);
        await database_1.prisma.$transaction([
            // Create ledger entry
            database_1.prisma.ledgerEntry.create({
                data: {
                    walletId: wallet.id,
                    transactionId: transaction.id,
                    entryType: client_1.LedgerEntryType.CREDIT,
                    amount: amountInNaira,
                    balanceBefore,
                    balanceAfter,
                    description: 'Wallet funding via Paystack',
                },
            }),
            // Update wallet balance
            database_1.prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: balanceAfter },
            }),
            // Update transaction status
            database_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: {
                    status: client_1.TransactionStatus.COMPLETED,
                    processedAt: new Date(),
                },
            }),
        ]);
        logger_1.logger.info('Wallet funded successfully', {
            walletId: wallet.id,
            amount: amountInNaira,
            newBalance: balanceAfter.toString(),
        });
        // Send notification email
        if (transaction.receiver) {
            await (0, notification_queue_1.queueEmailNotification)(transaction.receiver.id, 'Wallet Funded Successfully! 💰', `Your wallet has been credited with ₦${amountInNaira.toLocaleString()}. Your new balance is ₦${balanceAfter.toString()}.`);
        }
    }
    /**
     * Handle failed payment
     */
    async handleChargeFailed(data) {
        const reference = data.reference;
        logger_1.logger.info('Processing failed charge', { reference });
        // Find and update our transaction
        const transaction = await database_1.prisma.transaction.findFirst({
            where: { externalReference: reference },
        });
        if (!transaction) {
            logger_1.logger.error('Transaction not found for reference', { reference });
            return;
        }
        await database_1.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
                status: client_1.TransactionStatus.FAILED,
                failureReason: 'Payment failed on Paystack',
            },
        });
        logger_1.logger.info('Transaction marked as failed', { reference });
    }
    /**
     * Verify payment status
     *
     * Called when user returns from Paystack checkout
     * to check if payment was successful
     */
    async verifyPayment(reference) {
        logger_1.logger.info('Verifying payment', { reference });
        // Verify with Paystack
        const paystackResult = await (0, paystack_1.verifyTransaction)(reference);
        // Find our transaction
        const transaction = await database_1.prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiverWallet: true,
            },
        });
        if (!transaction) {
            throw new errors_1.NotFoundError('Transaction not found');
        }
        return {
            reference,
            paystackStatus: paystackResult.status,
            transactionStatus: transaction.status,
            amount: (0, paystack_1.koboToNaira)(paystackResult.amount),
            walletId: transaction.receiverWalletId,
        };
    }
    /**
     * Get user's payment history
     */
    async getPaymentHistory(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            database_1.prisma.transaction.findMany({
                where: {
                    receiverId: userId,
                    transactionType: client_1.TransactionType.DEPOSIT,
                    externalReference: { not: null }, // Only Paystack transactions
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.prisma.transaction.count({
                where: {
                    receiverId: userId,
                    transactionType: client_1.TransactionType.DEPOSIT,
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
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map