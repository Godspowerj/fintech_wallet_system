/**
 * =============================================================================
 * PAYMENT SERVICE
 * =============================================================================
 *
 * This service handles:
 * 1. Initiating wallet funding (user wants to add money)
 * 2. Processing Paystack webhooks (payment confirmed)
 * 3. Handling payment verification
 *
 * FLOW:
 *
 * 1. User clicks "Add Money" → initializeFunding()
 *    → Creates pending transaction
 *    → Returns Paystack checkout URL
 *
 * 2. User pays on Paystack → Paystack sends webhook → handleWebhook()
 *    → Verifies webhook signature
 *    → Credits wallet balance
 *    → Updates transaction to COMPLETED
 */
export declare class PaymentService {
    /**
     * Initialize wallet funding
     *
     * Creates a pending transaction and returns Paystack checkout URL
     *
     * @param userId - The user's ID
     * @param walletId - Which wallet to credit
     * @param amount - Amount in Naira (we convert to kobo)
     * @returns Paystack authorization URL to redirect user to
     */
    initializeFunding(userId: string, walletId: string, amount: number): Promise<{
        transactionId: string;
        reference: string;
        authorizationUrl: string;
        accessCode: string;
    }>;
    /**
     * Handle Paystack webhook
     *
     * Called when Paystack sends a notification about a payment
     *
     * @param payload - Raw request body
     * @param signature - x-paystack-signature header
     */
    handleWebhook(payload: string, signature: string): Promise<void>;
    /**
     * Handle successful payment
     */
    private handleChargeSuccess;
    /**
     * Handle failed payment
     */
    private handleChargeFailed;
    /**
     * Verify payment status
     *
     * Called when user returns from Paystack checkout
     * to check if payment was successful
     */
    verifyPayment(reference: string): Promise<{
        reference: string;
        paystackStatus: string;
        transactionStatus: import(".prisma/client").$Enums.TransactionStatus;
        amount: number;
        walletId: string | null;
    }>;
    /**
     * Get user's payment history
     */
    getPaymentHistory(userId: string, page?: number, limit?: number): Promise<{
        transactions: {
            status: import(".prisma/client").$Enums.TransactionStatus;
            idempotencyKey: string | null;
            currency: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            transactionType: import(".prisma/client").$Enums.TransactionType;
            amount: import("@prisma/client/runtime/library").Decimal;
            description: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            senderId: string | null;
            senderWalletId: string | null;
            receiverId: string | null;
            receiverWalletId: string | null;
            externalReference: string | null;
            processedAt: Date | null;
            failureReason: string | null;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map