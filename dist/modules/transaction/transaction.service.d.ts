export declare class TransactionService {
    transfer(data: {
        senderWalletId: string;
        receiverWalletId: string;
        amount: number;
        description?: string;
        idempotencyKey: string;
        userId: string;
    }): Promise<any>;
    deposit(data: {
        walletId: string;
        amount: number;
        description?: string;
        idempotencyKey: string;
        userId: string;
    }): Promise<any>;
    withdraw(data: {
        walletId: string;
        amount: number;
        description?: string;
        idempotencyKey: string;
        userId: string;
    }): Promise<any>;
    private executeTransfer;
    getTransactionById(transactionId: string): Promise<{
        ledgerEntries: {
            id: string;
            createdAt: Date;
            amount: import("@prisma/client/runtime/library").Decimal;
            description: string | null;
            walletId: string;
            transactionId: string;
            entryType: import(".prisma/client").$Enums.LedgerEntryType;
            balanceBefore: import("@prisma/client/runtime/library").Decimal;
            balanceAfter: import("@prisma/client/runtime/library").Decimal;
        }[];
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
        fraudFlags: {
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
        }[];
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
    }>;
    private checkIdempotency;
    private saveIdempotencyResult;
}
//# sourceMappingURL=transaction.service.d.ts.map