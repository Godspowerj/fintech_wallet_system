"use strict";
/**
 * =============================================================================
 * SERVER.TS - THE ENTRY POINT OF YOUR APPLICATION
 * =============================================================================
 *
 * Think of this file as the "ignition key" of your car.
 * When you run "npm run dev", Node.js starts HERE.
 *
 * This file does 3 things:
 * 1. Starts the HTTP server (so people can make requests)
 * 2. Logs helpful startup messages
 * 3. Handles graceful shutdown (cleanup when stopping)
 *
 * FLOW: npm run dev → server.ts → app.ts → routes → controllers → services
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the Express app we configured in app.ts
const app_1 = __importDefault(require("./app"));
// Import environment variables (PORT, NODE_ENV, etc.)
const environment_1 = require("./config/environment");
// Import our logging utility (instead of console.log, we use this)
const logger_1 = require("./utils/logger");
// Import cleanup functions for database and Redis connections
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
// Import the notification worker (background job processor)
const notification_worker_1 = require("./workers/notification.worker");
// Start the notification worker (it will watch Redis for new jobs)
(0, notification_worker_1.startNotificationWorker)();
// Get the port from environment variables, default to 3000
const PORT = environment_1.env.PORT || 3000;
/**
 * START THE SERVER
 *
 * app.listen() tells Express to start accepting HTTP requests
 * on the specified port. Think of it like opening a store:
 * "We're now open for business on Port 3000!"
 */
const server = app_1.default.listen(PORT, () => {
    // These messages appear in your terminal when the server starts
    logger_1.logger.info(`🚀 Server running on port ${PORT}`);
    logger_1.logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    logger_1.logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
    logger_1.logger.info(`🌍 Environment: ${environment_1.env.NODE_ENV}`);
});
/**
 * GRACEFUL SHUTDOWN
 *
 * What happens when you press Ctrl+C to stop the server?
 * We don't want to just "pull the plug" - that could corrupt data.
 *
 * Graceful shutdown means:
 * 1. Stop accepting NEW requests
 * 2. Wait for EXISTING requests to finish
 * 3. Close database connections properly
 * 4. Then exit
 *
 * It's like a restaurant: when closing time comes, you don't
 * kick out customers mid-meal. You stop accepting new guests,
 * let current ones finish, then close.
 */
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`${signal} received. Starting graceful shutdown...`);
    // server.close() stops accepting new connections
    server.close(async () => {
        logger_1.logger.info('HTTP server closed');
        try {
            // Stop the notification worker (finish current jobs)
            await (0, notification_worker_1.stopNotificationWorker)();
            // Close database connection
            await (0, database_1.disconnectDatabase)();
            // Close Redis connection
            await (0, redis_1.disconnectRedis)();
            logger_1.logger.info('All connections closed. Exiting process...');
            process.exit(0); // Exit code 0 = success
        }
        catch (error) {
            logger_1.logger.error('Error during shutdown:', error);
            process.exit(1); // Exit code 1 = error
        }
    });
    // Safety net: if cleanup takes too long, force shutdown after 30 seconds
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000);
};
/**
 * SIGNAL HANDLERS
 *
 * The operating system sends "signals" to your app:
 * - SIGTERM: "Please shut down" (used by Docker, Kubernetes)
 * - SIGINT: "User pressed Ctrl+C" (you stopping the server)
 *
 * We listen for these and call gracefulShutdown
 */
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
/**
 * ERROR HANDLERS
 *
 * Sometimes unexpected errors happen that we didn't catch:
 * - uncaughtException: A thrown error nobody caught
 * - unhandledRejection: A Promise rejected but nobody handled it
 *
 * Instead of crashing mysteriously, we log the error
 * and shut down gracefully
 */
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});
exports.default = server;
//# sourceMappingURL=server.js.map