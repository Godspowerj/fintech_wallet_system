export declare class AdminService {
    getUsers(page?: number, limit?: number): Promise<{
        users: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserDetails(userId: string): Promise<any>;
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
    getAuditLogs(page?: number, limit?: number): Promise<{
        logs: ({
            user: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            userId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            action: string;
            resource: string;
            resourceId: string | null;
            ipAddress: string | null;
            userAgent: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStatistics(): Promise<{
        totalUsers: number;
        totalWallets: number;
        totalTransactions: number;
        pendingFraudFlags: number;
        totalVolume: string;
    }>;
}
//# sourceMappingURL=admin.service.d.ts.map