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
declare const router: import("express-serve-static-core").Router;
export default router;
//# sourceMappingURL=payment.routes.d.ts.map