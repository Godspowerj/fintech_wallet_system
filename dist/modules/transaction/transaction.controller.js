"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const helpers_1 = require("../../utils/helpers");
const transactionService = new transaction_service_1.TransactionService();
class TransactionController {
    async transfer(req, res, next) {
        try {
            const userId = req.user.userId;
            const { senderWalletId, receiverWalletId, amount, description } = req.body;
            const idempotencyKey = req.body.idempotencyKey ||
                (0, helpers_1.generateIdempotencyKey)(userId, { senderWalletId, receiverWalletId, amount });
            const result = await transactionService.transfer({
                senderWalletId,
                receiverWalletId,
                amount,
                description,
                idempotencyKey,
                userId,
            });
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async deposit(req, res, next) {
        try {
            const userId = req.user.userId;
            const { walletId, amount, description } = req.body;
            const idempotencyKey = req.body.idempotencyKey ||
                (0, helpers_1.generateIdempotencyKey)(userId, { walletId, amount, type: 'deposit' });
            const result = await transactionService.deposit({
                walletId,
                amount,
                description,
                idempotencyKey,
                userId,
            });
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async withdraw(req, res, next) {
        try {
            const userId = req.user.userId;
            const { walletId, amount, description } = req.body;
            const idempotencyKey = req.body.idempotencyKey ||
                (0, helpers_1.generateIdempotencyKey)(userId, { walletId, amount, type: 'withdraw' });
            const result = await transactionService.withdraw({
                walletId,
                amount,
                description,
                idempotencyKey,
                userId,
            });
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
    async getTransaction(req, res, next) {
        try {
            const { transactionId } = req.params;
            const result = await transactionService.getTransactionById(transactionId);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map