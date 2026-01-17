"use strict";
/**
 * =============================================================================
 * PAYMENT ROUTES
 * =============================================================================
 *
 * Endpoints for Paystack payment integration:
 *
 * POST /api/payments/initialize  - Start wallet funding (requires auth)
 * POST /api/payments/webhook     - Paystack webhook (no auth - called by Paystack)
 * GET  /api/payments/verify/:ref - Verify payment (public - called after checkout)
 * GET  /api/payments/history     - Get user's payment history (requires auth)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const payment_validation_1 = require("./payment.validation");
const router = (0, express_1.Router)();
const paymentController = new payment_controller_1.PaymentController();
/**
 * POST /api/payments/initialize
 *
 * Start a wallet funding transaction
 * User must be logged in
 */
router.post('/initialize', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(payment_validation_1.initializeFundingSchema), (req, res, next) => paymentController.initializeFunding(req, res, next));
/**
 * POST /api/payments/webhook
 *
 * Paystack webhook endpoint
 * NO AUTH - Paystack calls this directly
 * Signature verified in the service
 */
router.post('/webhook', (req, res, next) => paymentController.handleWebhook(req, res, next));
/**
 * GET /api/payments/verify/:reference
 *
 * Verify payment status after checkout
 * Called when user returns from Paystack
 */
router.get('/verify/:reference', (req, res, next) => paymentController.verifyPayment(req, res, next));
/**
 * GET /api/payments/history
 *
 * Get user's Paystack payment history
 * User must be logged in
 */
router.get('/history', auth_middleware_1.authenticate, (req, res, next) => paymentController.getPaymentHistory(req, res, next));
exports.default = router;
//# sourceMappingURL=payment.routes.js.map