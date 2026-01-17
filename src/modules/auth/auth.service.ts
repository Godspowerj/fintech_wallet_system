/*
 * Auth service - handles login, register, password reset, etc.
 */

import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { env } from '../../config/environment';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  JwtPayload,
} from '../../utils/jwt';
import {
  generateRandomToken,
  sanitizeUser,
} from '../../utils/helpers';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../../utils/errors';
import { UserRole } from '@prisma/client';
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from '../../utils/email';

export class AuthService {
  // register new user
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    // check if email already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // hash password
    const passwordHash = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS);
    const emailVerifyToken = generateRandomToken();

    // create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerifyToken,
        role: UserRole.USER,
      },
    });

    // create default wallet (NGN)
    await prisma.wallet.create({
      data: {
        userId: user.id,
        currency: 'NGN',
      },
    });

    await sendWelcomeEmail(user.email, user.firstName);

    return {
      user: sanitizeUser(user),
      message: 'Registration successful. Please verify your email.',
    };
  }

  // login
  async login(data: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    // don't tell them if email exists or not (security)
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // generate tokens
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  // get new tokens using refresh token
  async refreshToken(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // rotate token (delete old, create new)
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  // logout - just delete the refresh token
  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    return { message: 'Logged out successfully' };
  }

  // verify email
  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      throw new BadRequestError('Invalid verification token');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null,
      },
    });

    await sendVerificationEmail(user.email, token);

    return { message: 'Email verified successfully' };
  }

  // forgot password - send reset link
  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // don't reveal if email exists
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = generateRandomToken();
    const resetExpiry = new Date();
    resetExpiry.setHours(resetExpiry.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetExpiry,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  // reset password with token
  async resetPassword(token: string, newPassword: string) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    // force logout everywhere
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    return { message: 'Password reset successfully' };
  }

  // get user profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallets: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return sanitizeUser(user);
  }
}
