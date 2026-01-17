# Learning Guide for Fintech Wallet API

A practical guide to understanding this codebase.

---

## What is this?

A **digital wallet API** - the backend for apps like PayPal, Cash App, or banking apps.

**Features:**
- 👤 User registration & login
- 💰 Wallet management
- 💸 Money transfers
- 🔒 Fraud detection
- 💳 Paystack payments
- 👑 Admin dashboard

> For system architecture diagrams, see [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md)

---

## Folder Structure

```
src/
├── config/           # database, redis, env config
├── middleware/       # auth, validation, rate limiting
├── modules/          # main features (auth, wallet, transaction, etc)
├── utils/            # helpers, errors, jwt, email
├── workers/          # background job processors
├── queues/           # job queues
├── types/            # typescript types
├── app.ts            # express setup
└── server.ts         # entry point
```

---

## How a Request Works

```
POST /api/auth/login
         │
         ▼
    [Middleware]
    Rate limit → Parse body → Validate data
         │
         ▼
    [auth.routes.ts]
    Matches /login endpoint
         │
         ▼
    [auth.controller.ts]
    Gets email/password from req.body
         │
         ▼
    [auth.service.ts]
    Checks password, creates tokens
         │
         ▼
    Response: { user, accessToken, refreshToken }
```

---

## Key Concepts

### Controllers vs Services

| Controllers | Services |
|-------------|----------|
| Handle HTTP | Handle logic |
| req/res | Database ops |
| Thin | Fat |

### Middleware

Functions that run before your route:

```typescript
router.post('/transfer',
  authenticate,   // check jwt
  validate,       // check body
  controller
);
```

### JWT Auth

```
1. User logs in → gets token
2. User sends token with requests
3. Server verifies token
```

---

## Database Patterns

```typescript
// find one
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});

// find many
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' }
});

// create
const wallet = await prisma.wallet.create({
  data: { userId, currency: 'NGN' }
});

// update
await prisma.user.update({
  where: { id: userId },
  data: { lastLoginAt: new Date() }
});
```

---

## Error Handling

```typescript
// custom errors auto-set status codes
throw new NotFoundError('User not found');     // 404
throw new UnauthorizedError('Invalid token');  // 401
throw new BadRequestError('Invalid amount');   // 400
```

---

## Testing the API

### Swagger (easiest)
Open http://localhost:3000/api-docs

### Postman

**Register:**
```
POST http://localhost:3000/api/auth/register
{
  "email": "test@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Login:**
```
POST http://localhost:3000/api/auth/login
{
  "email": "test@example.com",
  "password": "Password123"
}
```

**Use token:**
```
Authorization: Bearer <your-access-token>
```

---

## Learning Path

1. **Start:** `server.ts` → `app.ts`
2. **Auth:** `auth.routes.ts` → `auth.controller.ts` → `auth.service.ts`
3. **Middleware:** `auth.middleware.ts`
4. **Features:** `wallet.service.ts`, `transaction.service.ts`
5. **Advanced:** `payment.service.ts`, `fraud.service.ts`

---

## Common Questions

**Why TypeScript?**
Type safety, autocomplete, catch bugs early.

**Why Prisma?**
Clean queries, type safety, auto migrations.

**Why Redis?**
Fast caching, rate limiting, job queues, wallet locks.

**Why separate services?**
Reusable logic - controllers, workers, and tests can all use them.

---

## Related Docs

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Diagrams & data flows
- [README](./README.md) - Setup instructions
- [API Docs](http://localhost:3000/api-docs) - Swagger UI

Happy coding! 🚀
