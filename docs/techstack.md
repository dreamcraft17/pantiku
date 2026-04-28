# Tech Stack Pantiku (MVP)

Dokumen ini merangkum teknologi utama yang dipakai dalam MVP Pantiku.

## Arsitektur Repositori

- Monorepo:
  - `apps/web/pantiku-web` (public web)
  - `apps/mobile/pantiku_app` (mobile app Flutter)
  - `apps/admin-web` (placeholder admin web)
  - `services/api` (backend API)
  - `packages/shared` (shared types/constants)

## Frontend Web

- Framework: `Next.js` (App Router)
- Language: `TypeScript`
- UI: `React`, `Tailwind CSS`, `shadcn/ui`
- OAuth UI: `Clerk` (`@clerk/nextjs`) untuk Google Sign-In di frontend
- State & data:
  - `Zustand` (auth/global state)
  - `TanStack Query` (server state/query caching)
  - `Axios` (HTTP client)
- SEO/metadata: Next metadata API, sitemap, robots

## Mobile App

- Framework: `Flutter`
- Language: `Dart`
- Routing: `GoRouter`
- Networking: `Dio`
- State management: `Riverpod`
- Arsitektur: clean architecture + repository pattern (mock-first lalu API integration)

## Backend API

- Runtime: `Node.js`
- Framework: `Express.js`
- Language: `TypeScript`
- ORM: `Prisma`
- Database: `PostgreSQL`
- Auth:
  - `JWT` (access + refresh token)
  - hybrid auth bridge: Google identity dari Clerk/GIS tetap ditukar menjadi JWT internal Pantiku
  - `bcrypt` (password hashing)
- Validation: `Zod`
- Security & middleware: `cors`, role-based authorization (RBAC)

## Database

- Engine: `PostgreSQL`
- ORM/Schema: `Prisma schema`
- Migration: Prisma migrations
- Seed: Prisma seed script (data awal untuk demo/dev)

## Testing & Quality

- E2E web test: `Playwright`
- Linting/typing:
  - `ESLint`
  - `TypeScript` type checking

## DevOps & Deployment

- Container local dev: `Docker`, `Docker Compose`
- Web deployment: `Vercel`
- API deployment: VPS/Server berbasis Node.js + PostgreSQL
- Environment management:
  - Web: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_DEMO_MODE`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - API: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `WEB_ORIGIN`, `GOOGLE_CLIENT_ID` (opsional), dll

## Prinsip Implementasi MVP

- API response envelope konsisten: `{ success, data }`
- Backend tetap jadi single source of truth untuk sesi auth (JWT), termasuk user role dan redirect logic.
- Role-based experience untuk:
  - Donor
  - Pengelola Panti
  - Relawan
  - Admin
- Demo mode tersedia untuk kebutuhan presentasi, namun data real tetap diprioritaskan saat production.
