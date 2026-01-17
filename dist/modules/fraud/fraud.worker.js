"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopFraudWorker = exports.startFraudWorker = exports.fraudWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../config/redis");
const fraud_service_1 = require("./fraud.service");
const logger_1 = require("../../utils/logger");
const fraudService = new fraud_service_1.FraudService();
/**
 * Fraud detection background worker
 * Processes fraud check jobs asynchronously for better performance
 */
exports.fraudWorker = new bullmq_1.Worker('fraud-detection', async (job) => {
    logger_1.logger.info(`Processing fraud check job ${job.id}`, {
        transactionId: job.data.transactionId,
    });
    try {
        const result = await fraudService.checkTransaction({
            transactionId: job.data.transactionId,
            userId: job.data.userId,
            amount: job.data.amount,
            type: job.data.type,
        });
        logger_1.logger.info(`Fraud check completed for transaction ${job.data.transactionId}`, {
            isFraud: result.isFraud,
            riskScore: result.riskScore,
        });
        return result;
    }
    catch (error) {
        logger_1.logger.error(`Fraud check failed for transaction ${job.data.transactionId}`, {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
    }
}, {
    connection: redis_1.redis,
    concurrency: 5,
    limiter: {
        max: 100,
        duration: 1000,
    },
});
// Worker event handlers
exports.fraudWorker.on('completed', (job) => {
    logger_1.logger.info(`Fraud check job ${job.id} completed`);
});
exports.fraudWorker.on('failed', (job, error) => {
    logger_1.logger.error(`Fraud check job ${job?.id} failed:`, error);
});
exports.fraudWorker.on('error', (error) => {
    logger_1.logger.error('Fraud worker error:', error);
});
const startFraudWorker = () => {
    logger_1.logger.info('Fraud detection worker started');
    return exports.fraudWorker;
};
exports.startFraudWorker = startFraudWorker;
const stopFraudWorker = async () => {
    await exports.fraudWorker.close();
    logger_1.logger.info('Fraud detection worker stopped');
};
exports.stopFraudWorker = stopFraudWorker;
//# sourceMappingURL=fraud.worker.js.map