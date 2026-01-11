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

import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { initializeFundingSchema } from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

/**
 * POST /api/payments/initialize
 * 
 * Start a wallet funding transaction
 * User must be logged in
 */
router.post(
    '/initialize',
    authenticate,
    validate(initializeFundingSchema),
    (req, res, next) => paymentController.initializeFunding(req, res, next)
);

/**
 * POST /api/payments/webhook
 * 
 * Paystack webhook endpoint
 * NO AUTH - Paystack calls this directly
 * Signature verified in the service
 */
router.post(
    '/webhook',
    (req, res, next) => paymentController.handleWebhook(req, res, next)
);

/**
 * GET /api/payments/verify/:reference
 * 
 * Verify payment status after checkout
 * Called when user returns from Paystack
 */
router.get(
    '/verify/:reference',
    (req, res, next) => paymentController.verifyPayment(req, res, next)
);

/**
 * GET /api/payments/history
 * 
 * Get user's Paystack payment history
 * User must be logged in
 */
router.get(
    '/history',
    authenticate,
    (req, res, next) => paymentController.getPaymentHistory(req, res, next)
);

export default router;
