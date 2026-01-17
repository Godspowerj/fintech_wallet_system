/**
 * =============================================================================
 * EMAIL SERVICE - Using Resend
 * =============================================================================
 *
 * Resend is a modern email API that's easy to use.
 * Sign up at: https://resend.com
 *
 * Get your API key from: https://resend.com/api-keys
 * Add it to your .env file as RESEND_API_KEY
 */
/**
 * Send Password Reset Email
 */
export declare function sendPasswordResetEmail(email: string, token: string): Promise<import("resend").CreateEmailResponseSuccess>;
/**
 * Send Email Verification Email
 */
export declare function sendVerificationEmail(email: string, token: string): Promise<import("resend").CreateEmailResponseSuccess>;
/**
 * Send Welcome Email (after verification)
 */
export declare function sendWelcomeEmail(email: string, firstName: string): Promise<import("resend").CreateEmailResponseSuccess | null>;
/**
 * Send Generic Email (for notification worker)
 * This function can send ANY email with custom subject and content
 */
export declare function sendGenericEmail(to: string, // Recipient email address
subject: string, // Email subject line
message: string): Promise<import("resend").CreateEmailResponseSuccess>;
//# sourceMappingURL=email.d.ts.map