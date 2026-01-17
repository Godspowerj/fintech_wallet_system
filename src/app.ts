/*
 * Express app config - middleware, routes, error handling
 */

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { env, isProduction } from './config/environment';
import { morganStream } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';
import { prisma } from './config/database';
import { redis } from './config/redis';

// routes
import authRoutes from './modules/auth/auth.routes';
import walletRoutes from './modules/wallet/wallet.routes';
import transactionRoutes from './modules/transaction/transaction.routes';
import fraudRoutes from './modules/fraud/fraud.routes';
import adminRoutes from './modules/admin/admin.routes';
import paymentRoutes from './modules/payment/payment.routes';

const app: Application = express();

// security
app.use(helmet());
app.use(cors({
  origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : '*',
  credentials: true,
}));

// body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// logging
app.use(morgan('combined', { stream: morganStream }));

// rate limiting
app.use(generalRateLimiter);

// health check
app.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const redisStatus = redis.status === 'ready' ? 'connected' : 'disconnected';

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: 'connected',
        redis: redisStatus,
      },
    });
  } catch (error) {
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

// swagger docs
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
  apis: ['./src/modules/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Fintech Wallet API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/health',
  });
});

// error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;