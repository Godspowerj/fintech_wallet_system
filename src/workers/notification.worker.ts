/*
 * Notification worker - processes email/sms/push jobs from queue
 */

import { Worker, Job } from 'bullmq';
import { bullmqRedis } from '../config/redis';
import { logger } from '../utils/logger';
import { prisma } from '../config/database';
import { sendGenericEmail } from '../utils/email';

type NotificationType = 'email' | 'sms' | 'push';

interface NotificationJobData {
    userId: string;
    type: NotificationType;
    subject?: string;
    message: string;
    metadata?: Record<string, unknown>;
}

export const notificationWorker = new Worker<NotificationJobData>(
    'notifications',
    async (job: Job<NotificationJobData>) => {
        logger.info(`Processing notification job ${job.id}`, {
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
                    logger.warn(`Unknown notification type: ${job.data.type}`);
            }

            logger.info(`Notification sent successfully for user ${job.data.userId}`);
        } catch (error) {
            logger.error(`Failed to send notification for user ${job.data.userId}`, {
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            throw error;
        }
    },
    {
        connection: bullmqRedis,
        concurrency: 20,
        limiter: {
            max: 100,
            duration: 1000,
        },
    }
);

async function sendEmailNotification(data: NotificationJobData) {
    logger.info('Sending email notification', {
        userId: data.userId,
        subject: data.subject,
    });

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true }
    });

    if (!user) {
        logger.warn(`User not found for ID: ${data.userId}`);
        return;
    }

    await sendGenericEmail(
        user.email,
        data.subject || 'FinWallet Notification',
        data.message
    );

    logger.info(`Email sent successfully to ${user.email}`);
}

// sms - integrate with twilio etc
async function sendSmsNotification(data: NotificationJobData) {
    logger.info('Sending SMS notification', { userId: data.userId });
    // TODO: add twilio integration
}

// push - integrate with firebase etc
async function sendPushNotification(data: NotificationJobData) {
    logger.info('Sending push notification', { userId: data.userId });
    // TODO: add firebase integration
}

notificationWorker.on('completed', (job) => {
    logger.info(`Notification job ${job.id} completed`);
});

notificationWorker.on('failed', (job, error) => {
    logger.error(`Notification job ${job?.id} failed:`, error);
});

notificationWorker.on('error', (error) => {
    logger.error('Notification worker error:', error);
});

export const startNotificationWorker = () => {
    logger.info('Notification worker started');
    return notificationWorker;
};

export const stopNotificationWorker = async () => {
    await notificationWorker.close();
    logger.info('Notification worker stopped');
};
