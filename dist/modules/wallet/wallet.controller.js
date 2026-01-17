"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
const walletService = new wallet_service_1.WalletService();
class WalletController {
    async createWallet(req, res, next) {
        try {
            const userId = req.user.userId;
            const { currency } = req.body;
            const wallet = await walletService.createWallet(userId, currency);
            res.status(201).json({ success: true, data: wallet });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserWallets(req, res, next) {
        try {
            const userId = req.user.userId;
            const wallets = await walletService.getUserWallets(userId);
            res.json({ success: true, data: wallets });
        }
        catch (error) {
            next(error);
        }
    }
    async getWallet(req, res, next) {
        try {
            const { walletId } = req.params;
            const userId = req.user.userId;
            const wallet = await walletService.getWalletById(walletId, userId);
            res.json({ success: true, data: wallet });
        }
        catch (error) {
            next(error);
        }
    }
    async getBalance(req, res, next) {
        try {
            const { walletId } = req.params;
            const userId = req.user.userId;
            const balance = await walletService.getWalletBalance(walletId, userId);
            res.json({ success: true, data: balance });
        }
        catch (error) {
            next(error);
        }
    }
    async getTransactions(req, res, next) {
        try {
            const { walletId } = req.params;
            const userId = req.user.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await walletService.getWalletTransactions(walletId, userId, page, limit);
            res.json({ success: true, data: result.transactions, meta: result.pagination });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.WalletController = WalletController;
//# sourceMappingURL=wallet.controller.js.map