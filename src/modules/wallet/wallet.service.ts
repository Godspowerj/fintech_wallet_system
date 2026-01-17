import { prisma } from '../../config/database';
import { RedisLock } from '../../config/redis';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  WalletLockedError,
} from '../../utils/errors';
import { WalletStatus } from '@prisma/client';

export class WalletService {
  async createWallet(userId: string, currency: string = 'NGN') {
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        currency,
      },
    });

    return wallet;
  }

  async getWalletById(walletId: string, userId?: string) {
    const wallet = await prisma.wallet.findUnique({
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
      throw new NotFoundError('Wallet not found');
    }

    // Check ownership if userId provided
    if (userId && wallet.userId !== userId) {
      throw new ForbiddenError('Access denied');
    }

    return wallet;
  }

  async getUserWallets(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return wallets.map(wallet => ({
      ...wallet,
      balance: wallet.balance.toString(),
    }));
  }

  async getWalletBalance(walletId: string, userId: string) {
    const wallet = await this.getWalletById(walletId, userId);
    return {
      walletId: wallet.id,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      status: wallet.status,
    };
  }

  async getWalletTransactions(
    walletId: string,
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    await this.getWalletById(walletId, userId);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
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
      prisma.transaction.count({
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

  async suspendWallet(walletId: string, adminUserId: string) {
    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: { status: WalletStatus.SUSPENDED },
    });

    await prisma.auditLog.create({
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

  async activateWallet(walletId: string, adminUserId: string) {
    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: { status: WalletStatus.ACTIVE },
    });

    await prisma.auditLog.create({
      data: {
        userId: adminUserId,
        action: 'ACTIVATE_WALLET',
        resource: 'wallet',
        resourceId: walletId,
      },
    });

    return wallet;
  }

  async checkWalletStatus(walletId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
      throw new BadRequestError(`Wallet is ${wallet.status.toLowerCase()}`);
    }

    return wallet;
  }

  async lockWallet(walletId: string, ttl: number = 10000): Promise<RedisLock> {
    const lock = new RedisLock(`wallet:${walletId}`, ttl);
    const acquired = await lock.acquire();

    if (!acquired) {
      throw new WalletLockedError();
    }

    return lock;
  }
}