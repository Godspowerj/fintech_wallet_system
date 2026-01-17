import { Worker } from 'bullmq';
import { TransactionType } from '@prisma/client';
interface FraudCheckJobData {
    transactionId: string;
    userId: string;
    amount: number;
    type: TransactionType;
}
/**
 * Fraud detection background worker
 * Processes fraud check jobs asynchronously for better performance
 */
export declare const fraudWorker: Worker<FraudCheckJobData, any, string>;
export declare const startFraudWorker: () => Worker<FraudCheckJobData, any, string>;
export declare const stopFraudWorker: () => Promise<void>;
export {};
//# sourceMappingURL=fraud.worker.d.ts.map