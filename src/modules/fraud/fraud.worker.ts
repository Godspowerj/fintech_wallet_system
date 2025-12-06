import { Worker, Job } from 'bullmq';
import { redis } from '../../config/redis';
import { FraudService } from './fraud.service';
import { logger } from '../../utils/logger';
import { TransactionType } from '@prisma/client';

interface FraudCheckJobData {
    transactionId: string;
    userId: string;
    amount: number;
    type: TransactionType;
}

const fraudService = new FraudService();

/**
 * Fraud detection background worker
 * Processes fraud check jobs asynchronously for better performance
 */
export const fraudWorker = new Worker<FraudCheckJobData>(
    'fraud-detection',
    async (job: Job<FraudCheckJobData>) => {
        logger.info(`Processing fraud check job ${job.id}`, {
            transactionId: job.data.transactionId,
        });

        try {
            const result = await fraudService.checkTransaction({
                transactionId: job.data.transactionId,
                userId: job.data.userId,
                amount: job.data.amount,
                type: job.data.type,
            });

            logger.info(`Fraud check completed for transaction ${job.data.transactionId}`, {
                isFraud: result.isFraud,
                riskScore: result.riskScore,
            });

            return result;
        } catch (error) {
            logger.error(`Fraud check failed for transaction ${job.data.transactionId}`, {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    },
    {
        connection: redis,
        concurrency: 5,
        limiter: {
            max: 100,
            duration: 1000,
        },
    }
);

// Worker event handlers
fraudWorker.on('completed', (job) => {
    logger.info(`Fraud check job ${job.id} completed`);
});

fraudWorker.on('failed', (job, error) => {
    logger.error(`Fraud check job ${job?.id} failed:`, error);
});

fraudWorker.on('error', (error) => {
    logger.error('Fraud worker error:', error);
});

export const startFraudWorker = () => {
    logger.info('Fraud detection worker started');
    return fraudWorker;
};

export const stopFraudWorker = async () => {
    await fraudWorker.close();
    logger.info('Fraud detection worker stopped');
};
