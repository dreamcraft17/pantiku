# Fitur Pantiku (MVP)

Dokumen ini merangkum fitur utama yang sudah tersedia di Pantiku MVP.

## 1) Landing & Public Web

- Landing page dengan positioning sosial berdampak (bukan charity pity-based).
- Halaman publik:
  - `Campaign`
  - `Marketplace`
  - `Lihat Dampak`
  - `Tentang Kami`
- SEO dasar: metadata, `robots.txt`, `sitemap.xml`.

## 2) Authentication & Account

- Login email/password (backend Pantiku).
- Login Google (hybrid):
  - UI OAuth via Clerk (frontend).
  - Backend tetap issue JWT Pantiku (`accessToken` + `refreshToken`).
- Registrasi multi-role:
  - `DONOR`
  - `ORPHANAGE_MANAGER`
  - `VOLUNTEER`
- Auto-link account berdasarkan email untuk login sosial.
- Logout membersihkan sesi Pantiku + sesi Clerk.

## 3) Role-Based Dashboard

- Redirect otomatis setelah login berdasarkan role:
  - Donor -> `/dashboard/donor`
  - Pengelola Panti -> `/dashboard/panti`
  - Relawan -> `/dashboard/relawan`
  - Admin -> `/dashboard/admin`
- Konten dashboard dibedakan per role.

## 4) Campaign & Marketplace

- Listing dan detail campaign.
- Listing dan detail produk karya panti.
- Status kosong/loading/error yang konsisten.

## 5) Dampak (Impact)

- Halaman impact dengan mode data jujur:
  - real mode
  - demo mode (dengan indikator/badge)
- Tidak lagi menampilkan angka hardcoded misleading.

## 6) Security & Session

- JWT access + refresh token.
- Silent refresh token flow di client (retry request setelah refresh).
- RBAC di backend + proteksi route di frontend.

## 7) Operasional MVP

- Docker Compose lokal untuk PostgreSQL + API.
- Deployment guide untuk web (Vercel) dan API (VPS/Server).
- Checklist rilis dan script demo CEO.
