import { prisma } from '../../config/database';
import { WalletService } from '../wallet/wallet.service';
import { sanitizeUser } from '../../utils/helpers';

const walletService = new WalletService();

export class AdminService {
  async getUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count(),
    ]);

    return {
      users: users.map(sanitizeUser),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserDetails(userId: string) {
    const user = await prisma.user.findUnique({
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

    return sanitizeUser(user);
  }

  async suspendWallet(walletId: string, adminUserId: string) {
    return walletService.suspendWallet(walletId, adminUserId);
  }

  async activateWallet(walletId: string, adminUserId: string) {
    return walletService.activateWallet(walletId, adminUserId);
  }

  async getAuditLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
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
      prisma.auditLog.count(),
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
    const [
      totalUsers,
      totalWallets,
      totalTransactions,
      pendingFraudFlags,
      totalVolume,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.wallet.count(),
      prisma.transaction.count(),
      prisma.fraudFlag.count({ where: { status: 'FLAGGED' } }),
      prisma.transaction.aggregate({
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