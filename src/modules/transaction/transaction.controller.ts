import { Response, NextFunction } from 'express';
import { TransactionService } from './transaction.service';
import { AuthRequest } from '../../types';
import { generateIdempotencyKey } from '../../utils/helpers';

const transactionService = new TransactionService();

export class TransactionController {
  async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { senderWalletId, receiverWalletId, amount, description } = req.body;
      
      const idempotencyKey = req.body.idempotencyKey || 
        generateIdempotencyKey(userId, { senderWalletId, receiverWalletId, amount });

      const result = await transactionService.transfer({
        senderWalletId,
        receiverWalletId,
        amount,
        description,
        idempotencyKey,
        userId,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deposit(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { walletId, amount, description } = req.body;
      
      const idempotencyKey = req.body.idempotencyKey || 
        generateIdempotencyKey(userId, { walletId, amount, type: 'deposit' });

      const result = await transactionService.deposit({
        walletId,
        amount,
        description,
        idempotencyKey,
        userId,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { walletId, amount, description } = req.body;
      
      const idempotencyKey = req.body.idempotencyKey || 
        generateIdempotencyKey(userId, { walletId, amount, type: 'withdraw' });

      const result = await transactionService.withdraw({
        walletId,
        amount,
        description,
        idempotencyKey,
        userId,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTransaction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { transactionId } = req.params;
      const result = await transactionService.getTransactionById(transactionId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}