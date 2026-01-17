"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)('ADMIN'));
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUser);
router.post('/wallets/:walletId/suspend', adminController.suspendWallet);
router.post('/wallets/:walletId/activate', adminController.activateWallet);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/statistics', adminController.getStatistics);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map