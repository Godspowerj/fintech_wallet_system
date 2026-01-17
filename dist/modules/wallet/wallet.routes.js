"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("./wallet.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const walletController = new wallet_controller_1.WalletController();
router.use(auth_middleware_1.authenticate); // All wallet routes require authentication
router.post('/', walletController.createWallet);
router.get('/', walletController.getUserWallets);
router.get('/:walletId', walletController.getWallet);
router.get('/:walletId/balance', walletController.getBalance);
router.get('/:walletId/transactions', walletController.getTransactions);
exports.default = router;
//# sourceMappingURL=wallet.routes.js.map