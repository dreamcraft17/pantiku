# Pantiku MVP Database Design

## Main Entities

- `User`: account and role identity.
- `Orphanage`: organization profile and ownership by manager.
- `ChildProfile`: child data with anonymized public alias.
- `Campaign`: fundraising/productive initiative.
- `Donation`: campaign contribution record.
- `Product`: marketplace item from orphanage.
- `Order`: purchase transaction for products.

## Privacy Model

- `ChildProfile.fullName` is private and never exposed in public routes.
- Public routes serve `publicAlias` only.
- Campaign public views return anonymized orphanage and child references.

## Access Model

- Admin: unrestricted.
- Orphanage manager: only own orphanage-linked data.
- Donor: public read + self-owned donation/order creation.
- Volunteer: authenticated baseline role for future modules.
