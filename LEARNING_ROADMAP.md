# 📚 Fintech Wallet API - Self-Paced Learning Roadmap

> **Your Background**: Basic Prisma, PostgreSQL, Express  
> **Goal**: Master this codebase at your own pace

---

## 📖 Required Concepts to Learn

Before diving into the code, you need to understand these concepts:

### 1. **TypeScript Advanced Patterns**
**What you need to learn:**
- Generics
- Type guards
- Utility types (Partial, Pick, Omit)
- Async/Await with proper typing

**Documentation:**
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

**Why:** The codebase uses TypeScript extensively with proper typing

---

### 2. **JWT Authentication**
**What you need to learn:**
- How JWT tokens work (Header.Payload.Signature)
- Access tokens vs Refresh tokens
- Token verification and expiration
- Secure token storage

**Documentation:**
- [JWT.io Introduction](https://jwt.io/introduction)
- [jsonwebtoken npm package](https://www.npmjs.com/package/jsonwebtoken)

**Why:** The entire auth system is JWT-based

---

### 3. **Bcrypt Password Hashing**
**What you need to learn:**
- Why we hash passwords (never store plain text)
- Salt rounds concept
- How to compare hashed passwords

**Documentation:**
- [bcrypt npm package](https://www.npmjs.com/package/bcrypt)
- [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

**Why:** User passwords are hashed with bcrypt

---

### 4. **Zod Validation**
**What you need to learn:**
- Schema definition
- Runtime validation
- Type inference from schemas
- Error handling

**Documentation:**
- [Zod Official Docs](https://zod.dev/)
- [Zod GitHub README](https://github.com/colinhacks/zod)

**Why:** All request validation uses Zod schemas

---

### 5. **Redis Basics**
**What you need to learn:**
- Key-value storage concept
- TTL (Time To Live)
- Common commands (GET, SET, DEL, KEYS)
- Use cases: caching, rate limiting, locking

**Documentation:**
- [Redis Tutorial](https://redis.io/docs/getting-started/)
- [ioredis npm package](https://www.npmjs.com/package/ioredis)

**Why:** Used for rate limiting, caching, and distributed locks

---

### 6. **Double-Entry Bookkeeping** ⭐ CRITICAL
**What you need to learn:**
- Every transaction has two sides (debit + credit)
- Ledger entries concept
- Balance tracking
- Audit trail

**Documentation:**
- [Double-Entry Bookkeeping Explained](https://www.investopedia.com/terms/d/double-entry.asp)
- [Accounting for Developers](https://www.moderntreasury.com/journal/accounting-for-developers-part-i)

**Why:** This is the CORE of how money moves in the system

---

### 7. **Idempotency**
**What you need to learn:**
- What idempotency means (same request = same result)
- Why it's critical for financial transactions
- How to implement with unique keys
- Preventing duplicate charges

**Documentation:**
- [Stripe's Idempotency Guide](https://stripe.com/docs/api/idempotent_requests)
- [Idempotency Patterns](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/)

**Why:** Prevents duplicate transactions if user clicks "send" twice

---

### 8. **Database Transactions (ACID)**
**What you need to learn:**
- Atomicity (all or nothing)
- Consistency
- Isolation levels
- Durability
- Prisma's `$transaction` API

**Documentation:**
- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)

**Why:** Money transfers must be atomic - can't debit without crediting

---

### 9. **Rate Limiting**
**What you need to learn:**
- Why rate limiting is needed (prevent abuse)
- Token bucket algorithm
- Redis-based rate limiting
- Different limits per endpoint

**Documentation:**
- [express-rate-limit package](https://www.npmjs.com/package/express-rate-limit)
- [Rate Limiting Patterns](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

**Why:** Protects API from abuse and DDoS attacks

---

### 10. **Background Jobs with BullMQ**
**What you need to learn:**
- Job queues concept
- Producers vs Consumers
- Job retry logic
- Queue monitoring

**Documentation:**
- [BullMQ Official Guide](https://docs.bullmq.io/)
- [BullMQ Patterns](https://docs.bullmq.io/patterns/introduction)

**Why:** Async processing for emails, notifications, fraud checks

---

## 🗺️ Step-by-Step Learning Path

### PHASE 1: Foundation & Setup

#### Step 1: Environment Setup
**Files to read:**
- `README.md` - Project overview
- `.env.example` - Configuration variables
- `docker-compose.yml` - Services setup
- `package.json` - Dependencies

**Tasks:**
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env

# 3. Start services
docker-compose up -d postgres redis

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Start server
npm run dev

# 7. Test
curl http://localhost:3000/health
```

**Verify:** Server running, Swagger at http://localhost:3000/api-docs

---

#### Step 2: Database Schema Deep Dive ⭐ CRITICAL
**Files to read:**
- `prisma/schema.prisma` - **READ EVERY LINE**

**What to understand:**
- User model (authentication data)
- Wallet model (holds money)
- Transaction model (money movements)
- LedgerEntry model (double-entry bookkeeping)
- FraudFlag model (suspicious activity)
- RefreshToken model (JWT refresh tokens)
- AuditLog model (admin actions)
- IdempotencyKey model (prevent duplicates)

**Study focus:**
- Relationships between models (foreign keys)
- Enums (UserRole, WalletStatus, TransactionType, etc.)
- Indexes (why they exist)
- Cascade deletes

**Concept to learn:** Database normalization, foreign key relationships

---

#### Step 3: Application Entry Points
**Files to read (in order):**
1. `src/server.ts` - How the app starts
2. `src/app.ts` - Express setup, middleware registration, routes

**What to understand:**
- How Express app is configured
- Middleware execution order
- Route registration
- Error handling setup
- Swagger documentation setup

---

### PHASE 2: Core Infrastructure

#### Step 4: Configuration Layer
**Files to read:**
1. `src/config/environment.ts` - Environment variable validation
2. `src/config/database.ts` - Prisma client setup
3. `src/config/redis.ts` - Redis client setup

**Concepts to learn:**
- Singleton pattern (why only one DB connection)
- Environment variable validation with Zod
- Connection pooling

**Documentation needed:**
- [Zod](https://zod.dev/) - For environment.ts
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client) - For database.ts

---

#### Step 5: Utilities
**Files to read:**
1. `src/utils/errors.ts` - Custom error classes
2. `src/utils/jwt.ts` - Token generation/verification
3. `src/utils/helpers.ts` - Utility functions
4. `src/utils/logger.ts` - Winston logger setup

**Concepts to learn:**
- Custom error classes extending Error
- JWT signing and verification
- Logging levels (info, warn, error)

**Documentation needed:**
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Winston](https://www.npmjs.com/package/winston)

---

#### Step 6: Middleware
**Files to read (in order):**
1. `src/middleware/errorHandler.middleware.ts` - Global error handler
2. `src/middleware/validation.middleware.ts` - Zod validation
3. `src/middleware/rateLimit.middleware.ts` - Rate limiting
4. `src/middleware/auth.middleware.ts` - JWT authentication

**What to understand:**
- Middleware execution order
- How errors are caught and formatted
- How validation works with Zod
- How rate limiting uses Redis
- How JWT tokens are verified

**Key concept:** Middleware pipeline pattern

---

### PHASE 3: Authentication Module

#### Step 7: Auth Module Deep Dive
**Files to read (in order):**
1. `src/modules/auth/auth.validation.ts` - Zod schemas
2. `src/modules/auth/auth.routes.ts` - API endpoints
3. `src/modules/auth/auth.controller.ts` - Request handlers
4. `src/modules/auth/auth.service.ts` - **MOST IMPORTANT** - Business logic

**What to understand in auth.service.ts:**
- `register()` - User creation, password hashing
- `login()` - Password verification, token generation
- `refreshToken()` - Token refresh flow
- `logout()` - Token invalidation
- `verifyEmail()` - Email verification
- `forgotPassword()` - Password reset flow
- `resetPassword()` - Password update

**Concepts to learn:**
- Password hashing with bcrypt
- JWT access + refresh token pattern
- Email verification tokens
- Password reset tokens with expiry

**Practice:**
```bash
# Test the complete auth flow via Swagger
1. Register user
2. Login (get tokens)
3. Access protected endpoint
4. Refresh token
5. Logout
```

---

### PHASE 4: Wallet Module

#### Step 8: Wallet Module
**Files to read (in order):**
1. `src/modules/wallet/wallet.validation.ts`
2. `src/modules/wallet/wallet.routes.ts`
3. `src/modules/wallet/wallet.controller.ts`
4. `src/modules/wallet/wallet.service.ts` - Business logic

**What to understand in wallet.service.ts:**
- `createWallet()` - Wallet creation
- `getWallets()` - List user wallets
- `getWalletById()` - Get specific wallet
- `getBalance()` - Current balance
- `getTransactions()` - Transaction history

**Concepts:**
- One user can have multiple wallets
- Each wallet has a currency
- Wallet status (ACTIVE, SUSPENDED, CLOSED)

**Practice:**
```bash
# Via Swagger:
1. Create a wallet
2. Check balance (should be 0)
3. View transaction history (empty)
```

---

### PHASE 5: Transaction Module ⭐ MOST CRITICAL

#### Step 9: Transaction Module - The Heart of the System
**Files to read (in order):**
1. `src/modules/transaction/transaction.validation.ts`
2. `src/modules/transaction/transaction.routes.ts`
3. `src/modules/transaction/transaction.controller.ts`
4. `src/modules/transaction/transaction.service.ts` - **STUDY THIS DEEPLY**

**What to understand in transaction.service.ts:**

**`deposit()` method:**
- Creates transaction record
- Creates ledger entry (CREDIT)
- Updates wallet balance
- All in a Prisma transaction (atomic)
- Idempotency check

**`withdraw()` method:**
- Validates sufficient balance
- Creates transaction record
- Creates ledger entry (DEBIT)
- Updates wallet balance
- All in a Prisma transaction

**`transfer()` method:**
- Validates both wallets exist
- Checks sender has sufficient balance
- Creates transaction record
- Creates TWO ledger entries (debit sender, credit receiver)
- Updates BOTH wallet balances
- Fraud detection check
- All in a Prisma transaction

**CRITICAL CONCEPTS:**
1. **Double-Entry Ledger:**
   - Every transaction creates ledger entries
   - Debit = money out, Credit = money in
   - balanceBefore and balanceAfter tracked
   - Complete audit trail

2. **Idempotency:**
   - Same idempotencyKey = same result
   - Prevents duplicate transactions
   - Cached in IdempotencyKey table

3. **Atomic Transactions:**
   - All database operations in `prisma.$transaction()`
   - If one fails, all rollback
   - Prevents partial updates

4. **Race Conditions:**
   - Redis locks prevent concurrent updates
   - Ensures balance consistency

**Documentation to read:**
- [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Double-Entry Bookkeeping](https://www.moderntreasury.com/journal/accounting-for-developers-part-i)
- [Idempotency](https://stripe.com/docs/api/idempotent_requests)

**Practice:**
```bash
# Via Swagger:
1. Deposit $1000 to wallet
2. Check balance (should be $1000)
3. Check ledger entries in Prisma Studio
4. Withdraw $200
5. Check balance (should be $800)
6. Create second user/wallet
7. Transfer $100 between wallets
8. Verify both balances updated
9. Check ledger entries (should see debit + credit)
10. Try same deposit with same idempotencyKey (should return cached)
```

---

### PHASE 6: Fraud Detection Module

#### Step 10: Fraud Module
**Files to read (in order):**
1. `src/modules/fraud/fraud.validation.ts`
2. `src/modules/fraud/fraud.routes.ts`
3. `src/modules/fraud/fraud.controller.ts`
4. `src/modules/fraud/fraud.service.ts` - Business logic
5. `src/modules/fraud/fraud.worker.ts` - Background processing

**What to understand in fraud.service.ts:**

**`checkTransaction()` method:**
- Runs multiple fraud checks in parallel
- Calculates total risk score
- Creates FraudFlag if suspicious

**Fraud detection rules:**
1. `checkHighAmount()` - Amount > threshold
2. `checkNewAccountActivity()` - New account + large amount
3. `checkVelocity()` - Too many transactions too fast

**`reviewFraudFlag()` method:**
- Admin approves or rejects
- Creates audit log

**Concepts:**
- Rule-based fraud detection
- Risk scoring (cumulative)
- Manual review workflow
- Audit logging

**Practice:**
```bash
# Via Swagger:
1. Deposit $15,000 (should flag - high amount)
2. Check FraudFlags table in Prisma Studio
3. Create new user, try large deposit (should flag - new account)
4. Send 12 transactions in 1 hour (should flag - velocity)
5. Login as admin, review fraud flags
```

---

### PHASE 7: Admin Module

#### Step 11: Admin Module
**Files to read (in order):**
1. `src/modules/admin/admin.validation.ts`
2. `src/modules/admin/admin.routes.ts`
3. `src/modules/admin/admin.controller.ts`
4. `src/modules/admin/admin.service.ts`

**What to understand:**
- User management (list, view details)
- Wallet controls (suspend, activate)
- Audit log viewing
- Platform statistics

**Concepts:**
- Role-based access control (ADMIN vs USER)
- Audit logging for compliance
- Admin actions are logged

**Practice:**
```bash
# Via Swagger:
1. Update a user to ADMIN role in Prisma Studio
2. Login as admin
3. List all users
4. Suspend a wallet
5. View audit logs
6. Get platform statistics
```

---

### PHASE 8: Advanced Topics

#### Step 12: Background Workers
**Files to read:**
1. `src/workers/notification.worker.ts` - Email notifications
2. `src/workers/transaction.worker.ts` - Async transaction processing

**Concepts to learn:**
- Job queues with BullMQ
- Producer/Consumer pattern
- Job retry logic
- Error handling in workers

**Documentation:**
- [BullMQ Guide](https://docs.bullmq.io/)

---

#### Step 13: Testing
**Files to explore:**
- `tests/` directory - Unit and integration tests

**Concepts:**
- Unit testing services
- Integration testing endpoints
- Mocking Prisma
- Test database setup

**Documentation:**
- [Jest](https://jestjs.io/docs/getting-started)
- [Supertest](https://www.npmjs.com/package/supertest)

---

## 🎯 Hands-On Projects

### Project 1: Trace a Complete Transaction
**Goal:** Follow a transfer from API call to database

**Steps:**
1. User A calls POST /api/transactions/transfer
2. Trace through:
   - Middleware (auth, validation, rate limit)
   - Controller (extract data)
   - Service (business logic)
   - Prisma transaction (database updates)
   - Response back to user

**Document:** Draw a flowchart of the entire process

---

### Project 2: Add a New Feature
**Feature:** Transaction Limits

**Requirements:**
- Users can set daily transaction limit
- System prevents transactions exceeding limit
- Limit resets daily

**Implementation:**
1. Add `dailyLimit` field to Wallet model
2. Update wallet.service.ts to set limit
3. Update transaction.service.ts to check limit
4. Add validation
5. Test via Swagger

**This forces you to:**
- Modify database schema
- Update services
- Add validation
- Test end-to-end

---

### Project 3: Debug Issues
**Practice debugging:**

**Issue 1:** User tries to withdraw more than balance
- Where does it fail?
- What error is thrown?
- How is it handled?

**Issue 2:** Duplicate transaction with same idempotencyKey
- What happens?
- Where is it caught?
- What response is returned?

**Issue 3:** Fraud flag created but not reviewed
- How to find it?
- How to review it?
- What happens after review?

---

## 📊 Knowledge Checkpoints

### Checkpoint 1: Foundation
Can you answer:
- [ ] What is the purpose of each database model?
- [ ] How does middleware execution order work?
- [ ] What is the difference between access and refresh tokens?
- [ ] How are passwords stored securely?

### Checkpoint 2: Core Features
Can you answer:
- [ ] How does a deposit update the wallet balance?
- [ ] What is double-entry bookkeeping and why is it used?
- [ ] How does idempotency prevent duplicate transactions?
- [ ] What happens if a transfer fails halfway?

### Checkpoint 3: Advanced
Can you answer:
- [ ] What are the three fraud detection rules?
- [ ] How does rate limiting work with Redis?
- [ ] What is the purpose of background workers?
- [ ] How are admin actions audited?

### Checkpoint 4: Mastery
Can you:
- [ ] Add a new endpoint independently?
- [ ] Explain the entire transaction flow?
- [ ] Debug issues without help?
- [ ] Modify the database schema safely?

---

## 🔍 Deep Dive Recommendations

### Most Important Files (Study These Deeply):
1. `prisma/schema.prisma` - Database structure
2. `src/modules/transaction/transaction.service.ts` - Core business logic
3. `src/modules/fraud/fraud.service.ts` - Fraud detection
4. `src/modules/auth/auth.service.ts` - Authentication
5. `src/middleware/auth.middleware.ts` - JWT verification

### Skim These (Understand Purpose):
- All validation files (just Zod schemas)
- All route files (just endpoint definitions)
- All controller files (just request/response handling)

### Focus on Concepts, Not Code:
- Double-entry bookkeeping
- Idempotency
- Atomic transactions
- JWT authentication flow
- Fraud detection algorithms

---

## 📚 Essential Documentation Links

**Must Read:**
1. [Prisma Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
2. [JWT Introduction](https://jwt.io/introduction)
3. [Double-Entry Bookkeeping for Developers](https://www.moderntreasury.com/journal/accounting-for-developers-part-i)
4. [Idempotency Guide](https://stripe.com/docs/api/idempotent_requests)
5. [Zod Documentation](https://zod.dev/)

**Good to Read:**
6. [BullMQ Guide](https://docs.bullmq.io/)
7. [Redis Tutorial](https://redis.io/docs/getting-started/)
8. [Express Rate Limiting](https://www.npmjs.com/package/express-rate-limit)
9. [bcrypt](https://www.npmjs.com/package/bcrypt)
10. [Winston Logger](https://www.npmjs.com/package/winston)

---

## 🎓 Final Goal

**You'll know you've mastered this codebase when you can:**

✅ Explain how money moves from one wallet to another  
✅ Add a new transaction type (e.g., "refund")  
✅ Modify fraud detection rules  
✅ Debug any issue in the transaction flow  
✅ Explain the system architecture to another developer  

**Take your time. Quality > Speed. Good luck! 🚀**
