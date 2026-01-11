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

import express, { Application, Request, Response } from 'express';

// CORS = Cross-Origin Resource Sharing
// Allows your frontend (on localhost:3001) to call your API (on localhost:3000)
import cors from 'cors';

// Helmet adds security headers to protect against common attacks
// Like wearing a helmet - protects your head (server) from damage
import helmet from 'helmet';

// Morgan logs every HTTP request - useful for debugging
// "GET /api/users 200 12ms" appears in your terminal
import morgan from 'morgan';

// Swagger generates beautiful API documentation automatically
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Our custom configuration and utilities
import { env, isProduction } from './config/environment';
import { morganStream } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';
import { prisma } from './config/database';
import { redis } from './config/redis';

// =============================================================================
// IMPORT ALL ROUTES
// Each route file handles a specific "section" of the API
// =============================================================================
import authRoutes from './modules/auth/auth.routes';       // Login, register, etc.
import walletRoutes from './modules/wallet/wallet.routes'; // Wallet management
import transactionRoutes from './modules/transaction/transaction.routes'; // Money transfers
import fraudRoutes from './modules/fraud/fraud.routes';     // Fraud detection
import adminRoutes from './modules/admin/admin.routes';     // Admin dashboard
import paymentRoutes from './modules/payment/payment.routes'; // Paystack payments

// Create the Express application
const app: Application = express();

// =============================================================================
// SECURITY MIDDLEWARE
// These run on EVERY request to protect your API
// =============================================================================

// Helmet: Adds various HTTP headers for security
// Example: X-Content-Type-Options: nosniff (prevents MIME sniffing attacks)
app.use(helmet());

// CORS: Controls who can call your API from a browser
// In development: Allow everyone (*)
// In production: Only allow specific domains (your frontend URL)
app.use(cors({
  origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
  credentials: true, // Allow cookies to be sent
}));

// =============================================================================
// BODY PARSING MIDDLEWARE
// Converts incoming request data into JavaScript objects
// =============================================================================

// Parse JSON bodies (when client sends: Content-Type: application/json)
// Example: { "email": "user@example.com", "password": "123" }
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (when client sends form data)
// Example: email=user@example.com&password=123
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =============================================================================
// LOGGING MIDDLEWARE
// Records every request for debugging and monitoring
// =============================================================================
app.use(morgan('combined', { stream: morganStream }));

// =============================================================================
// RATE LIMITING
// Prevents abuse by limiting how many requests a user can make
// Example: Max 100 requests per 15 minutes
// =============================================================================
app.use(generalRateLimiter);

// =============================================================================
// HEALTH CHECK ENDPOINT
// Used by monitoring tools to check if your API is alive
// Also useful for debugging - if /health works, your server is running!
// =============================================================================
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    // Check if Redis is connected
    const redisStatus = redis.status === 'ready' ? 'connected' : 'disconnected';

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
  } catch (error) {
    // If database check fails, return error status
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        redis: redis.status === 'ready' ? 'connected' : 'disconnected',
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
        url: `http://localhost:${env.PORT}`,
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

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =============================================================================
// API ROUTES
// Each app.use() connects a URL prefix to a route file
// 
// Example: app.use('/api/auth', authRoutes)
// This means: "Anything starting with /api/auth goes to authRoutes"
// So /api/auth/login → authRoutes handles the /login part
// =============================================================================
app.use('/api/auth', authRoutes);           // /api/auth/login, /api/auth/register
app.use('/api/wallets', walletRoutes);      // /api/wallets, /api/wallets/:id
app.use('/api/transactions', transactionRoutes); // /api/transactions/transfer
app.use('/api/fraud', fraudRoutes);         // /api/fraud/flags
app.use('/api/admin', adminRoutes);         // /api/admin/users
app.use('/api/payments', paymentRoutes);    // /api/payments/initialize, /api/payments/webhook

// =============================================================================
// ROOT ENDPOINT
// What you see when you visit http://localhost:3000/
// =============================================================================
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Fintech Wallet API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
  });
});



// 404 Handler: When someone requests a route that doesn't exist
app.use(notFoundHandler);

// Error Handler: Catches all errors and sends proper responses
// This MUST be the last middleware
app.use(errorHandler);

export default app;