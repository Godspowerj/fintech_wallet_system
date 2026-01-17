import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare class FraudController {
    getFlaggedTransactions(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    reviewFlag(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=fraud.controller.d.ts.map