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
import { Queue } from 'bullmq';
declare const notificationQueue: Queue<any, any, string, any, any, string>;
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
export declare function queueEmailNotification(userId: string, subject: string, message: string): Promise<import("bullmq").Job<any, any, string>>;
/**
 * Queue an SMS notification (for future use)
 */
export declare function queueSmsNotification(userId: string, message: string): Promise<import("bullmq").Job<any, any, string>>;
/**
 * Queue a PUSH notification (for future use)
 */
export declare function queuePushNotification(userId: string, subject: string, message: string): Promise<import("bullmq").Job<any, any, string>>;
export { notificationQueue };
//# sourceMappingURL=notification.queue.d.ts.map