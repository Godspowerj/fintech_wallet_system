"use strict";
/**
 * =============================================================================
 * NOTIFICATION QUEUE - The "Producer"
 * =============================================================================
 *
 * This file is used to ADD jobs to the notification queue.
 * The notification WORKER (in /workers) will pick up these jobs and process them.
 *
 * FLOW:
 * 1. Something happens in your app (e.g., user receives money)
 * 2. You call queueEmailNotification() with the message you want to send
 * 3. Job gets added to Redis queue
 * 4. Worker picks it up and sends the email
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = void 0;
exports.queueEmailNotification = queueEmailNotification;
exports.queueSmsNotification = queueSmsNotification;
exports.queuePushNotification = queuePushNotification;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis"); // Use BullMQ-compatible Redis
const logger_1 = require("../utils/logger");
// Create the queue (must use same name as worker: 'notifications')
const notificationQueue = new bullmq_1.Queue('notifications', {
    connection: redis_1.bullmqRedis,
    defaultJobOptions: {
        attempts: 3, // Retry 3 times if it fails
        backoff: {
            type: 'exponential', // Wait longer between each retry
            delay: 1000, // Start with 1 second
        },
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50, // Keep last 50 failed jobs
    },
});
exports.notificationQueue = notificationQueue;
/**
 * Queue an EMAIL notification
 *
 * @param userId - The user's ID (we'll look up their email)
 * @param subject - Email subject line (what you want it to say)
 * @param message - Email body (the content)
 *
 * @example
 * // After a successful transfer:
 * await queueEmailNotification(
 *     recipientUserId,
 *     'Money Received! 💰',
 *     `You received $${amount} from ${senderName}`
 * );
 */
async function queueEmailNotification(userId, subject, message) {
    try {
        const job = await notificationQueue.add('email-notification', {
            userId,
            type: 'email',
            subject,
            message,
        });
        logger_1.logger.info(`Email notification queued for user ${userId}`, {
            jobId: job.id,
            subject,
        });
        return job;
    }
    catch (error) {
        logger_1.logger.error('Failed to queue email notification:', error);
        throw error;
    }
}
/**
 * Queue an SMS notification (for future use)
 */
async function queueSmsNotification(userId, message) {
    try {
        const job = await notificationQueue.add('sms-notification', {
            userId,
            type: 'sms',
            message,
        });
        logger_1.logger.info(`SMS notification queued for user ${userId}`, {
            jobId: job.id,
        });
        return job;
    }
    catch (error) {
        logger_1.logger.error('Failed to queue SMS notification:', error);
        throw error;
    }
}
/**
 * Queue a PUSH notification (for future use)
 */
async function queuePushNotification(userId, subject, message) {
    try {
        const job = await notificationQueue.add('push-notification', {
            userId,
            type: 'push',
            subject,
            message,
        });
        logger_1.logger.info(`Push notification queued for user ${userId}`, {
            jobId: job.id,
        });
        return job;
    }
    catch (error) {
        logger_1.logger.error('Failed to queue push notification:', error);
        throw error;
    }
}
//# sourceMappingURL=notification.queue.js.map