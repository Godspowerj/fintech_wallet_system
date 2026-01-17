"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const database_1 = require("../../config/database");
const redis_1 = require("../../config/redis");
const wallet_service_1 = require("../wallet/wallet.service");
const fraud_service_1 = require("../fraud/fraud.service");
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
const notification_queue_1 = require("../../queues/notification.queue");
const walletService = new wallet_service_1.WalletService();
const fraudService = new fraud_service_1.FraudService();
class TransactionService {
    async transfer(data) {
        // Check idempotency
        const existing = await this.checkIdempotency(data.idempotencyKey);
        if (existing)
            return existing;
        // Validate amount
        if (data.amount <= 0) {
            throw new errors_1.BadRequestError('Amount must be greater than zero');
        }
        // Check sender owns wallet
        const senderWallet = await walletService.getWalletById(data.senderWalletId, data.userId);
        // Check wallets are different
        if (data.senderWalletId === data.receiverWalletId) {
            throw new errors_1.BadRequestError('Cannot transfer to the same wallet');
        }
        // Check receiver wallet exists
        const receiverWallet = await walletService.getWalletById(data.receiverWalletId);
        // Check wallet status
        await walletService.checkWalletStatus(data.senderWalletId);
        await walletService.checkWalletStatus(data.receiverWalletId);
        // Lock both wallets (alphabetically to prevent deadlock)
        const [firstId, secondId] = [data.senderWalletId, data.receiverWalletId].sort();
        const lock1 = await walletService.lockWallet(firstId, 15000);
        const lock2 = await walletService.lockWallet(secondId, 15000);
        try {
            // Create pending transaction
            const transaction = await database_1.prisma.transaction.create({
                data: {
                    transactionType: client_1.TransactionType.TRANSFER,
                    amount: data.amount,
                    currency: senderWallet.currency,
                    status: client_1.TransactionStatus.PENDING,
                    senderId: data.userId,
                    senderWalletId: data.senderWalletId,
                    receiverId: receiverWallet.userId,
                    receiverWalletId: data.receiverWalletId,
                    description: data.description,
                    idempotencyKey: data.idempotencyKey,
                },
            });
            // Run fraud check
            const fraudCheck = await fraudService.checkTransaction({
                transactionId: transaction.id,
                userId: data.userId,
                amount: data.amount,
                type: client_1.TransactionType.TRANSFER,
            });
            if (fraudCheck.isFraud) {
                await database_1.prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: client_1.TransactionStatus.FAILED,
                        failureReason: fraudCheck.reason,
                    },
                });
                await this.saveIdempotencyResult(data.idempotencyKey, {
                    success: false,
                    error: fraudCheck.reason,
                });
                throw new errors_1.BadRequestError(fraudCheck.reason || 'Transaction flagged for fraud');
            }
            // Check balance
            if (senderWallet.balance.lt(data.amount)) {
                await database_1.prisma.transaction.update({
                    where: { id: transaction.id },
                    data: {
                        status: client_1.TransactionStatus.FAILED,
                        failureReason: 'Insufficient funds',
                    },
                });
                await this.saveIdempotencyResult(data.idempotencyKey, {
                    success: false,
                    error: 'Insufficient funds',
                });
                throw new errors_1.InsufficientFundsError();
            }
            // Update transaction to processing
            await database_1.prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: client_1.TransactionStatus.PROCESSING },
            });
            // Execute transfer with ledger entries
            await this.executeTransfer(transaction.id, senderWallet, receiverWallet, data.amount);
            // Get final transaction
            const completedTransaction = await database_1.prisma.transaction.findUnique({
                where: { id: transaction.id },
                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            await this.saveIdempotencyResult(data.idempotencyKey, {
                success: true,
                data: completedTransaction,
            });
            // ========================================
            // QUEUE EMAIL NOTIFICATIONS
            // This is where YOU write the subject and message!
            // ========================================
            // Notify the SENDER that money was sent
            if (completedTransaction?.sender) {
                await (0, notification_queue_1.queueEmailNotification)(completedTransaction.sender.id, // userId
                'Transfer Successful ✅', // subject - YOU write this!
                `You successfully sent $${data.amount} to ${completedTransaction.receiver?.firstName || 'recipient'}.` // message - YOU write this!
                );
            }
            // Notify the RECEIVER that money was received
            if (completedTransaction?.receiver) {
                await (0, notification_queue_1.queueEmailNotification)(completedTransaction.receiver.id, // userId
                'Money Received! 💰', // subject - YOU write this!
                `You received $${data.amount} from ${completedTransaction.sender?.firstName || 'someone'}.` // message - YOU write this!
                );
            }
            return completedTransaction;
        }
        finally {
            await lock1.release();
            await lock2.release();
        }
    }
    async deposit(data) {
        // Check idempotency
        const existing = await this.checkIdempotency(data.idempotencyKey);
        if (existing)
            return existing;
        if (data.amount <= 0) {
            throw new errors_1.BadRequestError('Amount must be greater than zero');
        }
        const wallet = await walletService.getWalletById(data.walletId, data.userId);
        await walletService.checkWalletStatus(data.walletId);
        const lock = await walletService.lockWallet(data.walletId);
        try {
            const transaction = await database_1.prisma.transaction.create({
                data: {
                    transactionType: client_1.TransactionType.DEPOSIT,
                    amount: data.amount,
                    currency: wallet.currency,
                    status: client_1.TransactionStatus.COMPLETED,
                    receiverId: data.userId,
                    receiverWalletId: data.walletId,
                    description: data.description || 'Deposit',
                    idempotencyKey: data.idempotencyKey,
                    processedAt: new Date(),
                },
            });
            // Create ledger entry and update balance
            const balanceBefore = wallet.balance;
            const balanceAfter = balanceBefore.add(data.amount);
            await database_1.prisma.$transaction([
                database_1.prisma.ledgerEntry.create({
                    data: {
                        walletId: data.walletId,
                        transactionId: transaction.id,
                        entryType: client_1.LedgerEntryType.CREDIT,
                        amount: data.amount,
                        balanceBefore,
                        balanceAfter,
                        description: 'Deposit',
                    },
                }),
                database_1.prisma.wallet.update({
                    where: { id: data.walletId },
                    data: { balance: balanceAfter },
                }),
            ]);
            const result = await database_1.prisma.transaction.findUnique({
                where: { id: transaction.id },
                include: {
                    receiver: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            await this.saveIdempotencyResult(data.idempotencyKey, {
                success: true,
                data: result,
            });
            return result;
        }
        finally {
            await lock.release();
        }
    }
    async withdraw(data) {
        // Check idempotency
        const existing = await this.checkIdempotency(data.idempotencyKey);
        if (existing)
            return existing;
        if (data.amount <= 0) {
            throw new errors_1.BadRequestError('Amount must be greater than zero');
        }
        const wallet = await walletService.getWalletById(data.walletId, data.userId);
        await walletService.checkWalletStatus(data.walletId);
        const lock = await walletService.lockWallet(data.walletId);
        try {
            if (wallet.balance.lt(data.amount)) {
                throw new errors_1.InsufficientFundsError();
            }
            const transaction = await database_1.prisma.transaction.create({
                data: {
                    transactionType: client_1.TransactionType.WITHDRAWAL,
                    amount: data.amount,
                    currency: wallet.currency,
                    status: client_1.TransactionStatus.COMPLETED,
                    senderId: data.userId,
                    senderWalletId: data.walletId,
                    description: data.description || 'Withdrawal',
                    idempotencyKey: data.idempotencyKey,
                    processedAt: new Date(),
                },
            });
            const balanceBefore = wallet.balance;
            const balanceAfter = balanceBefore.sub(data.amount);
            await database_1.prisma.$transaction([
                database_1.prisma.ledgerEntry.create({
                    data: {
                        walletId: data.walletId,
                        transactionId: transaction.id,
                        entryType: client_1.LedgerEntryType.DEBIT,
                        amount: data.amount,
                        balanceBefore,
                        balanceAfter,
                        description: 'Withdrawal',
                    },
                }),
                database_1.prisma.wallet.update({
                    where: { id: data.walletId },
                    data: { balance: balanceAfter },
                }),
            ]);
            const result = await database_1.prisma.transaction.findUnique({
                where: { id: transaction.id },
                include: {
                    sender: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            await this.saveIdempotencyResult(data.idempotencyKey, {
                success: true,
                data: result,
            });
            return result;
        }
        finally {
            await lock.release();
        }
    }
    async executeTransfer(transactionId, senderWallet, receiverWallet, amount) {
        const senderBalanceBefore = senderWallet.balance;
        const senderBalanceAfter = senderBalanceBefore.sub(amount);
        const receiverBalanceBefore = receiverWallet.balance;
        const receiverBalanceAfter = receiverBalanceBefore.add(amount);
        await database_1.prisma.$transaction([
            // Debit sender
            database_1.prisma.ledgerEntry.create({
                data: {
                    walletId: senderWallet.id,
                    transactionId,
                    entryType: client_1.LedgerEntryType.DEBIT,
                    amount,
                    balanceBefore: senderBalanceBefore,
                    balanceAfter: senderBalanceAfter,
                    description: 'Transfer out',
                },
            }),
            database_1.prisma.wallet.update({
                where: { id: senderWallet.id },
                data: { balance: senderBalanceAfter },
            }),
            // Credit receiver
            database_1.prisma.ledgerEntry.create({
                data: {
                    walletId: receiverWallet.id,
                    transactionId,
                    entryType: client_1.LedgerEntryType.CREDIT,
                    amount,
                    balanceBefore: receiverBalanceBefore,
                    balanceAfter: receiverBalanceAfter,
                    description: 'Transfer in',
                },
            }),
            database_1.prisma.wallet.update({
                where: { id: receiverWallet.id },
                data: { balance: receiverBalanceAfter },
            }),
            // Update transaction
            database_1.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    status: client_1.TransactionStatus.COMPLETED,
                    processedAt: new Date(),
                },
            }),
        ]);
    }
    async getTransactionById(transactionId) {
        const transaction = await database_1.prisma.transaction.findUnique({
            where: { id: transactionId },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                ledgerEntries: true,
                fraudFlags: true,
            },
        });
        if (!transaction) {
            throw new errors_1.NotFoundError('Transaction not found');
        }
        return transaction;
    }
    async checkIdempotency(key) {
        const cacheKey = `idempotency:${key}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        return null;
    }
    async saveIdempotencyResult(key, result) {
        const cacheKey = `idempotency:${key}`;
        await redis_1.redis.setex(cacheKey, 86400, JSON.stringify(result)); // 24 hours
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map