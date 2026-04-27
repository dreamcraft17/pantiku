# Pantiku Admin Web (Placeholder)

Admin web is intentionally deferred for MVP Phase 1.

## Current MVP Focus

- Backend API (`services/api`)
- Flutter mobile app (`apps/mobile/pantiku_app`)

## Why Deferred

To keep delivery fast and focused, Phase 1 prioritizes:

- Core data model and secure backend APIs
- Donor and orphanage-facing mobile journeys
- Validation of campaign, donation, marketplace, and impact flows

## Planned Admin Dashboard (Later Phase)

Admin web will be implemented after Phase 1 stabilization.

### Core Features

- Admin login
- Orphanage approval workflow
- Campaign moderation
- Product moderation
- Donation monitoring
- Impact report management
- User management

### Suggested Structure (Planned)

```txt
apps/admin-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   └── (dashboard)/
│   ├── modules/
│   │   ├── auth/
│   │   ├── orphanages/
│   │   ├── campaigns/
│   │   ├── products/
│   │   ├── donations/
│   │   ├── impact-reports/
│   │   └── users/
│   ├── components/
│   ├── services/
│   └── types/
└── README.md
```

### Planned Integration

- Consume existing Pantiku API modules:
  - `/auth`
  - `/users`
  - `/orphanages`
  - `/campaigns`
  - `/products`
  - `/donations`
  - `/impact`

## Status

- Phase: Planning placeholder only
- Implementation: Not started by design
