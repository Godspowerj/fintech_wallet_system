import { prisma } from '../../config/database';
import { redis } from '../../config/redis';
import { WalletService } from '../wallet/wallet.service';
import { FraudService } from '../fraud/fraud.service';
import {
  InsufficientFundsError,
  BadRequestError,
  NotFoundError,
} from '../../utils/errors';
import { TransactionType, TransactionStatus, LedgerEntryType } from '@prisma/client';

const walletService = new WalletService();
const fraudService = new FraudService();

export class TransactionService {
  async transfer(data: {
    senderWalletId: string;
    receiverWalletId: string;
    amount: number;
    description?: string;
    idempotencyKey: string;
    userId: string;
  }) {
    // Check idempotency
    const existing = await this.checkIdempotency(data.idempotencyKey);
    if (existing) return existing;

    // Validate amount
    if (data.amount <= 0) {
      throw new BadRequestError('Amount must be greater than zero');
    }

    // Check sender owns wallet
    const senderWallet = await walletService.getWalletById(
      data.senderWalletId,
      data.userId
    );

    // Check wallets are different
    if (data.senderWalletId === data.receiverWalletId) {
      throw new BadRequestError('Cannot transfer to the same wallet');
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
      const transaction = await prisma.transaction.create({
        data: {
          transactionType: TransactionType.TRANSFER,
          amount: data.amount,
          currency: senderWallet.currency,
          status: TransactionStatus.PENDING,
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
        type: TransactionType.TRANSFER,
      });

      if (fraudCheck.isFraud) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
            failureReason: fraudCheck.reason,
          },
        });

        await this.saveIdempotencyResult(data.idempotencyKey, {
          success: false,
          error: fraudCheck.reason,
        });

        throw new BadRequestError(fraudCheck.reason || 'Transaction flagged for fraud');
      }

      // Check balance
      if (senderWallet.balance.lt(data.amount)) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: TransactionStatus.FAILED,
            failureReason: 'Insufficient funds',
          },
        });

        await this.saveIdempotencyResult(data.idempotencyKey, {
          success: false,
          error: 'Insufficient funds',
        });

        throw new InsufficientFundsError();
      }

      // Update transaction to processing
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: TransactionStatus.PROCESSING },
      });

      // Execute transfer with ledger entries
      await this.executeTransfer(transaction.id, senderWallet, receiverWallet, data.amount);

      // Get final transaction
      const completedTransaction = await prisma.transaction.findUnique({
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

      return completedTransaction;
    } finally {
      await lock1.release();
      await lock2.release();
    }
  }

  async deposit(data: {
    walletId: string;
    amount: number;
    description?: string;
    idempotencyKey: string;
    userId: string;
  }) {
    // Check idempotency
    const existing = await this.checkIdempotency(data.idempotencyKey);
    if (existing) return existing;

    if (data.amount <= 0) {
      throw new BadRequestError('Amount must be greater than zero');
    }

    const wallet = await walletService.getWalletById(data.walletId, data.userId);
    await walletService.checkWalletStatus(data.walletId);

    const lock = await walletService.lockWallet(data.walletId);

    try {
      const transaction = await prisma.transaction.create({
        data: {
          transactionType: TransactionType.DEPOSIT,
          amount: data.amount,
          currency: wallet.currency,
          status: TransactionStatus.COMPLETED,
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

      await prisma.$transaction([
        prisma.ledgerEntry.create({
          data: {
            walletId: data.walletId,
            transactionId: transaction.id,
            entryType: LedgerEntryType.CREDIT,
            amount: data.amount,
            balanceBefore,
            balanceAfter,
            description: 'Deposit',
          },
        }),
        prisma.wallet.update({
          where: { id: data.walletId },
          data: { balance: balanceAfter },
        }),
      ]);

      const result = await prisma.transaction.findUnique({
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
    } finally {
      await lock.release();
    }
  }

  async withdraw(data: {
    walletId: string;
    amount: number;
    description?: string;
    idempotencyKey: string;
    userId: string;
  }) {
    // Check idempotency
    const existing = await this.checkIdempotency(data.idempotencyKey);
    if (existing) return existing;

    if (data.amount <= 0) {
      throw new BadRequestError('Amount must be greater than zero');
    }

    const wallet = await walletService.getWalletById(data.walletId, data.userId);
    await walletService.checkWalletStatus(data.walletId);

    const lock = await walletService.lockWallet(data.walletId);

    try {
      if (wallet.balance.lt(data.amount)) {
        throw new InsufficientFundsError();
      }

      const transaction = await prisma.transaction.create({
        data: {
          transactionType: TransactionType.WITHDRAWAL,
          amount: data.amount,
          currency: wallet.currency,
          status: TransactionStatus.COMPLETED,
          senderId: data.userId,
          senderWalletId: data.walletId,
          description: data.description || 'Withdrawal',
          idempotencyKey: data.idempotencyKey,
          processedAt: new Date(),
        },
      });

      const balanceBefore = wallet.balance;
      const balanceAfter = balanceBefore.sub(data.amount);

      await prisma.$transaction([
        prisma.ledgerEntry.create({
          data: {
            walletId: data.walletId,
            transactionId: transaction.id,
            entryType: LedgerEntryType.DEBIT,
            amount: data.amount,
            balanceBefore,
            balanceAfter,
            description: 'Withdrawal',
          },
        }),
        prisma.wallet.update({
          where: { id: data.walletId },
          data: { balance: balanceAfter },
        }),
      ]);

      const result = await prisma.transaction.findUnique({
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
    } finally {
      await lock.release();
    }
  }

  private async executeTransfer(
    transactionId: string,
    senderWallet: any,
    receiverWallet: any,
    amount: number
  ) {
    const senderBalanceBefore = senderWallet.balance;
    const senderBalanceAfter = senderBalanceBefore.sub(amount);
    const receiverBalanceBefore = receiverWallet.balance;
    const receiverBalanceAfter = receiverBalanceBefore.add(amount);

    await prisma.$transaction([
      // Debit sender
      prisma.ledgerEntry.create({
        data: {
          walletId: senderWallet.id,
          transactionId,
          entryType: LedgerEntryType.DEBIT,
          amount,
          balanceBefore: senderBalanceBefore,
          balanceAfter: senderBalanceAfter,
          description: 'Transfer out',
        },
      }),
      prisma.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: senderBalanceAfter },
      }),
      // Credit receiver
      prisma.ledgerEntry.create({
        data: {
          walletId: receiverWallet.id,
          transactionId,
          entryType: LedgerEntryType.CREDIT,
          amount,
          balanceBefore: receiverBalanceBefore,
          balanceAfter: receiverBalanceAfter,
          description: 'Transfer in',
        },
      }),
      prisma.wallet.update({
        where: { id: receiverWallet.id },
        data: { balance: receiverBalanceAfter },
      }),
      // Update transaction
      prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: TransactionStatus.COMPLETED,
          processedAt: new Date(),
        },
      }),
    ]);
  }

  async getTransactionById(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
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
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }

  private async checkIdempotency(key: string) {
    const cacheKey = `idempotency:${key}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    return null;
  }

  private async saveIdempotencyResult(key: string, result: any) {
    const cacheKey = `idempotency:${key}`;
    await redis.setex(cacheKey, 86400, JSON.stringify(result)); // 24 hours
  }
}