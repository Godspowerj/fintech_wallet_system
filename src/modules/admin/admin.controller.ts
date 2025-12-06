import { Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../../types';

const adminService = new AdminService();

export class AdminController {
  async getUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await adminService.getUsers(page, limit);
      res.json({ success: true, data: result.users, meta: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const user = await adminService.getUserDetails(userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async suspendWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const adminUserId = req.user!.userId;
      const wallet = await adminService.suspendWallet(walletId, adminUserId);
      res.json({ success: true, data: wallet });
    } catch (error) {
      next(error);
    }
  }

  async activateWallet(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { walletId } = req.params;
      const adminUserId = req.user!.userId;
      const wallet = await adminService.activateWallet(walletId, adminUserId);
      res.json({ success: true, data: wallet });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await adminService.getAuditLogs(page, limit);
      res.json({ success: true, data: result.logs, meta: result.pagination });
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}