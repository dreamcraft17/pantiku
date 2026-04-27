# Pantiku MVP Release Checklist & CEO Demo Script

Dokumen ini untuk memastikan demo berjalan mulus, pesan produk jelas, dan risiko tersampaikan transparan.

## 1) Pre-demo technical checklist

- [ ] Docker sudah running
- [ ] API health OK (`/health`)
- [ ] DB health OK (`/health/db`)
- [ ] Web build OK (`npm run build`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Status Demo Mode jelas (ON/OFF) sebelum demo dimulai
- [ ] Tidak ada fake data yang terlihat sebagai data production

## 2) Demo data checklist

- [ ] Minimal 1 akun pengelola panti berstatus verified (jika demo mode aktif)
- [ ] Minimal 1 campaign bertanda demo (jika demo mode aktif)
- [ ] Simulasi pembayaran berjalan sukses
- [ ] Angka impact berubah setelah donasi tersimulasi

## 3) CEO demo flow (5 minutes)

### 0:00 - 0:30 | Open homepage

- Buka homepage Pantiku.
- Tegaskan bahwa ini adalah platform pemberdayaan panti, bukan sekadar donasi satu arah.

### 0:30 - 1:00 | Explain Pantiku positioning

- Sampaikan positioning: "Anak bertumbuh, panti mandiri."
- Jelaskan 3 pilar: campaign produktif, marketplace karya panti, impact transparan.

### 1:00 - 1:30 | Show register roles

- Buka halaman registrasi.
- Tunjukkan role: Donatur, Pengelola Panti, Relawan.
- Jelaskan tiap role punya journey dan akses berbeda.

### 1:30 - 2:15 | Login as donor

- Login dengan akun donor.
- Tunjukkan landing state setelah login dan akses ke dashboard donor.

### 2:15 - 3:00 | Browse campaign

- Masuk ke daftar campaign.
- Buka salah satu detail campaign.
- Highlight cerita program, target, progress, dan konteks dampak.

### 3:00 - 3:40 | Simulate donation

- Pilih nominal donasi.
- Jalankan simulasi pembayaran (demo flow).
- Tunjukkan status berhasil dan alur pengguna tetap sederhana.

### 3:40 - 4:10 | Show impact update

- Buka halaman impact.
- Tunjukkan metrik yang ter-update setelah donasi.
- Tekankan transparansi sebagai trust engine.

### 4:10 - 4:45 | Login as orphanage manager

- Login sebagai pengelola panti.
- Masuk ke dashboard panti.
- Tunjukkan gating verifikasi (fitur sensitif terkunci sebelum verified).

### 4:45 - 5:00 | Explain next phase

- Tutup dengan rencana fase berikut:
  - verifikasi admin yang lebih matang,
  - payment provider real,
  - readiness untuk pilot produksi.

## 4) Risk notes

- Payment masih mock/simulasi (belum gateway real)
- Marketplace masih tahap awal
- Admin dashboard masih minimal
- Verifikasi panti real wajib sebelum launch publik

## 5) Next sprint recommendations

- Admin verification UI (workflow approval/reject yang jelas)
- Integrasi payment provider real
- Polish UI campaign creation
- Penyempurnaan flow panti profile completion
- Production deployment hardening dan observability

## 6) Key Messages (yang harus nyampe ke CEO)

Selama demo, pastikan 3 hal ini tersampaikan dengan jelas:

1. Pantiku bukan platform donasi biasa  
   Kita membangun sistem yang mengubah donasi jadi aktivitas produktif dan berkelanjutan.

2. Value utama ada di loop ekonomi  
   Donasi -> alat/skill -> produksi -> marketplace -> revenue -> mandiri.

3. Transparansi adalah trust engine  
   Setiap dukungan bisa dilihat dampaknya, bukan hanya transaksi.

Tujuan demo:

- Bukan menunjukkan semua fitur
- Memastikan CEO melihat arah besar produk dan potensi scaling

## 7) Demo tips

- Gunakan akun yang sudah disiapkan (hindari register live jika tidak perlu)
- Pastikan data demo sudah tersedia sebelum sesi dimulai
- Jangan terlalu lama di form/input
- Fokus ke value bisnis, bukan detail teknis
- Jika ada error kecil, lanjutkan flow dan jaga momentum demo
