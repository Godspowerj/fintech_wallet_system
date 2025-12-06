import { Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';
import { TransactionStatus } from '@prisma/client';

interface TransactionJobData {
    transactionId: string;
    type: 'process' | 'retry' | 'cleanup';
}

/**
 * Transaction processing background worker
 * Handles async transaction operations like retries and cleanup
 */
export const transactionWorker = new Worker<TransactionJobData>(
    'transaction-processing',
    async (job: Job<TransactionJobData>) => {
        logger.info(`Processing transaction job ${job.id}`, {
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
                    logger.warn(`Unknown job type: ${job.data.type}`);
            }
        } catch (error) {
            logger.error(`Transaction job failed for ${job.data.transactionId}`, {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    },
    {
        connection: redis,
        concurrency: 10,
    }
);

/**
 * Handle transaction retry logic
 */
async function handleRetry(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
    });

    if (!transaction) {
        logger.warn(`Transaction ${transactionId} not found for retry`);
        return;
    }

    if (transaction.status !== TransactionStatus.FAILED) {
        logger.info(`Transaction ${transactionId} is not in FAILED status, skipping retry`);
        return;
    }

    // Retry logic would go here
    logger.info(`Retrying transaction ${transactionId}`);
}

/**
 * Handle stale transaction cleanup
 */
async function handleCleanup(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
    });

    if (!transaction) {
        return;
    }

    // Mark stale pending transactions as failed
    if (transaction.status === TransactionStatus.PENDING) {
        const createdAt = new Date(transaction.createdAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > 1) {
            await prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    status: TransactionStatus.FAILED,
                    failureReason: 'Transaction timed out',
                },
            });
            logger.info(`Cleaned up stale transaction ${transactionId}`);
        }
    }
}

// Worker event handlers
transactionWorker.on('completed', (job) => {
    logger.info(`Transaction job ${job.id} completed`);
});

transactionWorker.on('failed', (job, error) => {
    logger.error(`Transaction job ${job?.id} failed:`, error);
});

transactionWorker.on('error', (error) => {
    logger.error('Transaction worker error:', error);
});

export const startTransactionWorker = () => {
    logger.info('Transaction processing worker started');
    return transactionWorker;
};

export const stopTransactionWorker = async () => {
    await transactionWorker.close();
    logger.info('Transaction processing worker stopped');
};
