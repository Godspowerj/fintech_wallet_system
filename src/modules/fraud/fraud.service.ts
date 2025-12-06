import { prisma } from '../../config/database';
import { env } from '../../config/environment';
import { TransactionType, FraudStatus } from '@prisma/client';
import { FraudCheckResult } from '../../types';

export class FraudService {
  async checkTransaction(data: {
    transactionId: string;
    userId: string;
    amount: number;
    type: TransactionType;
  }): Promise<FraudCheckResult> {
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
      await prisma.fraudFlag.create({
        data: {
          transactionId: data.transactionId,
          reason: reasons.join('; '),
          riskScore,
          status: FraudStatus.FLAGGED,
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

  private async checkHighAmount(amount: number): Promise<FraudCheckResult> {
    if (amount > env.FRAUD_THRESHOLD_AMOUNT) {
      return {
        isFraud: true,
        reason: `Transaction amount exceeds threshold of ${env.FRAUD_THRESHOLD_AMOUNT}`,
        riskScore: 50,
      };
    }

    return { isFraud: false, riskScore: 0 };
  }

  private async checkNewAccountActivity(
    userId: string,
    amount: number
  ): Promise<FraudCheckResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { isFraud: false, riskScore: 0 };
    }

    const accountAgeInDays = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (accountAgeInDays < env.FRAUD_NEW_ACCOUNT_DAYS) {
      // New accounts sending large amounts
      const avgTransaction = env.FRAUD_THRESHOLD_AMOUNT / env.FRAUD_LARGE_TRANSFER_MULTIPLIER;

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

  private async checkVelocity(userId: string): Promise<FraudCheckResult> {
    // Check number of transactions in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentTransactions = await prisma.transaction.count({
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

  async getFlaggedTransactions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [flags, total] = await Promise.all([
      prisma.fraudFlag.findMany({
        where: {
          status: {
            in: [FraudStatus.FLAGGED, FraudStatus.REVIEWING],
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
      prisma.fraudFlag.count({
        where: {
          status: {
            in: [FraudStatus.FLAGGED, FraudStatus.REVIEWING],
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

  async reviewFraudFlag(
    flagId: string,
    adminUserId: string,
    decision: 'approve' | 'reject',
    notes?: string
  ) {
    const flag = await prisma.fraudFlag.findUnique({
      where: { id: flagId },
      include: { transaction: true },
    });

    if (!flag) {
      throw new Error('Fraud flag not found');
    }

    const status = decision === 'approve' ? FraudStatus.APPROVED : FraudStatus.REJECTED;

    const updatedFlag = await prisma.fraudFlag.update({
      where: { id: flagId },
      data: {
        status,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
        reviewNotes: notes,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
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