# Pantiku User Seeding (Development/Testing)

Dokumen ini menjelaskan akun seed untuk pengujian role-based flow Pantiku pada environment development/testing.

## Tujuan

- Menyediakan akun siap pakai untuk semua role:
  - `DONOR`
  - `ORPHANAGE_MANAGER`
  - `VOLUNTEER`
  - `ADMIN`
- Menjalankan seed secara idempotent (aman dijalankan berulang)
- Memudahkan QA/UAT sebelum launch

## Lokasi Script Seed

- File seed: `services/api/prisma/seed.ts`
- Prisma seed command di `services/api/package.json`:
  - `"prisma": { "seed": "tsx prisma/seed.ts" }`

## Kredensial Akun Seed

Semua akun menggunakan password yang sama:

- Password: `password123`

Daftar akun:

- `donor@test.com` → role `DONOR`
- `panti@test.com` → role `ORPHANAGE_MANAGER`
- `volunteer@test.com` → role `VOLUNTEER`
- `admin@test.com` → role `ADMIN`

## Data Tambahan yang Di-seed

Jika model orphanage tersedia, seed juga membuat/memperbarui profil panti untuk akun manager:

- Manager: `panti@test.com`
- Orphanage alias: `Panti Test`
- Verification status: `VERIFIED`

Ini memungkinkan flow campaign/product creation yang membutuhkan status verifikasi panti.

## Cara Menjalankan Seed

Jalankan dari folder backend API:

```bash
cd services/api
npx prisma db seed
```

Alternatif lewat script:

```bash
cd services/api
npm run prisma:seed
```

## Catatan Perilaku Seed

- Script **tidak melakukan delete massal** data.
- User di-upsert berdasarkan email (tidak duplicate insert).
- Password selalu di-hash dengan `bcryptjs`.
- Aman dijalankan berulang kali untuk refresh akun QA.

## Skenario Testing per Role

### 1) DONOR (`donor@test.com`)

- Login
- Buka dashboard donor
- Jelajahi campaign
- Dukung campaign
- Cek riwayat kontribusi di profile/dashboard

### 2) ORPHANAGE_MANAGER (`panti@test.com`)

- Login
- Cek status verifikasi panti (harus `VERIFIED`)
- Buat campaign dari dashboard panti
- Buat produk dari dashboard panti
- Bagikan impact update

### 3) VOLUNTEER (`volunteer@test.com`)

- Login
- Cek dashboard relawan
- Jelajahi opportunity/program relawan

### 4) ADMIN (`admin@test.com`)

- Login
- Buka admin dashboard
- Review moderation queue:
  - orphanage verification
  - campaign moderation
  - product moderation
  - impact update review

## Keamanan

- Akun dan password ini hanya untuk development/testing.
- Jangan gunakan kredensial seed ini untuk production.
