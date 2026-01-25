# Architecture & Design Decisions

This document explains the architecture, design patterns, and technology choices for the Hospital Management API.

## 🏗️ Architecture Overview

The application follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Client (HTTP Requests)          │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│         Routes Layer                     │
│  - Route definitions                     │
│  - Rate limiting                         │
│  - Route-level middleware                │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│      Middleware Layer                    │
│  - Authentication                        │
│  - Authorization (RBAC)                  │
│  - Validation                            │
│  - Security headers                      │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│      Controller Layer                    │
│  - Request/Response handling             │
│  - Input validation (Zod)                │
│  - HTTP status codes                     │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│       Service Layer                      │
│  - Business logic                        │
│  - Data validation                       │
│  - Transaction management                │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│       Data Access Layer (Prisma)         │
│  - Database queries                      │
│  - ORM operations                        │
└───────────────┬─────────────────────────┘
                │
┌───────────────▼─────────────────────────┐
│        Database (NeonDB)                 │
│  - PostgreSQL                            │
│  - Serverless architecture               │
└─────────────────────────────────────────┘
```

## 🎯 Design Patterns

### 1. **Layered Architecture**
- **Routes**: HTTP endpoint definitions
- **Controllers**: Request/response handling
- **Services**: Business logic
- **Data Access**: Database operations

**Benefits:**
- Clear separation of concerns
- Easy to test individual layers
- Maintainable and scalable

### 2. **Dependency Injection**
- Services are injected into controllers
- Configurations are centralized
- Makes unit testing easier

### 3. **Repository Pattern (via Prisma)**
- Prisma acts as a repository
- Abstracts database operations
- Provides type-safe queries

### 4. **Middleware Chain Pattern**
- Request flows through middleware pipeline
- Each middleware has single responsibility
- Order matters (security → auth → validation → route)

### 5. **Error Handling Pattern**
- Custom error classes for different error types
- Centralized error handler
- Consistent error responses

## 🛠️ Technology Decisions

### Why Prisma over node-postgres (pg)?

| Feature | Prisma | node-postgres (pg) |
|---------|--------|-------------------|
| **Type Safety** | ✅ Full TypeScript support | ❌ Manual type definitions |
| **Developer Experience** | ✅ Auto-completion, migrations | ❌ Manual SQL, no migrations |
| **SQL Injection** | ✅ Prevented by design | ⚠️ Requires manual parameterization |
| **Learning Curve** | ✅ Intuitive API | ⚠️ Requires SQL knowledge |
| **Migration Management** | ✅ Built-in | ❌ Requires external tools |
| **Serverless Support** | ✅ Optimized for NeonDB | ⚠️ Manual connection pooling |
| **Query Building** | ✅ Type-safe query builder | ❌ Manual SQL strings |
| **Performance** | ✅ Good | ✅ Slightly faster for raw queries |

**Decision: Prisma**
- Better developer experience
- Type safety prevents bugs
- Perfect for serverless NeonDB
- Faster development time
- Easier maintenance

### Why NeonDB?

1. **Serverless Architecture**: Pay only for what you use
2. **Auto-scaling**: Handles traffic spikes automatically
3. **PostgreSQL Compatible**: Full SQL features
4. **Connection Pooling**: Built-in for serverless
5. **Free Tier**: Generous for development
6. **Fast Cold Starts**: Optimized for serverless

### Why JWT over Sessions?

| Feature | JWT | Sessions |
|---------|-----|----------|
| **Stateless** | ✅ | ❌ Requires session store |
| **Scalability** | ✅ | ❌ Harder to scale |
| **Mobile Support** | ✅ | ⚠️ Requires cookies |
| **Microservices** | ✅ | ❌ Shared session store |
| **Token Revocation** | ⚠️ Needs refresh tokens | ✅ Easy |

**Decision: JWT with Refresh Tokens**
- Stateless authentication
- Better for mobile apps
- Scalable architecture
- Refresh token pattern solves revocation

### Why TypeScript?

1. **Type Safety**: Catch errors at compile-time
2. **Better IDE Support**: Auto-completion, refactoring
3. **Self-Documenting**: Types serve as documentation
4. **Easier Refactoring**: Compiler catches breaking changes
5. **Better for Teams**: Prevents common mistakes

## 🔒 Security Architecture

### Defense in Depth

The API implements multiple security layers:

```
1. Network Layer
   └── Rate Limiting (prevents DoS)

2. Transport Layer
   └── HTTPS (in production)

3. Application Layer
   ├── Helmet (secure headers)
   ├── CORS (origin validation)
   └── Input Sanitization

4. Authentication Layer
   ├── JWT verification
   ├── Token expiration
   └── Refresh token rotation

5. Authorization Layer
   └── Role-Based Access Control (RBAC)

6. Data Layer
   ├── Prisma (prevents SQL injection)
   ├── Zod validation
   └── Bcrypt password hashing

7. Database Layer
   └── PostgreSQL (ACID compliance)
```

### Security Features

1. **Password Security**
   - Bcrypt with 12 salt rounds
   - Passwords never logged or exposed
   - Strong password validation

2. **Token Security**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh
   - Token revocation support

3. **Input Validation**
   - Zod schemas for all inputs
   - Type-safe validation
   - Sanitization of user input

4. **Rate Limiting**
   - General: 100 req/15min
   - Auth: 10 req/15min
   - Register: 5 req/hour

5. **HTTP Security Headers**
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block
   - Referrer-Policy: strict-origin

## 📊 Database Design

### Schema Principles

1. **Normalization**: 3NF to reduce redundancy
2. **Relationships**: Proper foreign keys with cascades
3. **Indexes**: On frequently queried columns
4. **Soft Deletes**: `isActive` flag for data retention
5. **Audit Trail**: `createdBy`, `updatedBy`, timestamps

### Key Relationships

```
User (1) ──────── (∞) Patient
 │                     (createdBy)
 │
 └──── (∞) RefreshToken
```

### Indexing Strategy

- **Primary Keys**: All UUIDs indexed by default
- **Unique Constraints**: email fields
- **Foreign Keys**: Automatically indexed
- **Search Optimization**: lastName, phone indexed

## 🚀 Performance Considerations

### 1. **Connection Pooling**
- Prisma handles connection pooling
- Optimized for NeonDB serverless
- Singleton pattern prevents multiple clients

### 2. **Query Optimization**
- Select only needed fields
- Use indexes for filters
- Pagination for large datasets
- Eager loading for relations

### 3. **Caching Opportunities**
Future improvements:
- Redis for session caching
- Response caching for read-heavy endpoints
- Static data caching

### 4. **N+1 Query Prevention**
- Prisma's `include` for eager loading
- Avoid queries in loops

## 🧪 Testing Strategy

### Planned Test Layers

1. **Unit Tests**
   - Services (business logic)
   - Utilities (JWT, password)
   - Middleware

2. **Integration Tests**
   - API endpoints
   - Database operations
   - Authentication flow

3. **E2E Tests**
   - Complete user workflows
   - Multi-step processes

### Testing Tools (Not Implemented Yet)
- Jest for unit/integration tests
- Supertest for API testing
- @prisma/client for test database

## 📈 Scalability Considerations

### Horizontal Scaling
- Stateless design (JWT)
- No in-memory state
- Serverless-friendly

### Database Scaling
- NeonDB auto-scales
- Connection pooling
- Read replicas (future)

### API Scaling
- Containerization ready (Docker)
- Kubernetes compatible
- Load balancer friendly

## 🔄 Future Enhancements

### Planned Features

1. **Advanced Features**
   - Appointments management
   - Doctor scheduling
   - Medical records
   - Billing system
   - Notifications (email/SMS)

2. **Technical Improvements**
   - Redis caching
   - WebSocket for real-time updates
   - File upload (prescriptions, reports)
   - Audit logging
   - Advanced search (Elasticsearch)

3. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Monitoring (Prometheus/Grafana)
   - Log aggregation
   - Automated backups

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - Load testing (k6)
   - Security testing (OWASP ZAP)

## 📝 Code Organization Principles

### 1. **Single Responsibility**
Each file/function has one clear purpose

### 2. **DRY (Don't Repeat Yourself)**
Shared logic in utilities and services

### 3. **SOLID Principles**
- Single Responsibility
- Open/Closed
- Liskov Substitution
- Interface Segregation
- Dependency Inversion

### 4. **Clean Code**
- Meaningful names
- Small functions
- Clear comments
- Consistent formatting

## 🎓 Learning Resources

### Technologies Used
- **Express.js**: [expressjs.com](https://expressjs.com)
- **Prisma**: [prisma.io/docs](https://www.prisma.io/docs)
- **NeonDB**: [neon.tech/docs](https://neon.tech/docs)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Zod**: [zod.dev](https://zod.dev)
- **JWT**: [jwt.io](https://jwt.io)

### Best Practices
- **REST API Design**: [restfulapi.net](https://restfulapi.net)
- **Security**: [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- **Node.js Best Practices**: [goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)

---

**This architecture is designed to be:**
- ✅ Production-ready
- ✅ Secure by design
- ✅ Scalable and maintainable
- ✅ Developer-friendly
- ✅ Type-safe
