"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const database_1 = require("../../config/database");
const wallet_service_1 = require("../wallet/wallet.service");
const helpers_1 = require("../../utils/helpers");
const walletService = new wallet_service_1.WalletService();
class AdminService {
    async getUsers(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    wallets: true,
                    _count: {
                        select: {
                            sentTransactions: true,
                            receivedTransactions: true,
                        },
                    },
                },
            }),
            database_1.prisma.user.count(),
        ]);
        return {
            users: users.map(helpers_1.sanitizeUser),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUserDetails(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                wallets: true,
                sentTransactions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
                receivedTransactions: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return (0, helpers_1.sanitizeUser)(user);
    }
    async suspendWallet(walletId, adminUserId) {
        return walletService.suspendWallet(walletId, adminUserId);
    }
    async activateWallet(walletId, adminUserId) {
        return walletService.activateWallet(walletId, adminUserId);
    }
    async getAuditLogs(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            database_1.prisma.auditLog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
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
            }),
            database_1.prisma.auditLog.count(),
        ]);
        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getStatistics() {
        const [totalUsers, totalWallets, totalTransactions, pendingFraudFlags, totalVolume,] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.wallet.count(),
            database_1.prisma.transaction.count(),
            database_1.prisma.fraudFlag.count({ where: { status: 'FLAGGED' } }),
            database_1.prisma.transaction.aggregate({
                _sum: { amount: true },
                where: { status: 'COMPLETED' },
            }),
        ]);
        return {
            totalUsers,
            totalWallets,
            totalTransactions,
            pendingFraudFlags,
            totalVolume: totalVolume._sum.amount?.toString() || '0',
        };
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map