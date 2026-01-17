"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopTransactionWorker = exports.startTransactionWorker = exports.transactionWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
const database_1 = require("../config/database");
const client_1 = require("@prisma/client");
/**
 * Transaction processing background worker
 * Handles async transaction operations like retries and cleanup
 */
exports.transactionWorker = new bullmq_1.Worker('transaction-processing', async (job) => {
    logger_1.logger.info(`Processing transaction job ${job.id}`, {
        type: job.data.type,
        transactionId: job.data.transactionId,
    });
    try {
        switch (job.data.type) {
            case 'retry':
                await handleRetry(job.data.transactionId);
                break;
            case 'cleanup':
                await handleCleanup(job.data.transactionId);
                break;
            default:
                logger_1.logger.warn(`Unknown job type: ${job.data.type}`);
        }
    }
    catch (error) {
        logger_1.logger.error(`Transaction job failed for ${job.data.transactionId}`, {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
    }
}, {
    connection: redis_1.redis,
    concurrency: 10,
});
/**
 * Handle transaction retry logic
 */
async function handleRetry(transactionId) {
    const transaction = await database_1.prisma.transaction.findUnique({
        where: { id: transactionId },
    });
    if (!transaction) {
        logger_1.logger.warn(`Transaction ${transactionId} not found for retry`);
        return;
    }
    if (transaction.status !== client_1.TransactionStatus.FAILED) {
        logger_1.logger.info(`Transaction ${transactionId} is not in FAILED status, skipping retry`);
        return;
    }
    // Retry logic would go here
    logger_1.logger.info(`Retrying transaction ${transactionId}`);
}
/**
 * Handle stale transaction cleanup
 */
async function handleCleanup(transactionId) {
    const transaction = await database_1.prisma.transaction.findUnique({
        where: { id: transactionId },
    });
    if (!transaction) {
        return;
    }
    // Mark stale pending transactions as failed
    if (transaction.status === client_1.TransactionStatus.PENDING) {
        const createdAt = new Date(transaction.createdAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursDiff > 1) {
            await database_1.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    status: client_1.TransactionStatus.FAILED,
                    failureReason: 'Transaction timed out',
                },
            });
            logger_1.logger.info(`Cleaned up stale transaction ${transactionId}`);
        }
    }
}
// Worker event handlers
exports.transactionWorker.on('completed', (job) => {
    logger_1.logger.info(`Transaction job ${job.id} completed`);
});
exports.transactionWorker.on('failed', (job, error) => {
    logger_1.logger.error(`Transaction job ${job?.id} failed:`, error);
});
exports.transactionWorker.on('error', (error) => {
    logger_1.logger.error('Transaction worker error:', error);
});
const startTransactionWorker = () => {
    logger_1.logger.info('Transaction processing worker started');
    return exports.transactionWorker;
};
exports.startTransactionWorker = startTransactionWorker;
const stopTransactionWorker = async () => {
    await exports.transactionWorker.close();
    logger_1.logger.info('Transaction processing worker stopped');
};
exports.stopTransactionWorker = stopTransactionWorker;
//# sourceMappingURL=transaction.worker.js.map