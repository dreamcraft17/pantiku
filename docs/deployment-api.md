# Pantiku API Deployment (VPS/Server/Oracle)

Runtime target: Node.js 20.

## Requirements

- Node.js 20
- PostgreSQL (managed service or self-hosted Docker/Postgres server)
- Valid `DATABASE_URL`

## Required Environment Variables

- `NODE_ENV=production`
- `PORT=4000` (or platform-provided `PORT`)
- `DATABASE_URL=<your-postgresql-url>`
- `JWT_SECRET=<strong-secret>`
- `JWT_REFRESH_SECRET=<strong-refresh-secret>`
- `WEB_ORIGIN=<your-web-url>`
- `DEMO_MODE=false`

## Deploy Steps

```bash
cd services/api
npm install
npm run prisma:generate
npm run prisma:migrate deploy
npm run build
npm start
```

## Notes

- API listens on `PORT` (default `4000`).
- Payment simulation endpoints work only when `DEMO_MODE=true`.
- Seed demo data is optional and not required for production deployment.
