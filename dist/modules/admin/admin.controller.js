"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const adminService = new admin_service_1.AdminService();
class AdminController {
    async getUsers(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await adminService.getUsers(page, limit);
            res.json({ success: true, data: result.users, meta: result.pagination });
        }
        catch (error) {
            next(error);
        }
    }
    async getUser(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await adminService.getUserDetails(userId);
            res.json({ success: true, data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async suspendWallet(req, res, next) {
        try {
            const { walletId } = req.params;
            const adminUserId = req.user.userId;
            const wallet = await adminService.suspendWallet(walletId, adminUserId);
            res.json({ success: true, data: wallet });
        }
        catch (error) {
            next(error);
        }
    }
    async activateWallet(req, res, next) {
        try {
            const { walletId } = req.params;
            const adminUserId = req.user.userId;
            const wallet = await adminService.activateWallet(walletId, adminUserId);
            res.json({ success: true, data: wallet });
        }
        catch (error) {
            next(error);
        }
    }
    async getAuditLogs(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const result = await adminService.getAuditLogs(page, limit);
            res.json({ success: true, data: result.logs, meta: result.pagination });
        }
        catch (error) {
            next(error);
        }
    }
    async getStatistics(req, res, next) {
        try {
            const stats = await adminService.getStatistics();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map