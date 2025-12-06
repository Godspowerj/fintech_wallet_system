import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const walletController = new WalletController();

router.use(authenticate); // All wallet routes require authentication

router.post('/', walletController.createWallet);
router.get('/', walletController.getUserWallets);
router.get('/:walletId', walletController.getWallet);
router.get('/:walletId/balance', walletController.getBalance);
router.get('/:walletId/transactions', walletController.getTransactions);

export default router;