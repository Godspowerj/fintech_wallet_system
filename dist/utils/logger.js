"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const environment_1 = require("../config/environment");
// Log format for all environments
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Console format for development environment 
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
}));
// Transports for different environments
const transports = [
    new winston_1.default.transports.Console({
        format: environment_1.isProduction ? logFormat : consoleFormat,
    }),
];
// File transports for production environment
if (environment_1.isProduction) {
    transports.push(new winston_1.default.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
    }), new winston_1.default.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
    }));
}
// Create logger instance
exports.logger = winston_1.default.createLogger({
    level: environment_1.isProduction ? 'info' : 'debug',
    format: logFormat,
    transports,
    exitOnError: false,
});
// Stream for Morgan HTTP logging
exports.morganStream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
//# sourceMappingURL=logger.js.map