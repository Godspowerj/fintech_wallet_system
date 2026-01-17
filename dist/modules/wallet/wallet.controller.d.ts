import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types';
export declare class WalletController {
    createWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getUserWallets(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getBalance(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getTransactions(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=wallet.controller.d.ts.map