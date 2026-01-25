# Hospital Management API

A production-ready backend API built with **Node.js**, **Express.js**, **NeonDB (PostgreSQL)**, and **JWT authentication**. This API provides a robust foundation for hospital management systems with secure authentication, patient management, and role-based access control.

## 🚀 Features

- ✅ **JWT Authentication** - Access & refresh token implementation
- ✅ **Role-Based Access Control (RBAC)** - Admin, User, Doctor roles
- ✅ **NeonDB (PostgreSQL)** - Serverless PostgreSQL with Prisma ORM
- ✅ **Security** - Helmet, CORS, rate limiting, input sanitization
- ✅ **Input Validation** - Zod schemas for type-safe validation
- ✅ **Error Handling** - Centralized error handling with proper HTTP status codes
- ✅ **TypeScript** - Full type safety across the application
- ✅ **RESTful API** - Clean and consistent API design
- ✅ **Password Hashing** - Bcrypt with configurable salt rounds
- ✅ **Request Logging** - Morgan for HTTP request logging
- ✅ **Prisma ORM** - Type-safe database access with migrations

## 📋 Technology Choices

### Why Prisma over node-postgres (pg)?

I chose **Prisma** for this project for the following reasons:

1. **Type Safety** - Prisma generates TypeScript types from your schema, ensuring compile-time type safety
2. **Developer Experience** - Auto-completion, intuitive API, and excellent error messages
3. **Migration Management** - Built-in migration system for schema changes
4. **Serverless-Ready** - Optimized connection pooling for NeonDB's serverless architecture
5. **Query Builder** - Safer than raw SQL, preventing SQL injection by design
6. **Schema-First Approach** - Single source of truth for your database structure
7. **Production Features** - Connection pooling, query optimization, and relation handling

## 📁 Project Structure

```
hospital-management/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client configuration
│   │   └── index.ts           # Environment configuration
│   ├── controllers/
│   │   ├── auth.controller.ts # Authentication handlers
│   │   └── patient.controller.ts # Patient handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT verification & RBAC
│   │   ├── error.middleware.ts # Error handling
│   │   ├── validation.middleware.ts # Request validation
│   │   ├── security.middleware.ts # Security headers
│   │   └── rateLimiter.middleware.ts # Rate limiting
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   └── patient.routes.ts  # Patient endpoints
│   ├── services/
│   │   ├── auth.service.ts    # Auth business logic
│   │   └── patient.service.ts # Patient business logic
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── utils/
│   │   ├── errors.ts          # Custom error classes
│   │   ├── jwt.ts             # JWT utilities
│   │   ├── password.ts        # Password hashing
│   │   └── validation.ts      # Zod schemas
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** >= 18.x
- **pnpm** (or npm/yarn)
- **NeonDB account** - Sign up at [https://neon.tech](https://neon.tech)

### 1. Clone and Install

```bash
# Navigate to project directory
cd hospital-management

# Install dependencies
pnpm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000

# Get your NeonDB connection string from https://console.neon.tech
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/hospital_db?sslmode=require"

# Generate secure random strings for JWT secrets
JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations to create database tables
pnpm prisma:migrate

# (Optional) Open Prisma Studio to view your database
pnpm prisma:studio
```

### 4. Run the Application

**Development mode (with hot reload):**
```bash
pnpm dev
```

**Production build:**
```bash
pnpm build
pnpm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### 1. Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"  // Optional: ADMIN, USER, DOCTOR
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-01-25T10:00:00.000Z",
      "updatedAt": "2026-01-25T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

#### 3. Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### 4. Logout User
```http
POST /api/auth/logout
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 5. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Patient Management Endpoints

**Note:** All patient endpoints require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

#### 1. Create Patient
```http
POST /api/patients
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "phone": "1234567890",
  "dateOfBirth": "1990-05-15",
  "gender": "FEMALE",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "bloodGroup": "O_POSITIVE",
  "allergies": "Penicillin",
  "medicalHistory": "No major illnesses",
  "emergencyContactName": "John Smith",
  "emergencyContactPhone": "9876543210"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    // ... all patient fields
    "createdAt": "2026-01-25T10:00:00.000Z"
  }
}
```

#### 2. Get All Patients (with pagination)
```http
GET /api/patients?page=1&limit=10&search=jane&gender=FEMALE&bloodGroup=O_POSITIVE
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [ /* array of patients */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 3. Get Patient by ID
```http
GET /api/patients/:id
Authorization: Bearer <access_token>
```

#### 4. Update Patient
```http
PUT /api/patients/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phone": "9999999999",
  "address": "456 New Address"
}
```

#### 5. Delete Patient (Soft Delete)
```http
DELETE /api/patients/:id
Authorization: Bearer <access_token>
```

#### 6. Permanently Delete Patient (Admin Only)
```http
DELETE /api/patients/:id/permanent
Authorization: Bearer <access_token>
```

#### 7. Search Patients
```http
GET /api/patients/search?q=jane
Authorization: Bearer <access_token>
```

### Health Check Endpoints

#### Root
```http
GET /
```

#### Health Check
```http
GET /health
```

## 🔒 Security Features

1. **Helmet** - Secure HTTP headers
2. **CORS** - Configurable cross-origin resource sharing
3. **Rate Limiting** - Prevent brute force attacks
   - General: 100 requests per 15 minutes
   - Auth: 10 requests per 15 minutes
   - Register: 5 requests per hour
4. **Input Sanitization** - Prevent injection attacks
5. **Password Hashing** - Bcrypt with 12 salt rounds
6. **JWT Tokens** - Secure access and refresh tokens
7. **SQL Injection Prevention** - Prisma ORM parameterized queries
8. **Request Validation** - Zod schemas for all inputs

## 🗃️ Database Schema

### User Table
- id (UUID, Primary Key)
- email (Unique)
- password (Hashed)
- firstName, lastName
- role (ADMIN, USER, DOCTOR)
- isActive (Boolean)
- timestamps

### Patient Table
- id (UUID, Primary Key)
- firstName, lastName
- email (Unique, Optional)
- phone
- dateOfBirth
- gender (MALE, FEMALE, OTHER)
- address, city, state, zipCode
- bloodGroup (A+, A-, B+, B-, AB+, AB-, O+, O-)
- allergies, medicalHistory
- emergencyContactName, emergencyContactPhone
- isActive (Boolean)
- createdById, updatedById (Foreign Keys)
- timestamps

### RefreshToken Table
- id (UUID, Primary Key)
- token (Unique)
- userId (Foreign Key)
- expiresAt
- isRevoked (Boolean)
- createdAt

## 🚀 Deployment

### NeonDB Setup

1. Create a NeonDB account at [https://neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in your `.env` file

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="postgresql://..."  # NeonDB connection string
JWT_ACCESS_SECRET="<secure-random-string>"
JWT_REFRESH_SECRET="<secure-random-string>"
```

### Run Migrations in Production

```bash
pnpm prisma:migrate:prod
```

## 📝 Scripts

```bash
pnpm dev                  # Start development server with hot reload
pnpm build                # Build TypeScript to JavaScript
pnpm start                # Start production server
pnpm prisma:generate      # Generate Prisma client
pnpm prisma:migrate       # Run database migrations (dev)
pnpm prisma:migrate:prod  # Deploy migrations (production)
pnpm prisma:studio        # Open Prisma Studio (database GUI)
pnpm db:push              # Push schema changes without migration
pnpm db:reset             # Reset database and run migrations
pnpm type-check           # Check TypeScript types
```

## 🧪 Testing

Example using cURL:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'

# Get current user (replace TOKEN with your access token)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

Your Name

---

**Built with ❤️ using Node.js, Express, TypeScript, and NeonDB**
