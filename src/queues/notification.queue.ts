/*
 * Notification queue - adds email/sms jobs to Redis
 * Worker picks these up and sends them
 */

import { Queue } from 'bullmq';
import { bullmqRedis } from '../config/redis';
import { logger } from '../utils/logger';

const notificationQueue = new Queue('notifications', {
    connection: bullmqRedis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
    },
});

// queue email notification
export async function queueEmailNotification(
    userId: string,
    subject: string,
    message: string
) {
    try {
        const job = await notificationQueue.add('email-notification', {
            userId,
            type: 'email',
            subject,
            message,
        });

        logger.info(`Email notification queued for user ${userId}`, {
            jobId: job.id,
            subject,
        });

        return job;
    } catch (error) {
        logger.error('Failed to queue email notification:', error);
        throw error;
    }
}

// queue sms notification (for future)
export async function queueSmsNotification(
    userId: string,
    message: string
) {
    try {
        const job = await notificationQueue.add('sms-notification', {
            userId,
            type: 'sms',
            message,
        });

        logger.info(`SMS notification queued for user ${userId}`, {
            jobId: job.id,
        });

        return job;
    } catch (error) {
        logger.error('Failed to queue SMS notification:', error);
        throw error;
    }
}

// queue push notification (for future)
export async function queuePushNotification(
    userId: string,
    subject: string,
    message: string
) {
    try {
        const job = await notificationQueue.add('push-notification', {
            userId,
            type: 'push',
            subject,
            message,
        });

        logger.info(`Push notification queued for user ${userId}`, {
            jobId: job.id,
        });

        return job;
    } catch (error) {
        logger.error('Failed to queue push notification:', error);
        throw error;
    }
}

export { notificationQueue };
