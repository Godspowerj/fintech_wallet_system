import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: any;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: any;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: any;
export declare const ModelName: {
    readonly User: "User";
    readonly RefreshToken: "RefreshToken";
    readonly Wallet: "Wallet";
    readonly Transaction: "Transaction";
    readonly LedgerEntry: "LedgerEntry";
    readonly FraudFlag: "FraudFlag";
    readonly IdempotencyKey: "IdempotencyKey";
    readonly AuditLog: "AuditLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly role: "role";
    readonly isEmailVerified: "isEmailVerified";
    readonly emailVerifyToken: "emailVerifyToken";
    readonly resetPasswordToken: "resetPasswordToken";
    readonly resetPasswordExpiry: "resetPasswordExpiry";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly lastLoginAt: "lastLoginAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RefreshTokenScalarFieldEnum: {
    readonly id: "id";
    readonly token: "token";
    readonly userId: "userId";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum];
export declare const WalletScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly currency: "currency";
    readonly balance: "balance";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type WalletScalarFieldEnum = (typeof WalletScalarFieldEnum)[keyof typeof WalletScalarFieldEnum];
export declare const TransactionScalarFieldEnum: {
    readonly id: "id";
    readonly transactionType: "transactionType";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly status: "status";
    readonly description: "description";
    readonly metadata: "metadata";
    readonly senderId: "senderId";
    readonly senderWalletId: "senderWalletId";
    readonly receiverId: "receiverId";
    readonly receiverWalletId: "receiverWalletId";
    readonly idempotencyKey: "idempotencyKey";
    readonly processedAt: "processedAt";
    readonly failureReason: "failureReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];
export declare const LedgerEntryScalarFieldEnum: {
    readonly id: "id";
    readonly walletId: "walletId";
    readonly transactionId: "transactionId";
    readonly entryType: "entryType";
    readonly amount: "amount";
    readonly balanceBefore: "balanceBefore";
    readonly balanceAfter: "balanceAfter";
    readonly description: "description";
    readonly createdAt: "createdAt";
};
export type LedgerEntryScalarFieldEnum = (typeof LedgerEntryScalarFieldEnum)[keyof typeof LedgerEntryScalarFieldEnum];
export declare const FraudFlagScalarFieldEnum: {
    readonly id: "id";
    readonly transactionId: "transactionId";
    readonly reason: "reason";
    readonly riskScore: "riskScore";
    readonly status: "status";
    readonly reviewedBy: "reviewedBy";
    readonly reviewedAt: "reviewedAt";
    readonly reviewNotes: "reviewNotes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FraudFlagScalarFieldEnum = (typeof FraudFlagScalarFieldEnum)[keyof typeof FraudFlagScalarFieldEnum];
export declare const IdempotencyKeyScalarFieldEnum: {
    readonly id: "id";
    readonly key: "key";
    readonly requestHash: "requestHash";
    readonly response: "response";
    readonly createdAt: "createdAt";
    readonly expiresAt: "expiresAt";
};
export type IdempotencyKeyScalarFieldEnum = (typeof IdempotencyKeyScalarFieldEnum)[keyof typeof IdempotencyKeyScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly action: "action";
    readonly resource: "resource";
    readonly resourceId: "resourceId";
    readonly metadata: "metadata";
    readonly ipAddress: "ipAddress";
    readonly userAgent: "userAgent";
    readonly createdAt: "createdAt";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: "DbNull";
    readonly JsonNull: "JsonNull";
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: "DbNull";
    readonly JsonNull: "JsonNull";
    readonly AnyNull: "AnyNull";
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map