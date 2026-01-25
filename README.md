# Hospital Management API

A production-ready backend API built with **Node.js**, **Express.js**, **NeonDB (PostgreSQL)**, and **JWT authentication**. This API provides a robust foundation for hospital management systems with secure authentication, patient management, and role-based access control.

## 🔗 Live Deployment

**Live API URL:** `https://hospital-management-a0nd.onrender.com`

**API Status:** [Health Check](https://hospital-management-a0nd.onrender.com/health)

> **Note:** Replace the placeholder URLs above with your actual deployed API endpoint once deployed.

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

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.x
- **Language:** TypeScript 5.x
- **Database:** NeonDB (Serverless PostgreSQL)
- **ORM:** Prisma 7.x

### Libraries & Dependencies
- **Authentication:** jsonwebtoken (JWT), bcrypt (password hashing)
- **Validation:** Zod (schema validation)
- **Security:** Helmet (HTTP headers), cors, express-rate-limit
- **Logging:** Morgan
- **Development:** ts-node, nodemon

### Package Manager
- **pnpm** 10.27.0

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

### Base URLs
- **Local Development:** `http://localhost:3000/api`
- **Production:** `https://hospital-management-a0nd.onrender.com/api`

### Authentication Flow

All protected endpoints require a JWT access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Required Authentication:** None

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

**Field Validations:**
- `email`: Valid email format, required
- `password`: Min 8 characters, must contain uppercase, lowercase, number, and special character
- `firstName`: 1-50 characters, required
- `lastName`: 1-50 characters, required
- `role`: Optional. Values: `ADMIN`, `USER`, `DOCTOR`. Default: `USER`

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-01-25T10:00:00.000Z",
      "updatedAt": "2026-01-25T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDYxNzkyMDAsImV4cCI6MTcwNjE4MDEwMH0.xyz123",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpYXQiOjE3MDYxNzkyMDAsImV4cCI6MTcwNjc4NDAwMH0.abc456"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `409 Conflict`: Email already exists

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }'
```

---

#### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Required Authentication:** None

**Request Body:**
```json
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
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "USER",
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials format
- `401 Unauthorized`: Invalid email or password

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

---

#### 3. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh`

**Required Authentication:** None (requires valid refresh token)

**Request Body:**
```json
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
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

#### 4. Logout User

**Endpoint:** `POST /api/auth/logout`

**Required Authentication:** None (requires refresh token to revoke)

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

#### 5. Get Current User

**Endpoint:** `GET /api/auth/me`

**Required Authentication:** Yes (Bearer token)

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Patient Management Endpoints

**Note:** All patient endpoints require authentication. Include the access token in the Authorization header.

#### 1. Create Patient

**Endpoint:** `POST /api/patients`

**Required Authentication:** Yes (Bearer token)

**Required Roles:** Any authenticated user

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
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

**Field Validations:**
- `firstName`, `lastName`: Required, 1-100 characters
- `email`: Optional, valid email format
- `phone`: Required, 10-15 characters
- `dateOfBirth`: Required, ISO date format (YYYY-MM-DD)
- `gender`: Required. Values: `MALE`, `FEMALE`, `OTHER`
- `bloodGroup`: Optional. Values: `A_POSITIVE`, `A_NEGATIVE`, `B_POSITIVE`, `B_NEGATIVE`, `AB_POSITIVE`, `AB_NEGATIVE`, `O_POSITIVE`, `O_NEGATIVE`
- `emergencyContactName`, `emergencyContactPhone`: Required

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "gender": "FEMALE",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "bloodGroup": "O_POSITIVE",
    "allergies": "Penicillin",
    "medicalHistory": "No major illnesses",
    "emergencyContactName": "John Smith",
    "emergencyContactPhone": "9876543210",
    "isActive": true,
    "createdById": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Patient with email already exists

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
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
    "emergencyContactName": "John Smith",
    "emergencyContactPhone": "9876543210"
  }'
```

---

#### 2. Get All Patients (Paginated)

**Endpoint:** `GET /api/patients`

**Required Authentication:** Yes (Bearer token)

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `search` (optional): Search by name or email
- `gender` (optional): Filter by gender (`MALE`, `FEMALE`, `OTHER`)
- `bloodGroup` (optional): Filter by blood group

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "1234567890",
      "gender": "FEMALE",
      "bloodGroup": "O_POSITIVE",
      "city": "New York",
      "state": "NY",
      "createdAt": "2026-01-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**cURL Examples:**
```bash
# Basic - Get first page
curl -X GET "http://localhost:3000/api/patients" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With pagination
curl -X GET "http://localhost:3000/api/patients?page=2&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With filters
curl -X GET "http://localhost:3000/api/patients?gender=FEMALE&bloodGroup=O_POSITIVE" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# With search
curl -X GET "http://localhost:3000/api/patients?search=jane" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 3. Get Patient by ID

**Endpoint:** `GET /api/patients/:id`

**Required Authentication:** Yes (Bearer token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "phone": "1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "gender": "FEMALE",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "bloodGroup": "O_POSITIVE",
    "allergies": "Penicillin",
    "medicalHistory": "No major illnesses",
    "emergencyContactName": "John Smith",
    "emergencyContactPhone": "9876543210",
    "isActive": true,
    "createdAt": "2026-01-25T10:00:00.000Z",
    "updatedAt": "2026-01-25T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Patient not found

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/patients/650e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 4. Update Patient

**Endpoint:** `PUT /api/patients/:id`

**Required Authentication:** Yes (Bearer token)

**Request Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "phone": "9999999999",
  "address": "456 New Address",
  "allergies": "Penicillin, Latex"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "phone": "9999999999",
    "address": "456 New Address",
    "allergies": "Penicillin, Latex",
    "updatedAt": "2026-01-25T11:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/patients/650e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9999999999",
    "address": "456 New Address"
  }'
```

---

#### 5. Delete Patient (Soft Delete)

**Endpoint:** `DELETE /api/patients/:id`

**Required Authentication:** Yes (Bearer token)

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

**Note:** This is a soft delete. The patient record is marked as inactive but not removed from the database.

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/patients/650e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 6. Permanently Delete Patient

**Endpoint:** `DELETE /api/patients/:id/permanent`

**Required Authentication:** Yes (Bearer token)

**Required Roles:** `ADMIN` only

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient permanently deleted"
}
```

**Error Responses:**
- `403 Forbidden`: User does not have ADMIN role

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/patients/650e8400-e29b-41d4-a716-446655440001/permanent" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 7. Search Patients

**Endpoint:** `GET /api/patients/search`

**Required Authentication:** Yes (Bearer token)

**Query Parameters:**
- `q` (required): Search query

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "phone": "1234567890"
    }
  ]
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/patients/search?q=jane" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### Health Check Endpoints

#### Root Endpoint

**Endpoint:** `GET /`

**Required Authentication:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Hospital Management API is running",
  "version": "1.0.0",
  "timestamp": "2026-01-25T10:00:00.000Z"
}
```

#### Health Check

**Endpoint:** `GET /health`

**Required Authentication:** None

**Response (200 OK):**
```json
{
  "success": true,
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-25T10:00:00.000Z"
}
```

---

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

**Common Error Codes:**
- `400 Bad Request`: Validation error or invalid input
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User lacks required permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## 🧪 Test Data & Example Credentials

### Pre-seeded Test Accounts

Use these credentials to test the API functionality:

#### Admin Account
```json
{
  "email": "admin@hospital.com",
  "password": "AdminPass123!",
  "role": "ADMIN"
}
```

#### Doctor Account
```json
{
  "email": "doctor@hospital.com",
  "password": "DoctorPass123!",
  "role": "DOCTOR"
}
```

#### Regular User Account
```json
{
  "email": "user@hospital.com",
  "password": "UserPass123!",
  "role": "USER"
}
```

### Sample Patient Data

Use these sample payloads to create test patients:

#### Patient 1
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@patient.com",
  "phone": "1234567890",
  "dateOfBirth": "1985-03-15",
  "gender": "MALE",
  "address": "123 Medical Drive",
  "city": "Boston",
  "state": "MA",
  "zipCode": "02101",
  "bloodGroup": "A_POSITIVE",
  "allergies": "None",
  "medicalHistory": "Healthy patient with no prior conditions",
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "9876543210"
}
```

#### Patient 2
```json
{
  "firstName": "Emily",
  "lastName": "Smith",
  "email": "emily.smith@patient.com",
  "phone": "5551234567",
  "dateOfBirth": "1992-07-20",
  "gender": "FEMALE",
  "address": "789 Health Ave",
  "city": "Chicago",
  "state": "IL",
  "zipCode": "60601",
  "bloodGroup": "B_POSITIVE",
  "allergies": "Penicillin",
  "medicalHistory": "Mild asthma",
  "emergencyContactName": "Michael Smith",
  "emergencyContactPhone": "5559876543"
}
```

#### Patient 3
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@patient.com",
  "phone": "5559998888",
  "dateOfBirth": "1988-11-05",
  "gender": "FEMALE",
  "address": "456 Wellness Blvd",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001",
  "bloodGroup": "O_NEGATIVE",
  "allergies": "Latex, Sulfa drugs",
  "medicalHistory": "Type 2 diabetes",
  "emergencyContactName": "Robert Johnson",
  "emergencyContactPhone": "5557776666"
}
```

### Complete Workflow Test Script

Run this complete workflow to test all API functionality:

```bash
#!/bin/bash

# Set base URL
API_URL="http://localhost:3000/api"

echo "=== Testing Hospital Management API ==="
echo ""

# 1. Register a new user
echo "1. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST $API_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@hospital.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "DOCTOR"
  }')

ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "✓ User registered. Access token obtained."
echo ""

# 2. Login with test account
echo "2. Logging in with admin account..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "AdminPass123!"
  }')

ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
echo "✓ Admin logged in successfully."
echo ""

# 3. Create patient
echo "3. Creating a patient..."
PATIENT_RESPONSE=$(curl -s -X POST $API_URL/patients \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@test.com",
    "phone": "1234567890",
    "dateOfBirth": "1985-03-15",
    "gender": "MALE",
    "address": "123 Test St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "bloodGroup": "A_POSITIVE",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "9876543210"
  }')

PATIENT_ID=$(echo $PATIENT_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✓ Patient created with ID: $PATIENT_ID"
echo ""

# 4. Get all patients
echo "4. Getting all patients..."
curl -s -X GET "$API_URL/patients?page=1&limit=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# 5. Get patient by ID
echo "5. Getting patient by ID..."
curl -s -X GET "$API_URL/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""

# 6. Update patient
echo "6. Updating patient..."
curl -s -X PUT "$API_URL/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"phone": "9999999999"}' | jq '.'
echo ""

echo "=== All tests completed successfully! ==="
```

### Password Requirements

All passwords must meet these criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

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

### Deployment Platform Options

This application can be deployed on various platforms:

#### Recommended: Vercel (Serverless)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Set environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically on push

#### Render
1. Create new Web Service
2. Connect repository
3. Set build command: `pnpm build`
4. Set start command: `pnpm start`

#### DigitalOcean App Platform
1. Create new app from GitHub
2. Configure environment variables
3. Deploy

### Environment Variables for Production

Ensure these are set in your deployment platform:

```env
NODE_ENV=production
PORT=3000

# NeonDB Connection String
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/hospital_db?sslmode=require"

# JWT Secrets (Generate secure random strings)
JWT_ACCESS_SECRET="your-production-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-production-refresh-secret-min-32-chars"
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security Settings
CORS_ORIGIN="https://your-frontend-domain.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### Database Migration in Production

After deploying, run database migrations:

```bash
# Using Prisma CLI
pnpm prisma:migrate:prod

# Or using npx
npx prisma migrate deploy
```

### NeonDB Setup for Production

1. **Create NeonDB Project:**
   - Go to [https://neon.tech](https://neon.tech)
   - Create a new project
   - Select region closest to your deployment

2. **Get Connection String:**
   - Navigate to project dashboard
   - Copy the connection string
   - Add to `DATABASE_URL` in production environment variables

3. **Configure Connection Pooling:**
   - NeonDB automatically handles connection pooling
   - Prisma is optimized for serverless/NeonDB

### Post-Deployment Checklist

- [ ] Verify health check endpoint: `GET /health`
- [ ] Test user registration and login
- [ ] Confirm JWT tokens are working
- [ ] Test patient CRUD operations
- [ ] Verify CORS settings with frontend
- [ ] Check rate limiting is active
- [ ] Monitor error logs
- [ ] Set up database backups (NeonDB automatic)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring/alerting

### Deployment Verification

Test your deployed API:

```bash
# Health check
curl https://hospital-management-a0nd.onrender.com/health

# Register test user
curl -X POST https://hospital-management-a0nd.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
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

## 👤 Author

Hashim Mohamed T A

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ℹ️ License and copyright notice required

## 🤖 AI Disclosure

This project was developed with the assistance of AI tools:

- **GitHub Copilot**: Used for code completion, suggestions, and boilerplate generation
- **ChatGPT/Claude**: Used for:
  - Architecture planning and design decisions
  - Documentation writing and README formatting
  - Debugging assistance and error resolution
  - Best practices recommendations
  - Code review and optimization suggestions

**Development Approach:**
- AI tools were used to accelerate development and ensure best practices
- All code was reviewed, tested, and understood before implementation
- Core architecture and design decisions were made by the developer
- AI assistance enhanced productivity while maintaining code quality and learning

**Percentage of AI Assistance:** Approximately 40-50% of code generation and 60-70% of documentation

---

**Built with ❤️ using Node.js, Express, TypeScript, and NeonDB**
