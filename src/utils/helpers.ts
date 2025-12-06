import crypto from 'crypto';

export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateIdempotencyKey = (userId: string, data: any): string => {
  const content = `${userId}-${JSON.stringify(data)}-${Date.now()}`;
  return crypto.createHash('sha256').update(content).digest('hex');
};

export const sanitizeUser = (user: any) => {
  // Intentionally destructuring to remove sensitive fields
  const { passwordHash: _pw, emailVerifyToken: _evt, resetPasswordToken: _rpt, ...sanitized } = user;
  return sanitized;
};

export const formatCurrency = (amount: number | string, currency: string = 'USD'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numAmount);
};

export const calculateFee = (amount: number, feePercentage: number = 0): number => {
  return amount * (feePercentage / 100);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const paginate = (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};