# Fintech Wallet API

A professional-grade fintech wallet backend API with fraud detection, built with TypeScript, Express, Prisma, and Redis.

## 🚀 Features

- **User Authentication**: Secure registration, login, email verification, and password reset
- **Wallet Management**: Create, manage, and monitor digital wallets
- **Transactions**: Deposits, withdrawals, and peer-to-peer transfers with idempotency support
- **Fraud Detection**: Rule-based fraud detection with risk scoring and manual review
- **Admin Dashboard**: User management, wallet controls, and audit logging
- **Rate Limiting**: Configurable rate limiting for API endpoints
- **Background Jobs**: Async processing with BullMQ for notifications and transaction processing
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Caching/Queue**: Redis with BullMQ
- **Authentication**: JWT (Access + Refresh tokens)
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js v18 or higher
- PostgreSQL 16+
- Redis 7+
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd fintech-wallet-api
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis (with Docker)
docker-compose up -d postgres redis

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | User logout |
| POST | `/api/auth/verify-email` | Verify email address |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/profile` | Get user profile |

### Wallets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wallets` | List user wallets |
| POST | `/api/wallets` | Create new wallet |
| GET | `/api/wallets/:id` | Get wallet details |
| GET | `/api/wallets/:id/balance` | Get wallet balance |
| GET | `/api/wallets/:id/transactions` | Get wallet transactions |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/transfer` | Transfer funds |
| POST | `/api/transactions/deposit` | Deposit funds |
| POST | `/api/transactions/withdraw` | Withdraw funds |
| GET | `/api/transactions/:id` | Get transaction details |

### Admin (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id` | Get user details |
| POST | `/api/admin/wallets/:id/suspend` | Suspend wallet |
| POST | `/api/admin/wallets/:id/activate` | Activate wallet |
| GET | `/api/admin/audit-logs` | View audit logs |
| GET | `/api/admin/statistics` | Platform statistics |

### Fraud (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fraud/flags` | List flagged transactions |
| POST | `/api/fraud/flags/:id/review` | Review fraud flag |

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Authentication**: Short-lived access tokens + refresh tokens
- **Rate Limiting**: Configurable limits per endpoint
- **Helmet**: Security headers middleware
- **CORS**: Configurable cross-origin policies
- **Input Validation**: Zod schemas for all inputs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
fintech-wallet-api/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── config/             # Configuration files
│   │   ├── database.ts     # Prisma client setup
│   │   ├── environment.ts  # Environment validation
│   │   └── redis.ts        # Redis client setup
│   ├── middleware/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── errorHandler.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── modules/            # Feature modules
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── fraud/
│   │   ├── transaction/
│   │   └── wallet/
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── errors.ts
│   │   ├── helpers.ts
│   │   ├── jwt.ts
│   │   └── logger.ts
│   ├── workers/            # Background job workers
│   │   ├── notification.worker.ts
│   │   └── transaction.worker.ts
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── tests/
│   ├── integration/
│   └── unit/
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `REDIS_URL` | Redis connection URL | - |
| `JWT_ACCESS_SECRET` | Access token secret (min 32 chars) | - |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) | - |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `BCRYPT_ROUNDS` | Password hashing rounds | `12` |
| `FRAUD_THRESHOLD_AMOUNT` | Amount triggering fraud check | `10000` |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
