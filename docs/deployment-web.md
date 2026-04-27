# Pantiku Web Deployment (Vercel)

Deploy target: `apps/web/pantiku-web`.

## Required Environment Variables

- `NEXT_PUBLIC_API_URL` = production API base URL (example: `https://api.pantiku.id`)
- `NEXT_PUBLIC_DEMO_MODE` = `false` for production

## Deploy Steps

1. In Vercel, import repository and set project root to `apps/web/pantiku-web`.
2. Configure environment variables for Production.
3. Trigger deploy.
4. Verify build output is successful.

## Local Build Validation

```bash
cd apps/web/pantiku-web
npm run build
```

## Post Deploy Check

- Web app loads and can reach API using configured `NEXT_PUBLIC_API_URL`.
