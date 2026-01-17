"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
/**
 * CREATE PRISMA CLIENT
 *
 * This function creates a new Prisma client with our configuration.
 * We configure logging to capture warnings and errors.
 */
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        log: [
            // Log warnings and errors to help with debugging
            { level: 'warn', emit: 'event' },
            { level: 'error', emit: 'event' },
        ],
    });
};
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
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
// In development, save the client to globalThis so it survives restarts
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
/**
 * ERROR LOGGING
 *
 * Prisma emits events when errors or warnings occur.
 * We listen to these and log them using our logger.
 * This helps us debug database issues.
 */
exports.prisma.$on('error', (e) => {
    logger_1.logger.error('Prisma Error:', e);
});
exports.prisma.$on('warn', (e) => {
    logger_1.logger.warn('Prisma Warning:', e);
});
/**
 * GRACEFUL DISCONNECT
 *
 * When the server shuts down, we should close the database connection
 * properly. This prevents "connection leak" - database connections
 * that are never closed.
 */
const disconnectDatabase = async () => {
    await exports.prisma.$disconnect();
    logger_1.logger.info('Database disconnected');
};
exports.disconnectDatabase = disconnectDatabase;
//# sourceMappingURL=database.js.map