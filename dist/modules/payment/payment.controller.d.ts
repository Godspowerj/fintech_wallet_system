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
import { AuthRequest } from '../../types';
export declare class PaymentController {
    /**
     * Initialize wallet funding
     *
     * POST /api/payments/initialize
     * Body: { walletId: string, amount: number }
     *
     * Returns Paystack checkout URL
     */
    initializeFunding(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    /**
     * Handle Paystack webhook
     *
     * POST /api/payments/webhook
     *
     * Called by Paystack when payment status changes
     * Must respond with 200 quickly or Paystack will retry
     */
    handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Verify payment status
     *
     * GET /api/payments/verify/:reference
     *
     * Called after user returns from Paystack checkout
     */
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get payment history
     *
     * GET /api/payments/history
     * Query: { page?: number, limit?: number }
     */
    getPaymentHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=payment.controller.d.ts.map