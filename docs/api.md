# Pantiku MVP API Overview

Base URL: `/api/v1`

## Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

## Public Discovery

- `GET /orphanages/public`
- `GET /campaigns/public`
- `GET /products/public`
- `GET /impact/public`

## Manager Workflows

- `POST /orphanages`
- `POST /children`
- `POST /campaigns`
- `POST /products`

## Donor Workflows

- `POST /donations`
- `POST /orders`

## Admin

- `GET /impact/admin`
- `GET /users`
