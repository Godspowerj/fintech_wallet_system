"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FraudController = void 0;
const fraud_service_1 = require("./fraud.service");
const fraudService = new fraud_service_1.FraudService();
class FraudController {
    async getFlaggedTransactions(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await fraudService.getFlaggedTransactions(page, limit);
            res.json({ success: true, data: result.flags, meta: result.pagination });
        }
        catch (error) {
            next(error);
        }
    }
    async reviewFlag(req, res, next) {
        try {
            const { flagId } = req.params;
            const { decision, notes } = req.body;
            const adminUserId = req.user.userId;
            const result = await fraudService.reviewFraudFlag(flagId, adminUserId, decision, notes);
            res.json({ success: true, data: result });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.FraudController = FraudController;
//# sourceMappingURL=fraud.controller.js.map