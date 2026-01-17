"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const client_1 = require("@prisma/client");
const environment_1 = require("../config/environment");
const errorHandler = (err, req, res, _next) => {
    // Log error
    logger_1.logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });
    // Handle known operational errors
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            ...(err instanceof Error && 'errors' in err && { errors: err.errors }),
        });
        return;
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({
                success: false,
                error: 'A record with this value already exists',
            });
            return;
        }
        if (err.code === 'P2025') {
            res.status(404).json({
                success: false,
                error: 'Record not found',
            });
            return;
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        res.status(400).json({
            success: false,
            error: 'Invalid data provided',
        });
        return;
    }
    // Handle Prisma connection errors (database unreachable)
    if (err instanceof client_1.Prisma.PrismaClientInitializationError ||
        err.message?.includes("Can't reach database server")) {
        res.status(503).json({
            success: false,
            error: 'Service temporarily unavailable. Please try again later.',
        });
        return;
    }
    // Handle unknown errors
    res.status(500).json({
        success: false,
        error: environment_1.isProduction ? 'Internal server error' : err.message,
        ...(environment_1.isProduction ? {} : { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.url} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.middleware.js.map