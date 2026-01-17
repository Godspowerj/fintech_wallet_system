import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare class TransactionController {
    transfer(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deposit(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    withdraw(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTransaction(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=transaction.controller.d.ts.map