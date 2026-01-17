import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const walletController = new WalletController();

router.use(authenticate); // All wallet routes require authentication

router.post('/', (req, res, next) => walletController.createWallet(req, res, next));
router.get('/', (req, res, next) => walletController.getUserWallets(req, res, next));
router.get('/:walletId', (req, res, next) => walletController.getWallet(req, res, next));
router.get('/:walletId/balance', (req, res, next) => walletController.getBalance(req, res, next));
router.get('/:walletId/transactions', (req, res, next) => walletController.getTransactions(req, res, next));

export default router;