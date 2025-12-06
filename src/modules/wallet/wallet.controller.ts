
import { Response, NextFunction } from 'express';
import { WalletService } from './wallet.service';
import { AuthRequest } from '../../types';

const walletService = new WalletService();

export class WalletController {
  async createWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { currency } = req.body;
      const wallet = await walletService.createWallet(userId, currency);
      res.status(201).json({ success: true, data: wallet });
    } catch (error) {
      next(error);
    }
  }

  async getUserWallets(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const wallets = await walletService.getUserWallets(userId);
      res.json({ success: true, data: wallets });
    } catch (error) {
      next(error);
    }
  }

  async getWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const userId = req.user!.userId;
      const wallet = await walletService.getWalletById(walletId, userId);
      res.json({ success: true, data: wallet });
    } catch (error) {
      next(error);
    }
  }

  async getBalance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const userId = req.user!.userId;
      const balance = await walletService.getWalletBalance(walletId, userId);
      res.json({ success: true, data: balance });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const userId = req.user!.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await walletService.getWalletTransactions(walletId, userId, page, limit);
      res.json({ success: true, data: result.transactions, meta: result.pagination });
    } catch (error) {
      next(error);
    }
  }
}