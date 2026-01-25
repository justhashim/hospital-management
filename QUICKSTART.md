# Quick Start Guide

This guide will help you get the Hospital Management API up and running in **5 minutes**.

## ⚡ Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) installed
- **pnpm** installed (`npm install -g pnpm`)
- A **NeonDB account** (free tier available at [neon.tech](https://neon.tech))

## 🚀 Quick Setup (5 Steps)

### Step 1: Get Your NeonDB Connection String

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Create a new project (or use existing)
3. Copy your connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

### Step 2: Configure Environment

Open the `.env` file and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://your-actual-connection-string-here"
```

**Optional:** Generate secure JWT secrets for production:
```bash
# Run these commands to generate secure secrets
openssl rand -base64 32  # Use for JWT_ACCESS_SECRET
openssl rand -base64 32  # Use for JWT_REFRESH_SECRET
```

### Step 3: Install Dependencies

```bash
pnpm install
```

### Step 4: Set Up Database

```bash
# Generate Prisma client
pnpm prisma:generate

# Create database tables
pnpm prisma:migrate

# (Optional) Seed with sample data
pnpm prisma:seed
```

### Step 5: Start the Server

```bash
pnpm dev
```

The API will be running at: **http://localhost:3000**

## ✅ Verify Installation

### Check Health Status
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Service is healthy",
  "timestamp": "2026-01-25T...",
  "uptime": 1.234,
  "database": "connected"
}
```

## 🧪 Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Copy the `accessToken` from the response and use it in the next request.

### 3. Create a Patient

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-15",
    "gender": "MALE",
    "address": "123 Main St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02101",
    "emergencyContactName": "Jane Doe",
    "emergencyContactPhone": "9876543210"
  }'
```

## 📊 Using Seed Data

If you ran `pnpm prisma:seed`, you can login with these accounts:

**Admin Account:**
- Email: `admin@hospital.com`
- Password: `AdminPass123!`

**Doctor Account:**
- Email: `doctor@hospital.com`
- Password: `DoctorPass123!`

**Regular User:**
- Email: `user@hospital.com`
- Password: `UserPass123!`

## 🔍 Explore Your Database

Open Prisma Studio to view and manage your data:

```bash
pnpm prisma:studio
```

This will open a web interface at `http://localhost:5555`

## 📚 Next Steps

1. **Read the API Documentation**: Check out [API_EXAMPLES.md](./API_EXAMPLES.md) for all available endpoints
2. **Customize**: Modify the schema in `prisma/schema.prisma` to fit your needs
3. **Add Features**: Extend the API with appointments, doctors, departments, etc.
4. **Deploy**: Follow the deployment section in [README.md](./README.md)

## 🐛 Troubleshooting

### "Cannot connect to database"
- Verify your `DATABASE_URL` in `.env` is correct
- Check your NeonDB project is active
- Ensure your IP is allowed in NeonDB settings

### "Prisma client not generated"
```bash
pnpm prisma:generate
```

### "Migration failed"
- Delete `prisma/migrations` folder
- Run `pnpm db:push` instead
- Then create a new migration: `pnpm prisma:migrate`

### "Port 3000 already in use"
Change the `PORT` in `.env` file:
```env
PORT=4000
```

## 💡 Development Tips

1. **Auto-reload**: The dev server automatically restarts on file changes
2. **Type Safety**: TypeScript will catch errors before runtime
3. **Database GUI**: Use `pnpm prisma:studio` to view/edit data
4. **Logs**: Check terminal output for request logs and errors

## 🎉 Success!

You now have a production-ready Hospital Management API running locally!

For complete documentation, see [README.md](./README.md)
