/*
 * Payment service - handles wallet funding via Paystack
 * 
 * Flow:
 * 1. User clicks "Add Money" -> creates pending transaction, returns checkout URL
 * 2. User pays -> Paystack webhook -> credits wallet, marks complete
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
    // start wallet funding - returns paystack checkout URL
    async initializeFunding(userId: string, walletId: string, amount: number) {
        logger.info('Initializing wallet funding', { userId, walletId, amount });

        if (amount <= 0) {
            throw new BadRequestError('Amount must be greater than zero');
        }

        // get user email for paystack
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, firstName: true },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        // check wallet exists and belongs to user
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
        });

        if (!wallet || wallet.userId !== userId) {
            throw new NotFoundError('Wallet not found');
        }

        const reference = generateReference();

        // create pending transaction
        const transaction = await prisma.transaction.create({
            data: {
                transactionType: TransactionType.DEPOSIT,
                amount: amount,
                currency: wallet.currency,
                status: TransactionStatus.PENDING,
                receiverId: userId,
                receiverWalletId: walletId,
                description: 'Wallet funding via Paystack',
                externalReference: reference,
            },
        });

        // init paystack transaction
        const paystackResult = await initializeTransaction(
            user.email,
            nairaToKobo(amount),
            reference,
            {
                userId,
                walletId,
                transactionId: transaction.id,
                type: 'wallet_funding',
            },
            'NGN'
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

    // handle paystack webhook
    async handleWebhook(payload: string, signature: string) {
        logger.info('Processing Paystack webhook');

        if (!validateWebhook(payload, signature)) {
            logger.error('Invalid webhook signature');
            throw new BadRequestError('Invalid webhook signature');
        }

        const event = JSON.parse(payload);
        logger.info('Webhook event received', { event: event.event });

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

    // payment successful - credit wallet
    private async handleChargeSuccess(data: any) {
        const reference = data.reference;
        const amountInKobo = data.amount;
        const amountInNaira = koboToNaira(amountInKobo);

        logger.info('Processing successful charge', { reference, amountInNaira });

        const transaction = await prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiver: { select: { id: true, email: true, firstName: true } },
                receiverWallet: true,
            },
        });

        if (!transaction) {
            logger.error('Transaction not found for reference', { reference });
            return;
        }

        // already processed? skip
        if (transaction.status === TransactionStatus.COMPLETED) {
            logger.info('Transaction already processed', { reference });
            return;
        }

        const wallet = transaction.receiverWallet!;
        const balanceBefore = wallet.balance;
        const balanceAfter = balanceBefore.add(amountInNaira);

        await prisma.$transaction([
            // create ledger entry
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
            // update wallet balance
            prisma.wallet.update({
                where: { id: wallet.id },
                data: { balance: balanceAfter },
            }),
            // mark transaction complete
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

        // send email
        if (transaction.receiver) {
            await queueEmailNotification(
                transaction.receiver.id,
                'Wallet Funded Successfully! 💰',
                `Your wallet has been credited with ₦${amountInNaira.toLocaleString()}. Your new balance is ₦${balanceAfter.toString()}.`
            );
        }
    }

    // payment failed
    private async handleChargeFailed(data: any) {
        const reference = data.reference;

        logger.info('Processing failed charge', { reference });

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

    // verify payment status (for when user returns from paystack)
    async verifyPayment(reference: string) {
        logger.info('Verifying payment', { reference });

        const paystackResult = await verifyTransaction(reference);

        const transaction = await prisma.transaction.findFirst({
            where: { externalReference: reference },
            include: {
                receiverWallet: true,
            },
        });

        if (!transaction) {
            throw new NotFoundError('Transaction not found');
        }

        // if paystack says success but we're still pending, auto-complete
        if (paystackResult.status === 'success' && transaction.status === TransactionStatus.PENDING) {
            logger.info('Payment verified as success but still PENDING. Auto-completing...', { reference });

            await this.handleChargeSuccess({
                reference: paystackResult.reference,
                amount: paystackResult.amount
            });

            return {
                reference,
                paystackStatus: paystackResult.status,
                transactionStatus: TransactionStatus.COMPLETED,
                amount: koboToNaira(paystackResult.amount),
                walletId: transaction.receiverWalletId,
            };
        }

        return {
            reference,
            paystackStatus: paystackResult.status,
            transactionStatus: transaction.status,
            amount: koboToNaira(paystackResult.amount),
            walletId: transaction.receiverWalletId,
        };
    }

    // get user's payment history
    async getPaymentHistory(userId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    receiverId: userId,
                    transactionType: TransactionType.DEPOSIT,
                    externalReference: { not: null },
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