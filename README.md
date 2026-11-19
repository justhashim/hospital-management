# Hospital Management API

A REST API for hospital patient records, with JWT auth and role-based access. Express, TypeScript, Prisma, PostgreSQL.

**Live:** https://hospital-management-a0nd.onrender.com

## What it does

- Register, login, refresh, logout and `GET /api/auth/me`.
- Patient records: create, list with pagination, search, read, update, soft delete.
- Admin-only permanent delete.
- Roles: `ADMIN`, `USER`, `DOCTOR`.

## How it works

Routes, controllers, services, Prisma. Zod validates request bodies.

- **Tokens.** A short-lived access token and a refresh token. Refresh tokens are stored in the database and rotated on every refresh: the old one is marked revoked and a new one is issued. Logout revokes the token. Inactive users can't log in or refresh.
- **Soft delete.** `DELETE /api/patients/:id` sets `isActive = false`. Only `DELETE /api/patients/:id/permanent` removes the row, and it requires `ADMIN`.
- **Audit fields.** Patients record `createdBy` and `updatedBy`.
- **Hardening.** Helmet and extra security headers, CORS from config, bcrypt with configurable rounds, and three rate limits: general, 10 login attempts per 15 minutes, 5 registrations per hour.

Endpoints:

| Method | Path | Access |
|---|---|---|
| POST | `/api/auth/register`, `/login`, `/refresh`, `/logout` | public |
| GET | `/api/auth/me` | authenticated |
| POST, GET | `/api/patients` | authenticated |
| GET | `/api/patients/search` | authenticated |
| GET, PUT, DELETE | `/api/patients/:id` | authenticated |
| DELETE | `/api/patients/:id/permanent` | admin |
| GET | `/`, `/health` | public |

`API_SPEC.md` has request and response examples, `ARCHITECTURE.md` goes deeper on structure.

## Stack

- Node.js, Express 5, TypeScript
- Prisma 5, PostgreSQL (Neon)
- jsonwebtoken, bcrypt, Zod, Helmet, express-rate-limit, Morgan
- pnpm

## Run it locally

```bash
pnpm install
cp .env.example .env     # fill in DATABASE_URL and the JWT secrets
pnpm prisma:migrate
pnpm dev
```

Env vars needed: `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`. Also in `.env.example`: `NODE_ENV`, `PORT`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `CORS_ORIGIN`, `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `BCRYPT_SALT_ROUNDS`.

For production: `pnpm build`, `pnpm prisma:migrate:prod`, `pnpm start`.

## Notes

Solo project, MIT licensed (see `LICENSE`). Known gaps: `register` accepts a `role` in the request body, so anyone can create an admin; any authenticated user can read and edit any patient; there are no tests; and `@supabase/supabase-js` is in `package.json` but unused. `/health` checks the database connection; when I last checked, it returned 503 on the deployment while `/` returned 200.
