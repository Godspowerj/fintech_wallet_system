/*
 * Payment routes - Paystack integration
 */

import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { initializeFundingSchema } from './payment.validation';

const router = Router();
const paymentController = new PaymentController();

// start wallet funding (auth required)
router.post(
    '/initialize',
    authenticate,
    validate(initializeFundingSchema),
    (req, res, next) => paymentController.initializeFunding(req, res, next)
);

// paystack webhook (no auth - called by paystack)
router.post(
    '/webhook',
    (req, res, next) => paymentController.handleWebhook(req, res, next)
);

// verify payment after checkout
router.get(
    '/verify/:reference',
    (req, res, next) => paymentController.verifyPayment(req, res, next)
);

// get payment history (auth required)
router.get(
    '/history',
    authenticate,
    (req, res, next) => paymentController.getPaymentHistory(req, res, next)
);

export default router;
