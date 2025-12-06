import { Response, NextFunction } from 'express';
import { FraudService } from './fraud.service';
import { AuthRequest } from '../../types';

const fraudService = new FraudService();

export class FraudController {
  async getFlaggedTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await fraudService.getFlaggedTransactions(page, limit);
      res.json({ success: true, data: result.flags, meta: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  async reviewFlag(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { flagId } = req.params;
      const { decision, notes } = req.body;
      const adminUserId = req.user!.userId;
      
      const result = await fraudService.reviewFraudFlag(flagId, adminUserId, decision, notes);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}