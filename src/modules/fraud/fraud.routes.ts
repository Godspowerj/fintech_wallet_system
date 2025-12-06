
import { Router } from 'express';
import { FraudController } from './fraud.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const fraudController = new FraudController();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/flags', fraudController.getFlaggedTransactions);
router.post('/flags/:flagId/review', fraudController.reviewFlag);

export default router;