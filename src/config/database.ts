/**
 * =============================================================================
 * DATABASE.TS - PRISMA DATABASE CONNECTION
 * =============================================================================
 * 
 * WHAT IS PRISMA?
 * Prisma is an ORM (Object-Relational Mapper). Instead of writing raw SQL:
 *   SELECT * FROM users WHERE email = 'john@example.com'
 * 
 * You write TypeScript:
 *   prisma.user.findUnique({ where: { email: 'john@example.com' } })
 * 
 * Benefits:
 * - TypeScript autocomplete (press Ctrl+Space to see options!)
 * - Type safety (catches errors before running)
 * - Works with PostgreSQL, MySQL, SQLite, etc.
 * 
 * SINGLETON PATTERN:
 * We only want ONE database connection for the whole app.
 * If we created a new connection every time, we'd overwhelm the database.
 * This is called the "Singleton Pattern" - only one instance exists.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

/**
 * CREATE PRISMA CLIENT
 * 
 * This function creates a new Prisma client with our configuration.
 * We configure logging to capture warnings and errors.
 */
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      // Log warnings and errors to help with debugging
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });
};

/**
 * TYPESCRIPT GLOBAL DECLARATION
 * 
 * This tells TypeScript: "Hey, there might be a 'prisma' variable
 * attached to the global object." This is for development only.
 * 
 * In development, when you save a file, the server restarts.
 * Without this, we'd create a NEW database connection on every restart,
 * eventually running out of connections!
 */
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

/**
 * THE SINGLETON LOGIC
 * 
 * globalThis.prisma ?? prismaClientSingleton() means:
 * - If globalThis.prisma exists, use it
 * - Otherwise, create a new one
 * 
 * The ?? is the "nullish coalescing operator" - returns right side
 * if left side is null or undefined.
 */
export const prisma = globalThis.prisma ?? prismaClientSingleton();

// In development, save the client to globalThis so it survives restarts
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

/**
 * ERROR LOGGING
 * 
 * Prisma emits events when errors or warnings occur.
 * We listen to these and log them using our logger.
 * This helps us debug database issues.
 */
prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e);
});

/**
 * GRACEFUL DISCONNECT
 * 
 * When the server shuts down, we should close the database connection
 * properly. This prevents "connection leak" - database connections
 * that are never closed.
 */
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Database disconnected');
};