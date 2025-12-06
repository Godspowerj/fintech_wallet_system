import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUser);
router.post('/wallets/:walletId/suspend', adminController.suspendWallet);
router.post('/wallets/:walletId/activate', adminController.activateWallet);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/statistics', adminController.getStatistics);

export default router;