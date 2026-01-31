/*
 * Payment controller - handles paystack requests
 */

import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { AuthRequest } from '../../types';

const paymentService = new PaymentService();

export class PaymentController {
    // start wallet funding
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

    // handle paystack webhook
    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = JSON.stringify(req.body); 
            const signature = req.headers['x-paystack-signature'] as string;

            await paymentService.handleWebhook(payload, signature);

            res.status(200).json({ received: true });
        } catch (error) {
            console.error('Webhook processing error:', error);
            res.status(200).json({ received: true, error: 'Processing error' });
        }
    }

    // verify payment status
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

    // get payment history
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
