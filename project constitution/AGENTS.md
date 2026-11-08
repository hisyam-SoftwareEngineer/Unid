# AGENTS.md: Aturan Kerja AI Developer (Web App F&B)

Berlaku untuk semua AI yang menulis kode di repo ini (Antigravity dan sejenisnya). Dibaca **sebelum setiap tugas**. Bila aturan ini bertentangan dengan task card, Demo Pack, atau Spesifikasi Jaminan Database: **BERHENTI dan tanyakan**, jangan memilih sendiri.

Status: draft, menunggu review manusia. Stack: Next.js (App Router) · TypeScript strict · Prisma · Supabase (Auth, Realtime, Storage) · Zod · Vitest · Playwright · pnpm.

---

## 1. Peran dan batas wewenang

**AI boleh:** menulis kode dalam batas file di task card, menulis test, memperbaiki lint/typecheck, mengusulkan refactor kecil di dalam file yang disentuh.

**AI tidak boleh tanpa persetujuan manusia:**
- mengubah `schema.prisma`, berkas migrasi, `server/contracts/*`, `server/errors/*`, atau daftar jaminan database;
- menambah dependensi baru;
- menonaktifkan lint, mengubah aturan lint, atau menambah `eslint-disable`, `@ts-ignore`, `any`;
- mengubah aturan bisnis (uang integer, total dihitung server, gerbang antrean satu fungsi, `paid` hanya lewat `confirmPayment`);
- menyentuh file di luar "Batas file" task card;
- menyatakan area 🔍 "aman". Yang boleh dilaporkan hanya "tes lulus".

**Saat ragu:** ajukan pertanyaan tertulis dengan 2 opsi dan rekomendasi. Jangan menebak lalu membangun di atas tebakan.

## 2. Alur kerja satu tugas (wajib berurutan)

1. Baca task card, kontrak terkait, dan bagian AGENTS.md ini yang relevan.
2. Tulis **rencana singkat**: file yang dibuat/diubah, fungsi publik baru, test yang akan ditulis. Berhenti bila rencana keluar dari batas file.
3. Tulis **test dulu** untuk acceptance criteria (minimal kerangka yang gagal).
4. Implementasi sekecil mungkin sampai test hijau.
5. Rapikan (lihat bagian 8), jalankan `pnpm lint && pnpm typecheck && pnpm test`.
6. Laporan akhir memakai templat bagian 11.

Satu tugas = satu cabang = satu PR kecil (target < 400 baris diff di luar test dan file hasil generate). Tidak mencampur refactor dengan fitur.

---

## 3. Arsitektur dan aturan impor

```
src/
  app/                    # halaman dan Route Handler (tipis)
    m/[outlet]/[token]/
    (staff)/kasir|logistik|login/
    api/public|staff|cron/
  server/
    contracts/            # skema Zod + tipe turunan (dibagi dengan klien)
    services/             # logika bisnis, dikelompokkan per domain
    db/                   # prisma singleton, withTx, helper query mentah
    auth/                 # sesi staf, requireRole, sesi sid customer
    errors/               # AppError, kode, pesan Indonesia terpusat
    config/               # env.ts (divalidasi Zod)
  client/                 # hooks, api client, state UI
  components/             # komponen UI (customer/, staff/, ui/)
  lib/                    # utilitas murni tanpa efek samping (format rupiah, tanggal)
prisma/ tests/ docs/
```

**Arah ketergantungan (ditegakkan lint, bukan konvensi lisan):**

`app/api` → `services` → `db`. `app` halaman → `components` → `client` → `contracts`.

- `services` tidak mengimpor `next/*`, `react`, atau apa pun dari `app/` dan `components/`.
- `client` dan `components` hanya boleh mengimpor `server/contracts`, tidak pernah modul server lain.
- `lib` tidak mengimpor apa pun dari proyek selain `lib`.
- Route Handler hanya: parse input (Zod) → panggil service → petakan hasil/error ke HTTP. **Nol logika bisnis** di handler.
- Mutasi memakai Route Handler, bukan Server Action.
- Akses database hanya dari `services` melalui `db`. Komponen dan handler tidak memanggil Prisma.

## 4. Struktur service per domain

Satu folder per domain, satu berkas per kasus penggunaan:

```
server/services/payments/
  confirmPayment.ts        # 1 fungsi publik utama per berkas
  verifyPayment.ts
  receiveCash.ts
  expirePayments.ts
  paymentTransitions.ts    # tabel transisi + assertTransition (satu sumber)
  paymentTtl.ts            # aturan TTL per metode
  payments.types.ts        # tipe internal domain
  index.ts                 # satu-satunya pintu keluar domain
tests/integration/payments/confirmPayment.test.ts
```

Aturan:
- **Satu berkas = satu tanggung jawab.** Berkas yang mengekspor lebih dari satu fungsi publik "utama" harus dipecah. Fungsi pembantu kecil boleh tinggal di berkas yang sama bila hanya dipakai di situ.
- Domain lain mengimpor hanya dari `index.ts` domain itu, tidak dari berkas dalam.
- Tidak ada folder `utils/`, `helpers/`, `common/`, `misc/`. Fungsi pembantu diberi rumah sesuai maknanya (`lib/money`, `payments/paymentTtl.ts`).
- Dependensi (db/tx, jam, pembuat id) dikirim sebagai argumen atau lewat satu objek konteks; tidak ada singleton tersembunyi selain Prisma client dan konfigurasi env.
- Fungsi bisnis menerima `tx` bila bagian dari transaksi yang lebih besar; hanya fungsi tingkat kasus-penggunaan yang membuka transaksi (`withTx`).

## 5. Penamaan

Bahasa: **identifier kode dalam bahasa Inggris**; teks tampilan ke pengguna, pesan error, dan dokumen dalam bahasa Indonesia. Pesan Indonesia hanya hidup di `errors/messages.id.ts` dan berkas teks UI, bukan tersebar di logika.

| Hal | Aturan | Contoh |
|---|---|---|
| Berkas fungsi/service | `camelCase.ts`, nama = kata kerja + objek | `confirmPayment.ts` |
| Berkas komponen React | `PascalCase.tsx`, satu komponen utama per berkas | `OrderStatusCard.tsx` |
| Hook | `useXxx.ts` | `useOrderStatus.ts` |
| Folder | `kebab-case` atau huruf kecil tunggal, domain dalam bentuk jamak | `payments`, `stock` |
| Tipe/interface/class | `PascalCase`, kata benda | `PaymentTransition`, `AppError` |
| Fungsi | `camelCase`, diawali kata kerja | `calculateBill`, `releaseToQueue` |
| Boolean | awalan `is/has/can/should` | `isExpired`, `hasProof` |
| Konstanta | `UPPER_SNAKE_CASE` untuk nilai tetap global | `MAX_UNPAID_ORDERS_PER_TABLE` |
| Skema Zod | `PascalCaseInput` / `PascalCaseOutput` | `CreateOrderInput` |
| Test | `<unit>.test.ts` berdampingan nama sumber | `confirmPayment.test.ts` |
| Kode error | `UPPER_SNAKE_CASE`, stabil, tidak diganti | `OUT_OF_STOCK` |
| Kolom/tabel DB | snake_case (sudah ditetapkan di skema) | `outlet_id` |

Larangan nama: `data`, `info`, `temp`, `obj`, `item2`, `handle`, `process`, `manager`, `helper`, `util`, singkatan tidak baku. Nama harus menyatakan **maksud**, bukan tipe (`unpaidOrderCount`, bukan `num`).
Satu konsep = satu kata di seluruh kode (selalu `order`, jangan campur `pesanan`/`transaction`; selalu `menuItem`, jangan campur `product`).
Istilah domain baku: `outlet`, `table`, `bill`, `order`, `payment`, `stockItem`, `reservation`, `movement`, `businessDate`, `pickupCode`.

## 6. Ukuran dan bentuk kode (ditegakkan lint)

- Fungsi ≤ **40 baris**, ≤ **4 parameter** (lebih dari itu → objek parameter bernama), kompleksitas siklomatik ≤ **10**, kedalaman blok ≤ **3**.
- Berkas ≤ **250 baris** (komponen ≤ 200). Mendekati batas = tanda untuk memecah.
- Satu tingkat abstraksi per fungsi: fungsi orkestrasi memanggil langkah bernama; tidak mencampur validasi, query, dan format dalam satu blok.
- **Early return** menggantikan if bersarang. Tidak ada `else` setelah `return`/`throw`.
- Tidak ada angka/teks ajaib: nilai bisnis (TTL, batas, tarif) di berkas konstanta bernama atau konfigurasi, dengan satuan di nama (`PAYMENT_TTL_MINUTES`).
- Tidak ada kode mati, kode yang dikomentari, `console.log` tersisa, atau TODO tanpa nomor tugas.
- Komentar menjelaskan **mengapa**, bukan **apa**. Aturan non-obvious (urutan kunci, alasan retry) wajib berkomentar singkat dengan rujukan ke jaminan/ADR.
- Tidak ada duplikasi aturan bisnis; bila logika yang sama ditulis dua kali, ekstrak ke satu fungsi di domain pemiliknya. (Tidak mengekstrak kemiripan kebetulan.)
- Mutasi data bersama dihindari; fungsi murni di `lib/` bila memungkinkan.

## 7. TypeScript, validasi, error

- `strict: true`, `noUncheckedIndexedAccess: true`. **Dilarang** `any`, `as unknown as`, non-null `!` tanpa komentar alasan, dan `@ts-ignore`. Tipe turunan dari Zod (`z.infer`) dan Prisma, bukan ditulis ulang.
- Semua input dari luar (HTTP, env, JSON) divalidasi Zod **di batas sistem**; di dalam, tipe dipercaya.
- Uang selalu `number` integer Rupiah; tidak ada float, tidak ada pembagian tanpa pembulatan eksplisit di `lib/money`.
- Tanggal bisnis berupa string `YYYY-MM-DD`; tidak memakai zona waktu server; waktu diambil lewat satu fungsi jam yang bisa diganti di test.
- Error domain = `AppError(code, details?)`; kode dari daftar tunggal. Tidak melempar string atau `Error` polos untuk kasus bisnis. Tidak menelan error (`catch {}` kosong dilarang). Respons error tidak membocorkan detail internal.
- Fungsi yang bisa gagal secara bisnis melempar `AppError`; yang gagal karena bug biarkan naik sebagai `INTERNAL`.
- Log terstruktur dengan `requestId`; tidak mencatat data sensitif (token meja, bukti, secret).

## 8. Definition of Done (checklist per tugas)

- [ ] AC di task card terpenuhi dan ada test per AC (Given-When-Then tercermin pada nama test).
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` hijau; tidak ada peringatan baru.
- [ ] Tidak ada file di luar batas task card yang berubah.
- [ ] Tidak ada duplikasi aturan bisnis; fungsi/berkas dalam batas ukuran.
- [ ] Nama sesuai bagian 5; tidak ada `utils/helpers`.
- [ ] Error memakai kode baku; pesan Indonesia di berkas pesan.
- [ ] Tidak ada secret, tidak ada `NEXT_PUBLIC_` baru untuk rahasia.
- [ ] Dokumentasi singkat diperbarui bila perilaku publik berubah (`docs/`).
- [ ] Area 🔍: daftar hal yang perlu ditinjau manusia ditulis di PR (bagian 11).

## 9. Testing

- Piramida: unit (fungsi murni, kalkulasi) → integrasi di Postgres nyata (service, transaksi, konkurensi) → RLS/hak akses → E2E (skrip demo).
- Test deterministik: jam dan pembuat id disuntik; tidak bergantung urutan test; data uji dibuat per berkas.
- Konkurensi diuji dengan permintaan paralel nyata (bukan mock) pada invarian yang ditetapkan di Spesifikasi Jaminan Database.
- Setiap bug yang diperbaiki mendapat test regresi terlebih dahulu.
- Mock hanya untuk batas eksternal (Storage, jam). Tidak memock database untuk menguji logika transaksi.
- Test yang tidak stabil diperbaiki atau dihapus dengan alasan; tidak di-skip diam-diam.

## 10. Git, commit, PR

- Cabang: `feat/D-07-confirm-payment`, `fix/...`, `chore/...`.
- Commit kecil, imperatif, format `tipe(ruang): ringkasan` (contoh `feat(payments): add confirmPayment`). Satu maksud per commit.
- PR memakai templat bagian 11. Tidak ada commit langsung ke `main`; CI hijau + review manusia untuk area 🔍.
- Tidak ada berkas hasil generate, `.env`, atau data uji nyata dalam commit.

## 11. Templat laporan akhir AI (ditempel di PR)

```
Tugas: D-xx <judul>
Ringkasan perubahan (3 baris maks):
File dibuat/diubah: <daftar>
Fungsi publik baru: <nama, tanggung jawab satu baris>
Test: <nama test per AC> · hasil lint/typecheck/test: <hijau/merah>
Keputusan yang saya ambil sendiri: <daftar, atau "tidak ada">
Pertanyaan/ambigu yang saya temukan: <daftar, atau "tidak ada">
Area 🔍 untuk manusia: <hal spesifik yang perlu diperiksa>
Yang SENGAJA tidak saya kerjakan (di luar scope): <daftar>
```
AI tidak menulis "aman" atau "sudah teruji menyeluruh". Hanya fakta: apa yang dites dan hasilnya.

## 12. Penegakan otomatis (D-01 menyiapkan, bukan sekadar anjuran)

- ESLint: `no-restricted-imports` untuk aturan bagian 3, `max-lines`, `max-lines-per-function`, `max-params`, `complexity`, `max-depth`, `@typescript-eslint/no-explicit-any`, `no-console`, aturan penamaan berkas.
- Aturan khusus proyek: larang penulisan status `paid` di luar `confirmPayment`; larang impor Prisma di luar `server/services` dan `server/db`; larang literal angka bisnis di service (harus dari berkas konstanta).
- Prettier + `pnpm format:check` di CI; hook pra-commit menjalankan lint-staged.
- CI wajib: lint, typecheck, test, penjaga migrasi (T-00), dan pemeriksaan ukuran PR.
- Dependency: Renovate/Dependabot hanya membuka PR; AI tidak menaikkan versi mayor tanpa persetujuan.

## 13. Templat prompt tugas untuk AI (diisi manusia atau dari task card)

```
Baca AGENTS.md, Demo Pack v1.1 (bagian X), dan Spesifikasi Jaminan Database (J-xx).
Tugas: D-xx <judul>.
Tujuan bisnis: <1-2 kalimat>.
AC: <Given-When-Then>.
Kontrak beku (jangan diubah): <daftar>.
Batas file: hanya <path>. Di luar scope: <daftar>.
Urutan: rencana singkat → test dulu → implementasi → rapikan → laporan (templat bagian 11).
Jika ada konflik atau ambigu: BERHENTI dan tanya dengan 2 opsi + rekomendasi.
```

## 14. Pembaruan dokumen ini

Perubahan AGENTS.md hanya lewat PR yang disetujui manusia. AI boleh **mengusulkan** perubahan (dengan alasan dan contoh masalah yang ditemui) tetapi tidak menerapkannya sendiri.
