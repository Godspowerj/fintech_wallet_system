/**
 * =============================================================================
 * PAYMENT CONTROLLER
 * =============================================================================
 * 
 * Handles HTTP requests for payment operations:
 * 
 * POST /api/payments/initialize - Start a wallet funding
 * POST /api/payments/webhook    - Receive Paystack notifications
 * GET  /api/payments/verify/:reference - Check payment status
 * GET  /api/payments/history    - Get payment history
 */

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { AuthRequest } from '../../types';

const paymentService = new PaymentService();

export class PaymentController {
    /**
     * Initialize wallet funding
     * 
     * POST /api/payments/initialize
     * Body: { walletId: string, amount: number }
     * 
     * Returns Paystack checkout URL
     */
    async initializeFunding(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { walletId, amount } = req.body;
            const userId = req.user!.userId;

            const result = await paymentService.initializeFunding(userId, walletId, amount);

            res.status(200).json({
                success: true,
                message: 'Payment initialized. Redirect user to authorizationUrl',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handle Paystack webhook
     * 
     * POST /api/payments/webhook
     * 
     * Called by Paystack when payment status changes
     * Must respond with 200 quickly or Paystack will retry
     */
    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            // Get raw body and signature
            const payload = JSON.stringify(req.body);
            const signature = req.headers['x-paystack-signature'] as string;

            await paymentService.handleWebhook(payload, signature);

            // Always respond 200 to acknowledge receipt
            res.status(200).json({ received: true });
        } catch (error) {
            // Log error but still return 200 to prevent Paystack retries
            console.error('Webhook processing error:', error);
            res.status(200).json({ received: true, error: 'Processing error' });
        }
    }

    /**
     * Verify payment status
     * 
     * GET /api/payments/verify/:reference
     * 
     * Called after user returns from Paystack checkout
     */
    async verifyPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const { reference } = req.params;

            const result = await paymentService.verifyPayment(reference);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get payment history
     * 
     * GET /api/payments/history
     * Query: { page?: number, limit?: number }
     */
    async getPaymentHistory(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await paymentService.getPaymentHistory(userId, page, limit);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}
