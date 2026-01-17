import { Worker } from 'bullmq';
interface TransactionJobData {
    transactionId: string;
    type: 'process' | 'retry' | 'cleanup';
}
/**
 * Transaction processing background worker
 * Handles async transaction operations like retries and cleanup
 */
export declare const transactionWorker: Worker<TransactionJobData, any, string>;
export declare const startTransactionWorker: () => Worker<TransactionJobData, any, string>;
export declare const stopTransactionWorker: () => Promise<void>;
export {};
//# sourceMappingURL=transaction.worker.d.ts.map