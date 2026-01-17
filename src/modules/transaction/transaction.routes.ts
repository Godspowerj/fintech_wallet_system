import { Router } from 'express';
import { TransactionController } from './transaction.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { transferRateLimiter } from '../../middleware/rateLimit.middleware';

const router = Router();
const transactionController = new TransactionController();

router.use(authenticate);

router.post('/transfer', transferRateLimiter, (req, res, next) => transactionController.transfer(req, res, next));
router.post('/deposit', (req, res, next) => transactionController.deposit(req, res, next));
router.post('/withdraw', (req, res, next) => transactionController.withdraw(req, res, next));
router.get('/:transactionId', (req, res, next) => transactionController.getTransaction(req, res, next));

export default router;

