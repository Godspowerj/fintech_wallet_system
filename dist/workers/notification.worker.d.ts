import { Worker } from 'bullmq';
type NotificationType = 'email' | 'sms' | 'push';
interface NotificationJobData {
    userId: string;
    type: NotificationType;
    subject?: string;
    message: string;
    metadata?: Record<string, unknown>;
}
/**
 * Notification background worker
 * Handles sending notifications asynchronously (email, SMS, push)
 */
export declare const notificationWorker: Worker<NotificationJobData, any, string>;
export declare const startNotificationWorker: () => Worker<NotificationJobData, any, string>;
export declare const stopNotificationWorker: () => Promise<void>;
export {};
//# sourceMappingURL=notification.worker.d.ts.map