"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudService = void 0;
const database_1 = require("../../config/database");
const environment_1 = require("../../config/environment");
const client_1 = require("@prisma/client");
class FraudService {
    async checkTransaction(data) {
        const checks = await Promise.all([
            this.checkHighAmount(data.amount),
            this.checkNewAccountActivity(data.userId, data.amount),
            this.checkVelocity(data.userId),
        ]);
        const failedChecks = checks.filter((check) => check.isFraud);
        if (failedChecks.length > 0) {
            const riskScore = failedChecks.reduce((sum, check) => sum + check.riskScore, 0);
            const reasons = failedChecks.map((check) => check.reason).filter(Boolean);
            // Create fraud flag
            await database_1.prisma.fraudFlag.create({
                data: {
                    transactionId: data.transactionId,
                    reason: reasons.join('; '),
                    riskScore,
                    status: client_1.FraudStatus.FLAGGED,
                },
            });
            return {
                isFraud: true,
                reason: reasons.join('; '),
                riskScore,
            };
        }
        return {
            isFraud: false,
            riskScore: 0,
        };
    }
    async checkHighAmount(amount) {
        if (amount > environment_1.env.FRAUD_THRESHOLD_AMOUNT) {
            return {
                isFraud: true,
                reason: `Transaction amount exceeds threshold of ${environment_1.env.FRAUD_THRESHOLD_AMOUNT}`,
                riskScore: 50,
            };
        }
        return { isFraud: false, riskScore: 0 };
    }
    async checkNewAccountActivity(userId, amount) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return { isFraud: false, riskScore: 0 };
        }
        const accountAgeInDays = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (accountAgeInDays < environment_1.env.FRAUD_NEW_ACCOUNT_DAYS) {
            // New accounts sending large amounts
            const avgTransaction = environment_1.env.FRAUD_THRESHOLD_AMOUNT / environment_1.env.FRAUD_LARGE_TRANSFER_MULTIPLIER;
            if (amount > avgTransaction) {
                return {
                    isFraud: true,
                    reason: `New account (${accountAgeInDays} days) sending large amount`,
                    riskScore: 70,
                };
            }
        }
        return { isFraud: false, riskScore: 0 };
    }
    async checkVelocity(userId) {
        // Check number of transactions in last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentTransactions = await database_1.prisma.transaction.count({
            where: {
                senderId: userId,
                createdAt: { gte: oneHourAgo },
            },
        });
        if (recentTransactions > 10) {
            return {
                isFraud: true,
                reason: `High transaction velocity: ${recentTransactions} transactions in last hour`,
                riskScore: 60,
            };
        }
        return { isFraud: false, riskScore: 0 };
    }
    async getFlaggedTransactions(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [flags, total] = await Promise.all([
            database_1.prisma.fraudFlag.findMany({
                where: {
                    status: {
                        in: [client_1.FraudStatus.FLAGGED, client_1.FraudStatus.REVIEWING],
                    },
                },
                include: {
                    transaction: {
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
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            database_1.prisma.fraudFlag.count({
                where: {
                    status: {
                        in: [client_1.FraudStatus.FLAGGED, client_1.FraudStatus.REVIEWING],
                    },
                },
            }),
        ]);
        return {
            flags,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async reviewFraudFlag(flagId, adminUserId, decision, notes) {
        const flag = await database_1.prisma.fraudFlag.findUnique({
            where: { id: flagId },
            include: { transaction: true },
        });
        if (!flag) {
            throw new Error('Fraud flag not found');
        }
        const status = decision === 'approve' ? client_1.FraudStatus.APPROVED : client_1.FraudStatus.REJECTED;
        const updatedFlag = await database_1.prisma.fraudFlag.update({
            where: { id: flagId },
            data: {
                status,
                reviewedBy: adminUserId,
                reviewedAt: new Date(),
                reviewNotes: notes,
            },
        });
        // Create audit log
        await database_1.prisma.auditLog.create({
            data: {
                userId: adminUserId,
                action: 'REVIEW_FRAUD_FLAG',
                resource: 'fraud_flag',
                resourceId: flagId,
                metadata: {
                    decision,
                    transactionId: flag.transactionId,
                    notes,
                },
            },
        });
        return updatedFlag;
    }
}
exports.FraudService = FraudService;
//# sourceMappingURL=fraud.service.js.map