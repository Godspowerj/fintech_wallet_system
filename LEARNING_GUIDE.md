# 📚 Learning Guide for Fintech Wallet API

Welcome! This guide will help you understand how this codebase works, even if you're new to backend development.

---

## 🗺️ Project Overview

This is a **digital wallet API** - the backend for apps like PayPal, Venmo, or banking apps.

### What it does:
- 👤 **Users** can register, login, and manage their profile
- 💰 **Wallets** hold virtual money (like a bank account)
- 💸 **Transactions** move money between wallets
- 🔒 **Fraud Detection** catches suspicious activity
- 👑 **Admin** dashboard for managing users

---

## 📁 Folder Structure Explained

```
src/
├── config/           🔧 Configuration files
│   ├── database.ts   → Connects to PostgreSQL
│   ├── redis.ts      → Connects to Redis (caching)
│   └── environment.ts → Loads .env variables
│
├── middleware/       🚧 Code that runs before routes
│   ├── auth.middleware.ts      → Checks if user is logged in
│   ├── validation.middleware.ts → Validates request data
│   ├── errorHandler.middleware.ts → Catches errors
│   └── rateLimit.middleware.ts → Prevents spam
│
├── modules/          📦 Feature modules (main code!)
│   ├── auth/         → Login, register, logout
│   ├── wallet/       → Create/manage wallets
│   ├── transaction/  → Transfer money
│   ├── fraud/        → Detect suspicious activity
│   └── admin/        → Admin-only features
│
├── utils/            🛠️ Helper functions
│   ├── errors.ts     → Custom error classes
│   ├── jwt.ts        → Token generation
│   ├── helpers.ts    → Misc utilities
│   └── logger.ts     → Logging utility
│
├── types/            📝 TypeScript type definitions
├── workers/          ⚙️ Background job processors
├── app.ts            🚀 Express app setup
└── server.ts         🎬 Entry point
```

---

## 🔄 Request Flow

When someone calls your API, this is what happens:

```
1. Client sends request
   ↓
   POST /api/auth/login
   { email: "user@example.com", password: "123" }
   
2. Express receives it
   ↓
   app.ts routes it to /api/auth/*
   
3. Middleware runs
   ↓
   → Rate limiter checks if too many requests
   → Body parser converts JSON to object
   → Validation checks if data is correct
   
4. Route handler
   ↓
   auth.routes.ts matches /login
   
5. Controller
   ↓
   auth.controller.ts receives the request
   Extracts data, calls service
   
6. Service
   ↓
   auth.service.ts does the actual work
   → Finds user in database
   → Checks password
   → Creates tokens
   
7. Response
   ↓
   Controller sends response back
   { user: {...}, accessToken: "..." }
```

---

## 🔑 Key Concepts

### 1. Controllers vs Services

| Controllers | Services |
|-------------|----------|
| Handle HTTP requests | Handle business logic |
| Extract data from req | Talk to database |
| Send responses | No knowledge of HTTP |
| Thin - just routing | Fat - all the logic |

**Why separate?** Services can be reused by controllers, background jobs, tests, etc.

### 2. Middleware

Middleware are functions that run BEFORE your route:

```typescript
// Without middleware
router.post('/transfer', transferController);

// With middleware
router.post('/transfer', 
  authenticate,    // Check if logged in
  validateBody,    // Check if data is valid
  rateLimiter,     // Check if not spamming
  transferController
);
```

### 3. JWT Authentication

```
Login Flow:
1. User sends email/password
2. Server creates JWT token (like a digital ID)
3. Client stores token
4. Client sends token with every request
5. Server verifies token to identify user
```

### 4. Environment Variables

Secrets and config stored in `.env` file:

```bash
DATABASE_URL="postgresql://..."  # Where's the database?
JWT_SECRET="super-secret-key"    # Key to sign tokens
PORT=3000                        # Which port to run on?
```

---

## 🛠️ Common Patterns in This Codebase

### Pattern 1: Try-Catch with Next

```typescript
async function handler(req, res, next) {
  try {
    // Do something that might fail
    const result = await doSomething();
    res.json({ success: true, data: result });
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
}
```

### Pattern 2: Custom Errors

```typescript
// Instead of:
throw new Error('User not found');

// We do:
throw new NotFoundError('User not found');
// This automatically returns 404 status code
```

### Pattern 3: Prisma Queries

```typescript
// Find one user
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});

// Find many with conditions
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' }
});

// Create a record
const wallet = await prisma.wallet.create({
  data: { userId: user.id, currency: 'USD' }
});

// Update a record
await prisma.user.update({
  where: { id: userId },
  data: { lastLoginAt: new Date() }
});
```

---

## 🧪 How to Test the API

### 1. Use Swagger UI (Easiest)
Open http://localhost:3000/api-docs in your browser

### 2. Use curl (Terminal)
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Use Postman or Insomnia (GUI tools)

---

## 📖 Suggested Learning Path

1. **Start Here:**
   - `server.ts` - How the app starts
   - `app.ts` - How Express is configured

2. **Understand Auth:**
   - `auth.routes.ts` - The endpoints
   - `auth.controller.ts` - Request handling
   - `auth.service.ts` - Business logic

3. **Learn Middleware:**
   - `auth.middleware.ts` - How login is checked
   - `errorHandler.middleware.ts` - How errors are caught

4. **Study Services:**
   - `wallet.service.ts` - Simple CRUD operations
   - `transaction.service.ts` - Complex business logic

5. **Advanced:**
   - `redis.ts` - Caching and rate limiting
   - `fraud.service.ts` - Business rules
   - Background workers

---

## 🤔 Common Questions

### Why use TypeScript?
Catches errors before running. When you type `user.`, you get autocomplete for all user properties!

### Why Prisma instead of raw SQL?
Type safety, autocomplete, automatic migrations, and cleaner code.

### Why Redis?
Fast in-memory storage. Used for:
- Rate limiting (tracking request counts)
- Caching (storing frequently accessed data)
- Locking (preventing race conditions)

### What are race conditions?
When two things happen at the same time and conflict:
- User has $100
- Two $80 withdrawals happen simultaneously
- Both check balance (see $100)
- Both withdraw $80
- Now user has -$60! 😱

Redis locks prevent this.

---

## 🚀 Next Steps

1. **Read the commented code** - Start with server.ts and app.ts
2. **Test the API** - Use Swagger at /api-docs
3. **Make small changes** - Add a new field, new endpoint
4. **Break it on purpose** - Remove things and see what errors you get
5. **Build something similar** - The best way to learn!

Happy coding! 🎉
