import { RedisLock } from '../../config/redis';
export declare class WalletService {
    createWallet(userId: string, currency?: string): Promise<{
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    getWalletById(walletId: string, userId?: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    getUserWallets(userId: string): Promise<{
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }[]>;
    getWalletBalance(walletId: string, userId: string): Promise<{
        walletId: string;
        balance: string;
        currency: string;
        status: import(".prisma/client").$Enums.WalletStatus;
    }>;
    getWalletTransactions(walletId: string, userId: string, page?: number, limit?: number): Promise<{
        transactions: ({
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    suspendWallet(walletId: string, adminUserId: string): Promise<{
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    activateWallet(walletId: string, adminUserId: string): Promise<{
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    checkWalletStatus(walletId: string): Promise<{
        status: import(".prisma/client").$Enums.WalletStatus;
        currency: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    lockWallet(walletId: string, ttl?: number): Promise<RedisLock>;
}
//# sourceMappingURL=wallet.service.d.ts.map