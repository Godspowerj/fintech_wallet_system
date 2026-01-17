import crypto from 'crypto';

// generate random token (for password reset, email verify, etc.)
export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

// hash a token
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// wait for ms 
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// generate unique key for idempotent requests
export const generateIdempotencyKey = (userId: string, data: any): string => {
  const content = `${userId}-${JSON.stringify(data)}-${Date.now()}`;
  return crypto.createHash('sha256').update(content).digest('hex');
};

// remove sensitive fields from user object before sending to client
export const sanitizeUser = (user: any) => {
  const { passwordHash: _removePasswordHash, emailVerifyToken: _removeEmailVerifyToken, resetPasswordToken: _removeResetToken, ...sanitized } = user;
  return sanitized;
};

// format currency for display
export const formatCurrency = (amount: number | string, currency: string = 'NGN'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(numAmount);
};

// calculate fee
export const calculateFee = (amount: number, feePercentage: number = 0): number => {
  return amount * (feePercentage / 100);
};

// basic email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// pagination helper
export const paginate = (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
};

// build pagination metadata
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