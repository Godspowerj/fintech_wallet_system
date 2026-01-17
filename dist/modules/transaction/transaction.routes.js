"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const rateLimit_middleware_1 = require("../../middleware/rateLimit.middleware");
const router = (0, express_1.Router)();
const transactionController = new transaction_controller_1.TransactionController();
router.use(auth_middleware_1.authenticate);
router.post('/transfer', rateLimit_middleware_1.transferRateLimiter, transactionController.transfer);
router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);
router.get('/:transactionId', transactionController.getTransaction);
exports.default = router;
//# sourceMappingURL=transaction.routes.js.map