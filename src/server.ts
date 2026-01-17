/*
 * Server entry point - starts the app
 */

import app from './app';
import { env } from './config/environment';
import { logger } from './utils/logger';
import { disconnectDatabase } from './config/database';
import { disconnectRedis } from './config/redis';
import { startNotificationWorker, stopNotificationWorker } from './workers/notification.worker';

// start background worker
startNotificationWorker();

const PORT = env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
});

// cleanup on shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await stopNotificationWorker();
      await disconnectDatabase();
      await disconnectRedis();
      logger.info('All connections closed. Exiting process...');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // force shutdown after 30s
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

export default server;