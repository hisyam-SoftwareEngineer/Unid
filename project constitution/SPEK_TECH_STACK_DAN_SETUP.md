# SPESIFIKASI TECH STACK DAN SETUP PROYEK (Demo Pack v1.1, pelengkap sebelum D-01)

Status: draft, menunggu review manusia · Prinsip: **paling sederhana yang benar**, tanpa Docker wajib, satu cara untuk tiap hal.
Label: [TERVERIFIKASI 4 Nov 2026] (dicek ke dokumentasi, sebutkan sumber) · [BELUM TERVERIFIKASI] (cek manusia/AI dari dokumentasi resmi sebelum dipakai).

---

## 1. Koreksi atas dokumen sebelumnya

| Asumsi lama | Temuan | Dampak |
|---|---|---|
| Vercel Hobby "batas durasi ±5 detik" (rekomendasi_arsitektur) | Dokumentasi Hobby: durasi maksimum fungsi **300 detik** [TERVERIFIKASI, halaman diperbarui 14 Sep 2026] | Risiko durasi turun. Risiko **latensi lintas-region** tetap (lihat 4.3) |
| Hobby aman untuk demo | Hobby **khusus non-komersial/pribadi** [TERVERIFIKASI] | Demo ke calon pelanggan boleh sebagai prototipe; operasi komersial nyata (pilot) wajib Pro atau hosting lain |
| Supabase gratis = selalu aktif | Free: **2 project aktif**, di-**pause setelah 1 minggu tanpa aktivitas**, 500 MB DB, 1 GB storage, upload maks 50 MB, **tanpa backup** [TERVERIFIKASI] | Jangan bergantung pada project demo yang lama tidak disentuh; seed harus dapat diulang |
| Posisi "middleware" Next.js belum jelas | Next.js 16: `middleware.ts` → **`proxy.ts`** (ekspor bernama `proxy`), berjalan di runtime Node.js [TERVERIFIKASI sekunder; konfirmasi di nextjs.org] | Penerbitan cookie `sid` ditaruh di `proxy.ts` |
| Supabase lokal selalu perlu Docker | Ada runtime native tanpa Docker, tetapi **Public Alpha**, hanya Linux dan macOS Apple silicon (tidak Windows/Intel Mac) [TERVERIFIKASI] | Bukan jalur utama (lihat 3) |

## 2. Keputusan stack (satu pilihan per hal)

| Area | Keputusan | Alasan singkat |
|---|---|---|
| Runtime | Node.js **22 (≥ 22.12)**; naik ke 24 setelah dikonfirmasi didukung Vercel/Prisma | Prisma 7 mensyaratkan Node ^20.19, ^22.12, atau ^24, TS ≥ 5.4 [TERVERIFIKASI]; irisan paling aman |
| Paket manajer | **pnpm** via corepack, `packageManager` dipin | Sudah di D-01; deterministik |
| Framework | **Next.js 16.x**, App Router, TypeScript strict | 16.2 rilis Apr 2026 [TERVERIFIKASI]; pin versi persis saat setup |
| ORM | **Prisma** (versi mayor dipilih AI dari dokumentasi resmi; lihat 6.1) | Sudah di skema |
| Backend-as-service | Supabase: **Auth, Realtime, Storage** saja (DB dipakai lewat Prisma) | Sesuai ADR-0005 |
| Validasi | **Zod** (satu paket kontrak dipakai server dan klien) | Sudah di kontrak |
| Data klien dan polling | **TanStack Query** (refetch interval, refetch saat fokus/online, backoff) | Hook `useOrderStatus` dan polling staf tanpa kode buatan sendiri |
| Form | **react-hook-form** + resolver Zod | Memakai ulang kontrak Zod |
| UI | **Tailwind + shadcn/ui + lucide-react** | Sudah di D-01 |
| Kompresi gambar bukti | **Canvas bawaan peramban** (tanpa pustaka) | Nol dependensi; target sisi 1600 px, kualitas 0,8 |
| Format uang/tanggal | `Intl.NumberFormat('id-ID')` dan `Intl.DateTimeFormat`; **tanpa pustaka tanggal** | Hari bisnis dihitung di DB (J-09) |
| QR meja | Skrip sekali jalan dengan paket `qrcode` (cetak dari seed) | Tidak ada UI admin di demo |
| Keranjang | `useReducer` + pembungkus penyimpanan lokal aman (try/catch) | Tanpa pustaka state global |
| Logging | Pencatat JSON kecil (`requestId`, level, kode error) ke `console` | Cukup untuk Vercel; tanpa layanan pemantau di demo |
| Test | **Vitest** (unit+integrasi), **Playwright** (E2E = skrip demo), Testing Library secukupnya | |
| Rate limit | Tabel Postgres (sudah diputuskan) | |
Aturan: **tidak ada dependensi baru tanpa persetujuan manusia** (AGENTS.md). Versi inti (next, react, prisma, @supabase/*, zod, tanstack-query) dipin **persis** (tanpa `^`); lockfile di-commit; kenaikan versi hanya lewat PR otomatis yang direview.

## 3. Pengganti Docker (laptop terbatas ruang)

**Jalur utama (disarankan): PostgreSQL native + database terhosting, tanpa Docker.**

| Kebutuhan uji | Di mana dijalankan | Alasan |
|---|---|---|
| Unit test | Lokal (tanpa DB) | Murni kode |
| Integrasi, konkurensi, RLS/GRANT, trigger, penjaga migrasi (T-00) | **PostgreSQL native** terpasang langsung di laptop (installer resmi/Homebrew/apt/winget) + migrasi *shim* (sudah dirancang: membuat skema `auth`, role `anon`/`authenticated`, publikasi Realtime bila belum ada) | Postgres biasa cukup untuk semua uji yang tidak butuh layanan Supabase; beban jauh di bawah menjalankan seluruh tumpukan Supabase di container |
| Auth login, Realtime, Storage (signed URL), E2E | **Project Supabase `fnb-dev` terhosting** + aplikasi lokal `pnpm dev` | Layanan ini tidak ada di Postgres biasa; uji di hosting |
| Seluruh rangkaian setiap PR | **GitHub Actions** (service Postgres di runner GitHub) | Tidak memakai ruang laptop sama sekali |

**Jalur cadangan bila laptop benar-benar tidak muat PostgreSQL:** jalankan integrasi/konkurensi **hanya di CI** (GitHub Actions); lokal hanya unit test + `pnpm dev` ke `fnb-dev`. Konsekuensi: umpan balik integrasi lebih lambat (menunggu CI).

**Tidak disarankan sebagai jalur utama**
- *Supabase native runtime* (tanpa Docker): masih **Public Alpha**, tidak mendukung Windows maupun Intel Mac, bisa berubah [TERVERIFIKASI]. Boleh dicoba oleh yang memenuhi syarat, tetapi jangan dijadikan standar tim.
- *Podman*: tetap runtime kontainer, tidak otomatis lebih hemat ruang. 
- *Basis data in-process/WASM*: koneksi tunggal, sehingga **tidak valid** untuk menguji konkurensi anti-oversell.

**Ruang disk:** hindari menyimpan banyak versi Node/Postgres; hapus cache pnpm lama (`pnpm store prune`); `node_modules` per proyek satu saja.
Catatan: sistem operasi laptop belum diketahui; bila Windows, native runtime Supabase tidak tersedia, jalur utama di atas tetap berlaku.

## 4. Pemisahan lingkungan

| Lingkungan | App | Database | Auth/Realtime/Storage | APP_ENV | Sandbox bayar |
|---|---|---|---|---|---|
| Lokal | `pnpm dev` | PG native lokal (uji) **atau** `fnb-dev` | `fnb-dev` | `local` | aktif |
| Test/CI | runner GitHub | service Postgres + shim | tidak ada (diuji di dev) | `test` | aktif |
| Dev/Preview | Vercel Preview | `fnb-dev` | `fnb-dev` | `dev` | aktif |
| Demo | Vercel Production | `fnb-demo` | `fnb-demo` | `demo` | aktif (banner SIMULASI) |
| Pilot/Produksi (kelak) | project terpisah | project baru | project baru | `production` | **mati, app menolak boot bila aktif** |
Dua project Supabase gratis (`fnb-dev`, `fnb-demo`) memakai seluruh kuota gratis; project ketiga (pilot) berarti paket berbayar. **Usulan amandemen** pada keputusan M7: enum `APP_ENV` menjadi `local | test | dev | demo | production` (sebelumnya `demo | production`).
Scope env di Vercel: variabel Production → `fnb-demo`; Preview → `fnb-dev`. Preview dilindungi Vercel Authentication (tersedia di Hobby [TERVERIFIKASI]).

### 4.1 Pause dan cadangan (karena batas gratis)
- Project yang tidak aktif 1 minggu di-pause; **bangunkan ≥ 1 hari sebelum demo** dan uji. Penjadwal sweeper (lihat 5) sekaligus berfungsi sebagai aktivitas rutin [BELUM TERVERIFIKASI bahwa ini dihitung sebagai aktivitas].
- Tanpa backup otomatis: seluruh data demo harus dapat dibuat ulang dari **seed idempoten**; tidak ada data penting hanya di `fnb-demo`.
### 4.2 Pooler dan migrasi
`DATABASE_URL` = pooler mode transaksi untuk aplikasi. `DIRECT_URL` untuk migrasi: koneksi langsung Supabase dahulu **hanya IPv6**; bila jaringan Anda IPv4, pakai *session pooler* [BELUM TERVERIFIKASI; cek di dokumen koneksi Supabase]. Migrasi ke hosted dijalankan **manual terkontrol** (bukan otomatis di build Vercel), lihat 5.
### 4.3 Region
Pilih region Supabase terdekat pengguna (mis. Singapura bila tersedia untuk akun) dan set region fungsi Vercel yang sama/ berdekatan [BELUM TERVERIFIKASI ketersediaan per plan]. Latensi lintas benua pada transaksi 6-8 statement lebih penting daripada batas durasi.

## 5. CI/CD (sederhana)

**Cabang:** trunk-based, `main` dilindungi; semua perubahan lewat PR kecil; PR area 🔍 butuh review manusia; tidak ada push langsung ke `main`.

**GitHub Actions (satu berkas alur, tiga pekerjaan):**
1. `check`: install (lockfile beku), `lint`, `typecheck`, unit test.
2. `integration`: service Postgres + shim + `prisma migrate deploy` ke DB kosong + integrasi/konkurensi/RLS + **T-00** (penjaga migrasi).
3. `build`: `next build` dengan env contoh. 
Wajib hijau sebelum merge.

**Deploy:** integrasi Git Vercel (Preview per PR, Production dari `main`). **Migrasi ke hosted:** langkah manual terkontrol (pekerjaan terpisah dengan persetujuan/lingkungan terlindungi atau perintah manusia): `fnb-dev` dahulu, lalu `fnb-demo` setelah verifikasi. Urutan: migrasi → deploy aplikasi (migrasi harus kompatibel mundur).
**Sweeper:** workflow terjadwal GitHub memanggil `POST /api/cron/expire` dengan `CRON_SECRET` [interval minimum workflow terjadwal dan batas cron Vercel Hobby: BELUM TERVERIFIKASI]. Kebenaran stok tidak bergantung padanya (DL-EXP).
**Pembaruan dependensi:** Renovate/Dependabot hanya membuka PR, dikelompokkan, tanpa auto-merge.

## 6. Konfigurasi alat (diwujudkan di D-01)

- **TypeScript:** `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`; alias `@/` ke `src/`.
- **ESLint (flat config) + typescript-eslint (strict)** memuat semua aturan AGENTS.md Bagian 12: batas impor (`no-restricted-imports`), `max-lines`, `max-lines-per-function`, `max-params`, `complexity`, `max-depth`, `no-explicit-any`, `no-console` (kecuali pencatat), larangan Prisma di luar `server/services` dan `server/db`, larangan menulis status `paid` di luar `confirmPayment`.
- **Prettier** dengan konfigurasi default proyek; `format:check` di CI. Hook pra-commit sederhana (lint-staged) opsional.
- **Skrip `package.json` baku:** `dev`, `build`, `lint`, `typecheck`, `format:check`, `test` (unit), `test:integration`, `test:e2e`, `db:migrate:dev`, `db:migrate:deploy`, `db:seed`, `db:reset:test`, `check` (lint+typecheck+test).
- **Kanari lint (pembuktian aturan aktif):** berkas contoh yang sengaja melanggar tiap aturan batas harus **gagal** lint pada pengujian khusus; tanpa itu aturan bisa mati diam-diam.

### 6.1 Versi dan kompatibilitas Prisma (wajib diverifikasi sebelum D-01)
Skema Demo Pack menulis `url` dan `directUrl` di blok `datasource`. Prisma versi 7 mengubah cara konfigurasi koneksi dan generator [BELUM TERVERIFIKASI detailnya di sesi ini]. **AI developer wajib** membaca panduan resmi versi yang dipilih, lalu: (a) memilih satu mayor, (b) menyesuaikan konfigurasi tanpa mengubah model/kolom/aturan bisnis, (c) mencatat penyesuaian di PR untuk persetujuan manusia (skema = kontrak beku).

## 7. Urutan bootstrap dan pengelolaan rahasia

**Pembuatan akun dan project (D-00, manusia, berurutan)**
1. Repo GitHub **privat**; aktifkan proteksi cabang `main`.
2. Dua project Supabase: `fnb-dev` dan `fnb-demo`. Region sama untuk keduanya. Catat kata sandi DB di pengelola kata sandi.
3. Di tiap project: **matikan pendaftaran publik** (staf dibuat lewat seed/admin; customer anonim tidak memakai Auth); buat bucket privat `payment-proofs` (batas 2 MB, JPEG/PNG; tanpa policy publik); catat URL, kunci publik (anon/publishable), kunci rahasia server, string koneksi pooler dan koneksi langsung/session. Nama kunci mengikuti dashboard terbaru [BELUM TERVERIFIKASI].
4. Project Vercel dari repo; isi variabel per lingkungan (Production → demo, Preview → dev); aktifkan perlindungan Preview; region fungsi.
5. Rahasia GitHub Actions: hanya yang dibutuhkan pekerjaan terjadwal dan migrasi terkontrol (`CRON_SECRET`, URL aplikasi; string koneksi untuk pekerjaan migrasi bila dipakai).
6. Cek **manual** batas dan ToS Hobby di halaman resmi (komersial dilarang) dan batas cron/body [BELUM TERVERIFIKASI untuk dua yang terakhir].

**Aturan rahasia**
- `.env.local` tidak pernah di-commit; hanya **`.env.example`** (nama variabel tanpa nilai) yang ada di repo.
- **Jangan menempelkan rahasia ke AI**, ke prompt, ke issue, atau ke log. AI hanya mendapat `.env.example`.
- Kunci rahasia server hanya di Vercel (server) dan lingkungan lokal Anda; **tidak pernah** berawalan `NEXT_PUBLIC_`; berkas server memakai `import 'server-only'`.
- Dugaan bocor → putar (rotate) kunci di Supabase/Vercel segera, perbarui di semua lingkungan.
- `env.ts` memvalidasi dengan Zod dan menolak boot bila variabel hilang atau kombinasi salah (mis. `APP_ENV=production` dengan sandbox aktif).

## 8. Kartu D-00 dan D-01 diperluas (menggantikan v1)

**D-00 Persiapan (manusia, tidak dikerjakan AI)** — Selesai bila: butir 1-6 Bagian 7 dicentang; ada berkas catatan (tanpa rahasia) berisi nama project, region, URL; satu pengujian koneksi dari laptop ke `fnb-dev` berhasil.

**D-01 Repo dan tooling** (Stream A+B)
- Bacaan wajib: dokumen ini, AGENTS.md. Batas file: root, `.github/`, `src/` kerangka kosong sesuai struktur Amandemen Bagian 9.1.
- AC:
  1. Given repo baru When `pnpm install --frozen-lockfile && pnpm check` Then hijau; versi Node dan pnpm dipin (`.nvmrc`/`engines`/`packageManager`).
  2. Given berkas kanari yang melanggar tiap aturan batas impor/ukuran When lint Then **gagal** untuk tiap pelanggaran (tes terpisah).
  3. Given env hilang/salah When aplikasi dijalankan Then gagal boot dengan pesan jelas; `.env.example` memuat semua variabel dari Amandemen 9.4 + `APP_ENV` baru, tanpa nilai rahasia.
  4. Given PR When CI berjalan Then tiga pekerjaan (check, integration kosong yang siap, build) hijau.
  5. Given `proxy.ts` placeholder Then menerbitkan cookie contoh bertanda tangan (bukti jalur proxy Next.js 16 berfungsi di Preview).
  6. Given README Then berisi: prasyarat, perintah baku, alur lokal tanpa Docker, cara menjalankan tes integrasi, peta lingkungan.
- Di luar scope: skema, migrasi, fitur apa pun.

## 9. Daftar verifikasi sebelum D-01 (AI membaca dokumentasi resmi; manusia menyetujui)
1. Versi persis Next.js 16.x, React, Prisma (mayor + konfigurasi), Supabase JS, `@supabase/ssr`, TanStack Query, Zod; kompatibilitas satu sama lain; Node yang didukung Vercel.
2. Perilaku `proxy.ts` pada deployment target (runtime Node.js).
3. Cara koneksi Supabase: pooler transaksi dan session/direct (IPv4 vs IPv6); parameter koneksi Prisma yang benar untuk pooler.
4. Nama dan format kunci API Supabase terbaru.
5. Batas Vercel Hobby yang belum terverifikasi: batas body request fungsi, batas dan frekuensi cron, region fungsi.
6. `pg_cron` di tier gratis (tidak wajib; sweeper memakai penjadwal luar).
7. Interval minimum workflow terjadwal GitHub dan perilaku bila repo tidak aktif.
8. Hasil verifikasi dicatat di `docs/setup/verifikasi-stack.md` (item, sumber, tanggal, hasil) dan **disetujui manusia**.
