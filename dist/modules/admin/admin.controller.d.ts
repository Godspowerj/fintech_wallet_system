import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare class AdminController {
    getUsers(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    suspendWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    activateWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getAuditLogs(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getStatistics(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=admin.controller.d.ts.map