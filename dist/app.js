"use strict";
/**
 * =============================================================================
 * APP.TS - THE EXPRESS APPLICATION CONFIGURATION
 * =============================================================================
 *
 * This file is like the "blueprint" of your restaurant:
 * - What security measures to use (helmet, cors)
 * - How to handle incoming orders (body parsing)
 * - What menu items are available (routes)
 * - What to do when something goes wrong (error handling)
 *
 * MIDDLEWARE EXPLANATION:
 * Middleware are functions that run BEFORE your route handlers.
 * Think of them as a "pipeline" - each request goes through them:
 *
 * Request → [Helmet] → [CORS] → [Body Parser] → [Logger] → [Your Route] → Response
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// CORS = Cross-Origin Resource Sharing
// Allows your frontend (on localhost:3001) to call your API (on localhost:3000)
const cors_1 = __importDefault(require("cors"));
// Helmet adds security headers to protect against common attacks
// Like wearing a helmet - protects your head (server) from damage
const helmet_1 = __importDefault(require("helmet"));
// Morgan logs every HTTP request - useful for debugging
// "GET /api/users 200 12ms" appears in your terminal
const morgan_1 = __importDefault(require("morgan"));
// Swagger generates beautiful API documentation automatically
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Our custom configuration and utilities
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
// =============================================================================
// IMPORT ALL ROUTES
// Each route file handles a specific "section" of the API
// =============================================================================
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes")); // Login, register, etc.
const wallet_routes_1 = __importDefault(require("./modules/wallet/wallet.routes")); // Wallet management
const transaction_routes_1 = __importDefault(require("./modules/transaction/transaction.routes")); // Money transfers
const fraud_routes_1 = __importDefault(require("./modules/fraud/fraud.routes")); // Fraud detection
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes")); // Admin dashboard
const payment_routes_1 = __importDefault(require("./modules/payment/payment.routes")); // Paystack payments
// Create the Express application
const app = (0, express_1.default)();
// =============================================================================
// SECURITY MIDDLEWARE
// These run on EVERY request to protect your API
// =============================================================================
// Helmet: Adds various HTTP headers for security
// Example: X-Content-Type-Options: nosniff (prevents MIME sniffing attacks)
app.use((0, helmet_1.default)());
// CORS: Controls who can call your API from a browser
// In development: Allow everyone (*)
// In production: Only allow specific domains (your frontend URL)
app.use((0, cors_1.default)({
    origin: environment_1.isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
    credentials: true, // Allow cookies to be sent
}));
// =============================================================================
// BODY PARSING MIDDLEWARE
// Converts incoming request data into JavaScript objects
// =============================================================================
// Parse JSON bodies (when client sends: Content-Type: application/json)
// Example: { "email": "user@example.com", "password": "123" }
app.use(express_1.default.json({ limit: '10mb' }));
// Parse URL-encoded bodies (when client sends form data)
// Example: email=user@example.com&password=123
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// =============================================================================
// LOGGING MIDDLEWARE
// Records every request for debugging and monitoring
// =============================================================================
app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
// =============================================================================
// RATE LIMITING
// Prevents abuse by limiting how many requests a user can make
// Example: Max 100 requests per 15 minutes
// =============================================================================
app.use(rateLimit_middleware_1.generalRateLimiter);
// =============================================================================
// HEALTH CHECK ENDPOINT
// Used by monitoring tools to check if your API is alive
// Also useful for debugging - if /health works, your server is running!
// =============================================================================
app.get('/health', async (_req, res) => {
    try {
        // Test database connection with a simple query
        await database_1.prisma.$queryRaw `SELECT 1`;
        // Check if Redis is connected
        const redisStatus = redis_1.redis.status === 'ready' ? 'connected' : 'disconnected';
        // Return health status
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(), // How long the server has been running
            services: {
                database: 'connected',
                redis: redisStatus,
            },
        });
    }
    catch (error) {
        // If database check fails, return error status
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            services: {
                database: 'disconnected',
                redis: redis_1.redis.status === 'ready' ? 'connected' : 'disconnected',
            },
        });
    }
});
// =============================================================================
// SWAGGER API DOCUMENTATION
// Generates interactive documentation at /api-docs
// You can test your API directly from the browser!
// =============================================================================
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Fintech Wallet API',
            version: '1.0.0',
            description: 'A professional fintech wallet API with fraud detection',
            contact: {
                name: 'API Support',
            },
        },
        servers: [
            {
                url: `http://localhost:${environment_1.env.PORT}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/*.routes.ts'], // Swagger reads comments from route files
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// =============================================================================
// API ROUTES
// Each app.use() connects a URL prefix to a route file
// 
// Example: app.use('/api/auth', authRoutes)
// This means: "Anything starting with /api/auth goes to authRoutes"
// So /api/auth/login → authRoutes handles the /login part
// =============================================================================
app.use('/api/auth', auth_routes_1.default); // /api/auth/login, /api/auth/register
app.use('/api/wallets', wallet_routes_1.default); // /api/wallets, /api/wallets/:id
app.use('/api/transactions', transaction_routes_1.default); // /api/transactions/transfer
app.use('/api/fraud', fraud_routes_1.default); // /api/fraud/flags
app.use('/api/admin', admin_routes_1.default); // /api/admin/users
app.use('/api/payments', payment_routes_1.default); // /api/payments/initialize, /api/payments/webhook
// =============================================================================
// ROOT ENDPOINT
// What you see when you visit http://localhost:3000/
// =============================================================================
app.get('/', (_req, res) => {
    res.json({
        message: 'Fintech Wallet API',
        version: '1.0.0',
        documentation: '/api-docs',
        health: '/health',
    });
});
// 404 Handler: When someone requests a route that doesn't exist
app.use(errorHandler_middleware_1.notFoundHandler);
// Error Handler: Catches all errors and sends proper responses
// This MUST be the last middleware
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map