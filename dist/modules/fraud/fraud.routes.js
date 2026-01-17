"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fraud_controller_1 = require("./fraud.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const fraudController = new fraud_controller_1.FraudController();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)('ADMIN'));
router.get('/flags', fraudController.getFlaggedTransactions);
router.post('/flags/:flagId/review', fraudController.reviewFlag);
exports.default = router;
//# sourceMappingURL=fraud.routes.js.map