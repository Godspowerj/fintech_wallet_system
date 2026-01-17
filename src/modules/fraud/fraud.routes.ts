
import { Router } from 'express';
import { FraudController } from './fraud.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const fraudController = new FraudController();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/flags', (req, res, next) => fraudController.getFlaggedTransactions(req, res, next));
router.post('/flags/:flagId/review', (req, res, next) => fraudController.reviewFlag(req, res, next));

export default router;