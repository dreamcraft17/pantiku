# Pantiku — Unified Startup Narrative

## 1. Executive Summary
Pantiku adalah platform digital yang membangun ekosistem pemberdayaan panti asuhan melalui dukungan produktif, pengembangan kapasitas, dan sirkulasi ekonomi berkelanjutan. Pantiku sudah berada pada tahap **early-stage MVP already built**, bukan sekadar rencana, dengan aplikasi web, mobile, dan backend yang sudah berjalan. Produk saat ini sudah mencakup autentikasi multi-role, dashboard berbasis peran, campaign, marketplace, dan impact dashboard dengan mode data yang jujur (real/demo). Di sisi teknologi, Pantiku memakai arsitektur modern berbasis Next.js, Express, Prisma, PostgreSQL, dan JWT sebagai sumber sesi tunggal. Login sosial Google sudah terintegrasi secara hybrid (Clerk di frontend, JWT internal di backend) agar alur akses tetap konsisten dengan kontrol role dari sistem Pantiku. Fondasi operasional juga sudah disiapkan melalui Docker, deployment docs, dan release checklist. Posisi Pantiku saat ini: produk nyata yang siap dipilotkan lebih luas dan di-scale secara bertahap.

## 2. Problem & Opportunity
Panti asuhan masih banyak bergantung pada donasi satu arah yang tidak konsisten, musiman, dan sering tidak selaras dengan kebutuhan nyata. Dampaknya, pengembangan keterampilan dan kesiapan masa depan anak berjalan tidak optimal, sementara panti kesulitan membangun model ekonomi yang berkelanjutan. Di saat yang sama, donor dan relawan membutuhkan jalur kontribusi yang lebih transparan, terukur, dan berdampak jangka panjang. Ini membuka peluang bagi platform yang tidak hanya menyalurkan bantuan, tetapi mengubah bantuan menjadi mesin pemberdayaan berulang.

## 3. Solution Overview
Pantiku membangun ekosistem tiga lapis: **care, skill, dan economy**.  
Pertama, care: dukungan terstruktur untuk memastikan intervensi sosial lebih tepat sasaran.  
Kedua, skill: penguatan kapasitas melalui program yang membuat anak dan panti lebih siap mandiri.  
Ketiga, economy: campaign produktif dan marketplace karya panti untuk menciptakan aliran nilai berkelanjutan.  
Dengan model ini, kontribusi tidak berhenti di donasi sesaat, tetapi berputar menjadi dampak sosial-ekonomi yang bisa dilacak.

## 4. Current Product Status
Pantiku sudah memiliki **MVP yang berjalan** dengan komponen inti berikut:
- Public web dengan landing, campaign, marketplace, impact, dan about page.
- Autentikasi email/password dan Google login hybrid, plus sesi JWT dengan refresh token.
- Registrasi multi-role (`DONOR`, `ORPHANAGE_MANAGER`, `VOLUNTEER`) dan dashboard role-specific.
- Campaign dan marketplace listing/detail dengan state loading/empty/error yang konsisten.
- Impact dashboard yang menampilkan mode data real/demo secara transparan.
- Fondasi operasional dan deployment (Docker local stack, deployment docs, release checklist).

## 5. How the System Works
Alur sederhana Pantiku:
1. Donor masuk ke platform dan memilih campaign produktif atau produk marketplace.
2. Panti menerima dukungan untuk aktivitas produktif dan penguatan kapasitas.
3. Aktivitas tersebut menghasilkan progres yang tercermin pada metrik dampak.
4. Produk karya panti dipasarkan melalui marketplace untuk menambah keberlanjutan pendapatan.
5. Siklus kontribusi berulang dan semakin efisien karena data dampak terlihat jelas.

## 6. Key Features (Implemented)
- Landing & public web (`Campaign`, `Marketplace`, `Lihat Dampak`, `Tentang Kami`) + SEO dasar.
- Authentication:
  - Email/password login.
  - Google login hybrid (Clerk UI + JWT backend Pantiku).
  - Registrasi multi-role.
  - Auto-link account berbasis email untuk login sosial.
  - Logout yang membersihkan sesi Pantiku + Clerk.
- Role-based dashboard dan redirect otomatis per role.
- Campaign & marketplace listing/detail.
- Impact dashboard dengan mode real/demo tanpa angka hardcoded misleading.
- Security & session: JWT access/refresh, silent refresh di client, RBAC backend + proteksi route frontend.
- Operasional MVP: Docker local stack, deployment guide, release checklist & demo script.

## 7. Technology Stack
- **Monorepo**: web, mobile, API, shared package.
- **Web**: Next.js App Router, TypeScript, React, Tailwind, shadcn/ui, Clerk (Google sign-in UI).
- **State/Data**: Zustand, TanStack Query, Axios.
- **Mobile**: Flutter + Dart (GoRouter, Dio, Riverpod).
- **Backend**: Node.js + Express + TypeScript.
- **Data layer**: Prisma + PostgreSQL.
- **Auth core**: JWT access/refresh sebagai single source of truth sesi.
- **Validation & security**: Zod, CORS, RBAC.
- **Quality & delivery**: Playwright, ESLint/TypeScript checks, Docker, Vercel (web), VPS/Server (API).

## 8. Authentication & User Flow
User login via email/password melalui `POST /api/v1/auth/login` dan menerima `accessToken`, `refreshToken`, serta profil user dalam format envelope `{ success, data }`. Frontend melakukan unwrap response, menyimpan token + user ke Zustand, lalu redirect ke dashboard berdasarkan role. Untuk login sosial, identitas Google diambil via Clerk pada frontend lalu ditukar ke backend agar backend tetap menerbitkan JWT internal Pantiku. Session dijaga dengan mekanisme refresh token dan logout mengembalikan user ke `/login` sambil membersihkan state auth.

## 9. Differentiation
Pantiku berbeda karena memadukan dukungan sosial dan mesin ekonomi produktif dalam satu produk yang sudah berjalan. Platform donasi konvensional umumnya berhenti pada transfer bantuan, sedangkan Pantiku melanjutkannya ke penguatan kapasitas dan monetisasi karya panti melalui marketplace. Posisi ini menciptakan loop dampak yang lebih berkelanjutan: kontribusi -> pemberdayaan -> hasil ekonomi -> dampak terukur. Dengan pendekatan ini, Pantiku menempatkan panti sebagai mitra pembangunan kapasitas, bukan penerima bantuan pasif.

## 10. Next Steps
- Jalankan pilot terstruktur dengan panti terverifikasi untuk mengunci metrik dampak dan retensi pengguna.
- Perkuat growth engine donor-relawan-panti lewat kemitraan komunitas dan institusi.
- Tingkatkan hardening production (security, observability, reliability) sambil menjaga kecepatan iterasi fitur.
- Scale bertahap dari pilot ke multi-kota dengan disiplin operasional dan data-driven prioritization.
- Bangun tim inti produk-teknologi (termasuk penguatan leadership CTO) untuk akselerasi fase scale.
