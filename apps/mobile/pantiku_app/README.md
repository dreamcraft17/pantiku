# Pantiku Mobile App Foundation

## Run

1. Ensure Flutter SDK is installed.
2. Run:
   - `flutter pub get`
   - `flutter run`

## Current Foundation

- Clean architecture directory structure (`core`, `features`, `shared`)
- `go_router` navigation with 11 core MVP screens
- `flutter_riverpod` providers and repository wiring
- `dio` API client abstraction in `core/network`
- Token storage abstraction with `flutter_secure_storage`
- Mock-first repository implementations:
  - Auth
  - Campaigns
  - Marketplace Products
  - Impact

## Screen List

- Splash
- Login
- Register
- Home
- Campaign List
- Campaign Detail
- Donation
- Marketplace
- Product Detail
- Impact Summary
- Profile

## Integration Strategy

- UI consumes repositories, not raw response objects.
- Mock repositories can be swapped by API implementations without changing screens.
- `shared/providers.dart` is the composition root for dependency wiring.
