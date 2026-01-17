"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const database_1 = require("../../config/database");
const redis_1 = require("../../config/redis");
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
class WalletService {
    async createWallet(userId, currency = 'USD') {
        const wallet = await database_1.prisma.wallet.create({
            data: {
                userId,
                currency,
            },
        });
        return wallet;
    }
    async getWalletById(walletId, userId) {
        const wallet = await database_1.prisma.wallet.findUnique({
            where: { id: walletId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!wallet) {
            throw new errors_1.NotFoundError('Wallet not found');
        }
        // Check ownership if userId provided
        if (userId && wallet.userId !== userId) {
            throw new errors_1.ForbiddenError('Access denied');
        }
        return wallet;
    }
    async getUserWallets(userId) {
        const wallets = await database_1.prisma.wallet.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return wallets;
    }
    async getWalletBalance(walletId, userId) {
        const wallet = await this.getWalletById(walletId, userId);
        return {
            walletId: wallet.id,
            balance: wallet.balance.toString(),
            currency: wallet.currency,
            status: wallet.status,
        };
    }
    async getWalletTransactions(walletId, userId, page = 1, limit = 20) {
        await this.getWalletById(walletId, userId);
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            database_1.prisma.transaction.findMany({
                where: {
                    OR: [{ senderWalletId: walletId }, { receiverWalletId: walletId }],
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
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
            }),
            database_1.prisma.transaction.count({
                where: {
                    OR: [{ senderWalletId: walletId }, { receiverWalletId: walletId }],
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
    async suspendWallet(walletId, adminUserId) {
        const wallet = await database_1.prisma.wallet.update({
            where: { id: walletId },
            data: { status: client_1.WalletStatus.SUSPENDED },
        });
        await database_1.prisma.auditLog.create({
            data: {
                userId: adminUserId,
                action: 'SUSPEND_WALLET',
                resource: 'wallet',
                resourceId: walletId,
                metadata: { previousStatus: wallet.status },
            },
        });
        return wallet;
    }
    async activateWallet(walletId, adminUserId) {
        const wallet = await database_1.prisma.wallet.update({
            where: { id: walletId },
            data: { status: client_1.WalletStatus.ACTIVE },
        });
        await database_1.prisma.auditLog.create({
            data: {
                userId: adminUserId,
                action: 'ACTIVATE_WALLET',
                resource: 'wallet',
                resourceId: walletId,
            },
        });
        return wallet;
    }
    async checkWalletStatus(walletId) {
        const wallet = await database_1.prisma.wallet.findUnique({
            where: { id: walletId },
        });
        if (!wallet) {
            throw new errors_1.NotFoundError('Wallet not found');
        }
        if (wallet.status !== client_1.WalletStatus.ACTIVE) {
            throw new errors_1.BadRequestError(`Wallet is ${wallet.status.toLowerCase()}`);
        }
        return wallet;
    }
    async lockWallet(walletId, ttl = 10000) {
        const lock = new redis_1.RedisLock(`wallet:${walletId}`, ttl);
        const acquired = await lock.acquire();
        if (!acquired) {
            throw new errors_1.WalletLockedError();
        }
        return lock;
    }
}
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.service.js.map