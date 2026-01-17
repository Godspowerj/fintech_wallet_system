"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopNotificationWorker = exports.startNotificationWorker = exports.notificationWorker = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis"); // Use BullMQ-compatible Redis
const logger_1 = require("../utils/logger");
const database_1 = require("../config/database");
const email_1 = require("../utils/email");
/**
 * Notification background worker
 * Handles sending notifications asynchronously (email, SMS, push)
 */
exports.notificationWorker = new bullmq_1.Worker('notifications', async (job) => {
    logger_1.logger.info(`Processing notification job ${job.id}`, {
        type: job.data.type,
        userId: job.data.userId,
    });
    try {
        switch (job.data.type) {
            case 'email':
                await sendEmailNotification(job.data);
                break;
            case 'sms':
                await sendSmsNotification(job.data);
                break;
            case 'push':
                await sendPushNotification(job.data);
                break;
            default:
                logger_1.logger.warn(`Unknown notification type: ${job.data.type}`);
        }
        logger_1.logger.info(`Notification sent successfully for user ${job.data.userId}`);
    }
    catch (error) {
        logger_1.logger.error(`Failed to send notification for user ${job.data.userId}`, {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
    }
}, {
    connection: redis_1.bullmqRedis,
    concurrency: 20,
    limiter: {
        max: 100,
        duration: 1000,
    },
});
async function sendEmailNotification(data) {
    logger_1.logger.info('Sending email notification', {
        userId: data.userId,
        subject: data.subject,
    });
    const user = await database_1.prisma.user.findUnique({
        where: {
            id: data.userId,
        },
        select: { email: true }
    });
    if (!user) {
        logger_1.logger.warn(`User not found for ID: ${data.userId}`);
        return;
    }
    // Send the email using Resend
    await (0, email_1.sendGenericEmail)(user.email, // The user's email address
    data.subject || 'FinWallet Notification', // Subject (with fallback)
    data.message // The message content
    );
    logger_1.logger.info(`Email sent successfully to ${user.email}`);
}
/**
 * Send SMS notification
 * Integrate with SMS provider (Twilio, etc.)
 */
async function sendSmsNotification(data) {
    logger_1.logger.info('Sending SMS notification', {
        userId: data.userId,
    });
}
/**
 * Send push notification
 * Integrate with push provider (Firebase, etc.)
 */
async function sendPushNotification(data) {
    logger_1.logger.info('Sending push notification', {
        userId: data.userId,
    });
}
// Worker event handlers
exports.notificationWorker.on('completed', (job) => {
    logger_1.logger.info(`Notification job ${job.id} completed`);
});
exports.notificationWorker.on('failed', (job, error) => {
    logger_1.logger.error(`Notification job ${job?.id} failed:`, error);
});
exports.notificationWorker.on('error', (error) => {
    logger_1.logger.error('Notification worker error:', error);
});
const startNotificationWorker = () => {
    logger_1.logger.info('Notification worker started');
    return exports.notificationWorker;
};
exports.startNotificationWorker = startNotificationWorker;
const stopNotificationWorker = async () => {
    await exports.notificationWorker.close();
    logger_1.logger.info('Notification worker stopped');
};
exports.stopNotificationWorker = stopNotificationWorker;
//# sourceMappingURL=notification.worker.js.map