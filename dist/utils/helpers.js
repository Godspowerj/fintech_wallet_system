"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.paginate = exports.isValidEmail = exports.calculateFee = exports.formatCurrency = exports.sanitizeUser = exports.generateIdempotencyKey = exports.sleep = exports.hashToken = exports.generateRandomToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandomToken = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomToken = generateRandomToken;
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.hashToken = hashToken;
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const generateIdempotencyKey = (userId, data) => {
    const content = `${userId}-${JSON.stringify(data)}-${Date.now()}`;
    return crypto_1.default.createHash('sha256').update(content).digest('hex');
};
exports.generateIdempotencyKey = generateIdempotencyKey;
const sanitizeUser = (user) => {
    // Intentionally destructuring to remove sensitive fields
    const { passwordHash: _removePasswordHash, emailVerifyToken: _removeEmailVerifyToken, resetPasswordToken: _removeResetToken, ...sanitized } = user;
    return sanitized;
};
exports.sanitizeUser = sanitizeUser;
const formatCurrency = (amount, currency = 'USD') => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(numAmount);
};
exports.formatCurrency = formatCurrency;
const calculateFee = (amount, feePercentage = 0) => {
    return amount * (feePercentage / 100);
};
exports.calculateFee = calculateFee;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const paginate = (page = 1, limit = 20) => {
    const skip = (page - 1) * limit;
    return { skip, take: limit };
};
exports.paginate = paginate;
const buildPaginationMeta = (total, page, limit) => {
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
exports.buildPaginationMeta = buildPaginationMeta;
//# sourceMappingURL=helpers.js.map