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

import { Resend } from 'resend';
import { env } from '../config/environment';
import { logger } from './logger';

// Initialize Resend with API key
const resend = new Resend(env.RESEND_API_KEY);

// Your app's frontend URL (for links in emails)
const APP_URL = env.FRONTEND_URL || 'http://localhost:5173';
const FROM_EMAIL = env.FROM_EMAIL || 'FinWallet <onboarding@resend.dev>';

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${APP_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset Your Password - FinWallet',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: #13131a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e; }
            .logo { font-size: 24px; font-weight: 700; color: #a855f7; margin-bottom: 24px; }
            h1 { font-size: 22px; margin-bottom: 16px; }
            p { color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; }
            .button { display: inline-block; background: linear-gradient(135deg, #a855f7, #6366f1); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a3e; font-size: 12px; color: #71717a; }
            .code { background: #1f1f2e; padding: 12px 16px; border-radius: 8px; font-family: monospace; word-break: break-all; font-size: 12px; color: #a1a1aa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">💳 FinWallet</div>
            <h1>Reset Your Password</h1>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${resetLink}" class="button">Reset Password</a>
            <p>This link will expire in <strong>1 hour</strong>.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <div class="footer">
              <p>If the button doesn't work, copy and paste this link:</p>
              <div class="code">${resetLink}</div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send password reset email:', error);
      throw new Error('Failed to send email');
    }

    logger.info(`Password reset email sent to ${email}`, { emailId: data?.id });
    return data;
  } catch (err) {
    logger.error('Email service error:', err);
    throw err;
  }
}

/**
 * Send Email Verification Email
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyLink = `${APP_URL}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify Your Email - FinWallet',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: #13131a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e; }
            .logo { font-size: 24px; font-weight: 700; color: #a855f7; margin-bottom: 24px; }
            h1 { font-size: 22px; margin-bottom: 16px; }
            p { color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; }
            .button { display: inline-block; background: linear-gradient(135deg, #a855f7, #6366f1); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a3e; font-size: 12px; color: #71717a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">💳 FinWallet</div>
            <h1>Verify Your Email</h1>
            <p>Welcome to FinWallet! Please verify your email address to get started:</p>
            <a href="${verifyLink}" class="button">Verify Email</a>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <div class="footer">
              <p>© FinWallet. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send verification email:', error);
      throw new Error('Failed to send email');
    }

    logger.info(`Verification email sent to ${email}`, { emailId: data?.id });
    return data;
  } catch (err) {
    logger.error('Email service error:', err);
    throw err;
  }
}

/**
 * Send Welcome Email (after verification)
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to FinWallet! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: #13131a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e; }
            .logo { font-size: 24px; font-weight: 700; color: #a855f7; margin-bottom: 24px; }
            h1 { font-size: 22px; margin-bottom: 16px; }
            p { color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; }
            .button { display: inline-block; background: linear-gradient(135deg, #a855f7, #6366f1); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .features { background: #1f1f2e; padding: 20px; border-radius: 12px; margin: 24px 0; }
            .feature { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #ffffff; }
            .feature:last-child { margin-bottom: 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">💳 FinWallet</div>
            <h1>Welcome, ${firstName}! 🎉</h1>
            <p>Your account is ready. Here's what you can do:</p>
            <div class="features">
              <div class="feature">💰 Send money instantly</div>
              <div class="feature">📊 Track your transactions</div>
              <div class="feature">🔒 Secure transfers</div>
            </div>
            <a href="${APP_URL}" class="button">Open FinWallet</a>
            <p>Need help? Just reply to this email.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send welcome email:', error);
      return null; // Don't throw - welcome email is not critical
    }

    logger.info(`Welcome email sent to ${email}`, { emailId: data?.id });
    return data;
  } catch (err) {
    logger.error('Email service error:', err);
    return null;
  }
}


/**
 * Send Generic Email (for notification worker)
 * This function can send ANY email with custom subject and content
 */
export async function sendGenericEmail(
  to: string,        // Recipient email address
  subject: string,   // Email subject line
  message: string    // Email content/body (can include HTML)
) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #ffffff; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; background: #13131a; border-radius: 16px; padding: 40px; border: 1px solid #2a2a3e; }
            .logo { font-size: 24px; font-weight: 700; color: #a855f7; margin-bottom: 24px; }
            h1 { font-size: 22px; margin-bottom: 16px; }
            p { color: #a1a1aa; line-height: 1.6; margin-bottom: 16px; }
            .content { color: #ffffff; margin: 24px 0; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #2a2a3e; font-size: 12px; color: #71717a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">💳 FinWallet</div>
            <h1>${subject}</h1>
            <div class="content">${message}</div>
            <div class="footer">
              <p>© FinWallet. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      logger.error('Failed to send generic email:', error);
      throw new Error('Failed to send email');
    }

    logger.info(`Generic email sent to ${to}`, { emailId: data?.id, subject });
    return data;
  } catch (err) {
    logger.error('Email service error:', err);
    throw err;
  }
}