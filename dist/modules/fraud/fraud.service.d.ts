import { TransactionType } from '@prisma/client';
import { FraudCheckResult } from '../../types';
export declare class FraudService {
    checkTransaction(data: {
        transactionId: string;
        userId: string;
        amount: number;
        type: TransactionType;
    }): Promise<FraudCheckResult>;
    private checkHighAmount;
    private checkNewAccountActivity;
    private checkVelocity;
    getFlaggedTransactions(page?: number, limit?: number): Promise<{
        flags: ({
            transaction: {
                sender: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                } | null;
                receiver: {
                    id: string;
                    email: string;
                    firstName: string;
                    lastName: string;
                } | null;
            } & {
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
            };
        } & {
            status: import(".prisma/client").$Enums.FraudStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reason: string;
            riskScore: number;
            reviewedBy: string | null;
            reviewedAt: Date | null;
            reviewNotes: string | null;
            transactionId: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    reviewFraudFlag(flagId: string, adminUserId: string, decision: 'approve' | 'reject', notes?: string): Promise<{
        status: import(".prisma/client").$Enums.FraudStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reason: string;
        riskScore: number;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        reviewNotes: string | null;
        transactionId: string;
    }>;
}
//# sourceMappingURL=fraud.service.d.ts.map