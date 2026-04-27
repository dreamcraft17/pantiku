# Pantiku API Service

## Setup

1. Copy `.env.example` to `.env`.
2. Install deps: `npm install`
3. Generate Prisma client: `npm run prisma:generate`
4. Run migration: `npm run prisma:migrate`
5. Seed data: `npm run prisma:seed`
6. Start dev server: `npm run dev`

## Architecture

- Modular route-based structure under `src/modules`
- JWT auth + RBAC middleware
- Zod DTO validation
- Prisma ORM for PostgreSQL
- Payment and storage abstractions for future provider integration

## Privacy Controls

- Public campaign/product/orphanage endpoints return sanitized information.
- Child full names are never exposed in public payloads.
- Manager-only mutation endpoints enforce orphanage ownership checks.
