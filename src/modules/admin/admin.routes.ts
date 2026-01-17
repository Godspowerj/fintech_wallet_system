import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', (req, res, next) => adminController.getUsers(req, res, next));
router.get('/users/:userId', (req, res, next) => adminController.getUser(req, res, next));
router.post('/wallets/:walletId/suspend', (req, res, next) => adminController.suspendWallet(req, res, next));
router.post('/wallets/:walletId/activate', (req, res, next) => adminController.activateWallet(req, res, next));
router.get('/audit-logs', (req, res, next) => adminController.getAuditLogs(req, res, next));
router.get('/statistics', (req, res, next) => adminController.getStatistics(req, res, next));

export default router;