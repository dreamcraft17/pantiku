# Pantiku Deployment Guide

This guide covers deployment preparation for:

- Backend API (`services/api`)
- Public Web (`apps/web/pantiku-web`)
- Mobile app (`apps/mobile/pantiku_app`)

## 1) Backend (API)

### Environment setup

1. Copy `services/api/.env.example` to `services/api/.env`.
2. Set production values:
   - `NODE_ENV=production`
   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `WEB_ORIGIN`
   - `DEMO_MODE=false`
   - `JWT_ACCESS_EXPIRES_IN=15m`
   - `JWT_REFRESH_EXPIRES_IN=7d`
   - `LOG_LEVEL=info`

### Database migration & seed

Run inside `services/api`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate deploy
```

Demo seed data is optional and not required in production.

### Build and run

```bash
npm run build
npm run start
```

Health check:

- `GET /health`

## 2) Public Web (Next.js)

### Environment setup

1. Copy `apps/web/pantiku-web/.env.example` to `apps/web/pantiku-web/.env.local`.
2. Set:
   - `NEXT_PUBLIC_API_URL` to API base URL
   - `NEXT_PUBLIC_DEMO_MODE=false`

### Build and run

Run inside `apps/web/pantiku-web`:

```bash
npm install
npm run build
npm run start
```

## 3) Mobile (Flutter)

### API base URL switching

Mobile reads API URL from compile-time define:

- key: `API_BASE_URL`

Example:

```bash
flutter run --dart-define=API_BASE_URL=https://api.your-domain.com/api/v1
```

Production build examples:

```bash
flutter build apk --release --dart-define=API_BASE_URL=https://api.your-domain.com/api/v1
flutter build appbundle --release --dart-define=API_BASE_URL=https://api.your-domain.com/api/v1
flutter build ios --release --dart-define=API_BASE_URL=https://api.your-domain.com/api/v1
```

## 4) Recommended deployment order

1. Deploy database
2. Run API migrations
3. Run API seed
4. Deploy API
5. Deploy web
6. Build and release mobile with production API URL

## 5) Post-deploy checks

- API `/health` returns `200`
- Login/register works on web/mobile
- Campaigns, products, impact endpoints reachable
- Seeded admin account exists
