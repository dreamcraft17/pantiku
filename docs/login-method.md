# Login Method (Pantiku MVP)

Dokumen ini menjelaskan alur login saat ini untuk Pantiku Web (Next.js) yang terhubung ke API Pantiku (Express + JWT).

## Tujuan

- Menyediakan login yang aman dan sederhana untuk MVP.
- Menangani multi-role user (`DONOR`, `ORPHANAGE_MANAGER`, `VOLUNTEER`, `ADMIN`).
- Mengarahkan user ke dashboard sesuai role setelah login berhasil.

## Endpoint API

- Method: `POST`
- URL: `/api/v1/auth/login`
- Content-Type: `application/json`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password-user"
}
```

### Response Sukses (dibungkus ApiEnvelope)

```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt-access-token>",
    "refreshToken": "<jwt-refresh-token>",
    "user": {
      "id": "uuid",
      "name": "Nama User",
      "email": "user@example.com",
      "role": "DONOR",
      "orphanageVerificationStatus": "PENDING"
    }
  }
}
```

## Alur Login di Web

1. User isi form login (`email`, `password`) pada halaman `/login`.
2. Frontend kirim `POST /api/v1/auth/login`.
3. API mengembalikan data dengan envelope `{ success, data }`.
4. Client unwrapping envelope lalu menyimpan:
   - `accessToken`
   - `refreshToken`
   - data `user` (termasuk `role`)
5. State auth diupdate (`token`, `role`, `user`).
6. User diarahkan ke dashboard sesuai role:
   - `DONOR` -> `/dashboard/donor`
   - `ORPHANAGE_MANAGER` -> `/dashboard/panti`
   - `VOLUNTEER` -> `/dashboard/relawan`
   - `ADMIN` -> `/dashboard/admin`

## Session dan Auth State

- Navbar memakai status auth untuk menampilkan menu:
  - Logged out: `Masuk`, `Gabung Sekarang`
  - Logged in: `Profile`, `Dashboard`, `Keluar`
- Halaman protected membaca auth state untuk validasi akses.
- Logout akan clear auth state lalu redirect ke `/login`.

## Error Handling (MVP)

- Kredensial salah: tampilkan pesan login gagal (401/invalid credentials).
- API tidak tersedia: tampilkan fallback error yang ramah user.
- Token invalid/expired: trigger logout atau flow refresh token.

## Catatan Implementasi

- Pastikan client selalu unwrap response envelope API sebelum dipakai.
- Jangan hardcode redirect dashboard; gunakan helper mapping berdasarkan role.
- Untuk production, pastikan env `NEXT_PUBLIC_API_URL` mengarah ke API aktif.

## Quick Test Checklist

- Login dengan akun donor berhasil dan masuk ke `/dashboard/donor`.
- Login manager panti berhasil dan masuk ke `/dashboard/panti`.
- Login relawan berhasil dan masuk ke `/dashboard/relawan`.
- Login admin berhasil dan masuk ke `/dashboard/admin`.
- Tombol `Keluar` membersihkan sesi dan kembali ke `/login`.
