export declare const UserRole: {
    readonly USER: "USER";
    readonly ADMIN: "ADMIN";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const WalletStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly CLOSED: "CLOSED";
};
export type WalletStatus = (typeof WalletStatus)[keyof typeof WalletStatus];
export declare const TransactionType: {
    readonly DEPOSIT: "DEPOSIT";
    readonly WITHDRAWAL: "WITHDRAWAL";
    readonly TRANSFER: "TRANSFER";
};
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export declare const TransactionStatus: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REVERSED: "REVERSED";
};
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
export declare const LedgerEntryType: {
    readonly DEBIT: "DEBIT";
    readonly CREDIT: "CREDIT";
};
export type LedgerEntryType = (typeof LedgerEntryType)[keyof typeof LedgerEntryType];
export declare const FraudStatus: {
    readonly FLAGGED: "FLAGGED";
    readonly REVIEWING: "REVIEWING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type FraudStatus = (typeof FraudStatus)[keyof typeof FraudStatus];
//# sourceMappingURL=enums.d.ts.map