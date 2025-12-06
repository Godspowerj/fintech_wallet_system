import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { transferRateLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();
const transactionController = new TransactionController();

router.use(authenticate);

router.post('/transfer', transferRateLimiter, transactionController.transfer);
router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);
router.get('/:transactionId', transactionController.getTransaction);

export default router;

