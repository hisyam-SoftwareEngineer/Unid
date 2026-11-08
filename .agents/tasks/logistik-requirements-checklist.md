# Checklist Artefak Requirement Domain Logistik (Stok & Porsi)

**Tujuan laporan:** memetakan secara presisi dokumen/artefak apa yang HARUS ADA sebelum developer (vibe coder) dapat mengimplementasi modul logistik — bukan menulis requirement-nya, melainkan mendaftar apa yang harus ditulis, isinya apa, dan sumbernya dari mana.

Dihasilkan: investigasi read-only terhadap 13 berkas `project constitution/` per instruksi workflow.
Status keseluruhan proyek: P1, P2, P3 = DONE-MENUNGGU-REVIEW; semua Q-001..Q-029 sudah DIJAWAB.

---

## RINGKASAN EKSEKUTIF

Requirement domain logistik **belum siap** untuk vibe coding. Dari 18 artefak yang dibutuhkan, **hanya 3 yang sudah ada** (P1, P2, P3 dalam status DONE-MENUNGGU-REVIEW, belum APPROVED). Artefak krusial — DL-STK (spesifikasi logika stok), L1-LOG (PRD modul logistik), dan 8 berkas F-LOG-01..08 (PRD per fitur) — **semuanya masih NOT-STARTED**. Selain itu, 2 task D-xx (perubahan kontrak beku dari Q-028 dan Q-029) belum dieksekusi dan berdampak langsung pada logistik.

**Blocker terbesar:** P1/P2/P3 belum APPROVED manusia → tidak ada prasyarat berkas hilir yang terpenuhi.

---

## BAGIAN 1: DAFTAR FITUR LOGISTIK DI FASE 1 (MVP.md)

Sumber: `MVP.md` Bagian 3 (Fase 1 Scope) — Stream B (Dapur dan Stok).

### Fitur yang relevan untuk domain logistik (role `logistik`)

| ID MVP | Nama Fitur | Kelas | Milestone | Catatan |
|--------|-----------|-------|-----------|---------|
| B1 | Ledger stok append-only, stock_item bertipe `portion` | MVP | M2 (skema M0) | Menopang wedge; menunggu G0 |
| B2 | Isi stok pagi, dengan "salin stok kemarin" | MVP | M2 | Wedge; opsi salin menjawab skenario gagal T3 |
| B3 | Reservasi stok dengan TTL, anti-oversell | MVP | M2 | Test wajib; area 🔍 |
| B4 | Menu otomatis HABIS (satu fungsi ketersediaan) + toggle HABIS manual | MVP | M2 | Wedge; toggle manual memakai fungsi yang sama |
| B6 | Status realtime ke pelanggan, pulih saat koneksi kembali | MVP | M2 | Standar UI |
| B7 | Koreksi stok dan catat terbuang dengan alasan | MVP | M4 | Tipe movement ada di skema M0; UI di M4 |
| B8 | Rekap akhir hari (terjual, sisa, terbuang) | MVP | M4 | Bukti nilai wedge bagi pemilik |

**Catatan cross-reference dengan PROGRESS.md (berkas "folder yang baru"):**

`PROGRESS.md` Bagian C mencantumkan 8 berkas fitur logistik: `F-LOG-01..08`. Tidak ada mapping 1-to-1 langsung antara ID MVP (B1-B8) dan ID fitur Pack 2 (F-LOG-01..08), tetapi dari `PROMPT_PACK_PRD_PER_FITUR.md` Bagian A dapat dikonstruksi pemetaan berikut:

| ID Pack 2 | Nama Fitur | MoSCoW | Pemetaan MVP |
|-----------|-----------|--------|--------------|
| F-LOG-01 | Isi stok pagi | MUST | B2 |
| F-LOG-02 | Salin stok kemarin | SHOULD | B2 |
| F-LOG-03 | Lihat sisa stok dan status menu | MUST | B1, B4 |
| F-LOG-04 | Koreksi stok saat hari berjalan | SHOULD | B7 |
| F-LOG-05 | Toggle HABIS manual | MUST | B4 |
| F-LOG-06 | Catat porsi terbuang | COULD | B7 |
| F-LOG-07 | Rekap harian | COULD | B8 |
| F-LOG-08 | Riwayat pergerakan stok (ledger) | SHOULD | B1 |

**Status semua F-LOG-01..08: NOT-STARTED** (dikonfirmasi `PROGRESS.md` Bagian C).

---

## BAGIAN 2: ATURAN BISNIS DOMAIN LOGISTIK

Sumber: `03-business-rules.md` ("folder yang baru") — Seksi 7 (Stok & Reservasi), Seksi 8 (Hari Bisnis), Seksi 10A (Aturan Tambahan), Seksi 11.4 (Transisi Reservasi), Seksi 12.

### Aturan Bisnis yang Berlaku untuk Logistik

| BR-ID | Modul | Ringkasan (satu baris) |
|-------|-------|----------------------|
| BR-006 | STK | Menu `manualSoldOut=true` tidak boleh dipesan |
| BR-070 | STK | `reserveStock` harus dipanggil di dalam `createOrder`; menu tanpa StockItem = tak terbatas |
| BR-071 | STK 🔍 | Ketersediaan dihitung dengan satu rumus di database (J-04); tidak boleh ada salinan rumus di kode |
| BR-072 | STK | Ketersediaan negatif ditampilkan 0 atau HABIS |
| BR-073 | STK | Reservasi `held` → `confirmed` + movement `consume` saat payment `paid`; → `released` saat rejected/expired/cancelled |
| BR-074 | STK | Satu reservasi menghasilkan paling banyak satu movement `consume` (dijamin DB) |
| BR-075 | STK 🔍 | Aksi yang mengurangi ketersediaan (reservasi baru, `opening` diturunkan) harus mengunci baris `stock_items`; yang menambah tidak |
| BR-076 | PLT 🔍 | Urutan kunci global: idempotensi advisory → tables → payments → stock_reservations → stock_items (urut id) → daily_counters |
| BR-077 | STK | `opening` ditulis sebagai satu movement bertanda selisih; nilai 0-999; tidak boleh di bawah reservasi `held` + terjual (ditolak BR-126) |
| BR-078 | STK 🔍 | Movement dan audit log tidak boleh diubah/dihapus oleh siapa pun; koreksi hanya dengan baris baru; TRUNCATE diblokir |
| BR-079 | STK | "Salin stok kemarin" mengisi formulir dari total `opening` kemarin, bukan sisa |
| BR-080 | STK | Movement `consume` memakai `order.businessDate` |
| BR-081 | STK | Reservasi hari bisnis lain tidak mengurangi stok hari ini |
| BR-090 | PLT 🔍 | Hari bisnis dihitung di database dari `timezone` dan `day_cutoff_minutes` outlet |
| BR-112 | ACC | Logistik tidak boleh melihat `payments` atau `orders`; hanya pemilik melihat `audit_logs` |
| BR-114 | PLT | Isi stok, HABIS manual = aksi sensitif yang harus dicatat audit |
| BR-121 | STK 🔍 | Pemblokir TRUNCATE harus ada di migrasi J-06 pada `stock_movements` dan `audit_logs` |
| BR-124 | STK | Customer hanya melihat tersedia/HABIS; jumlah sisa tidak ditampilkan |
| BR-125 | STK | Kasir dapat melihat ledger dan reservasi di `/kasir` hanya baca; kasir tidak boleh mengisi stok |
| BR-126 | STK 🔍 | Penurunan `opening` di bawah reservasi `held` + terjual ditolak dengan `STOCK_BELOW_COMMITTED` 422 |
| BR-127 | STK | `manualSoldOut` berlaku sampai staf membukanya kembali; tidak ada reset harian; layar isi stok menampilkan daftar menu HABIS manual sebagai pengingat |

**Aturan terkait logistik yang berasal dari domain lain (perlu dipahami oleh DL-STK):**

| BR-ID | Alasan relevan ke logistik |
|-------|--------------------------|
| BR-002 | Stok dihitung dalam bilangan bulat (porsi integer) |
| BR-034 | Status efektif dihitung saat dibaca; jalur baca tidak menulis |
| BR-035 | Sweeper memproses kedaluwarsa reservasi; membebaskan stok |

---

## BAGIAN 3: PERJALANAN PENGGUNA LOGISTIK (USER JOURNEY)

Sumber: `02-actors-journeys-permissions.md` ("folder yang baru") — Seksi 2.6 "Logistik isi stok pagi".

**Pemicu:** Pagi hari sebelum buka.
**Hasil:** Movement `opening` tertulis; menu otomatis HABIS saat tersedia ≤ 0.

| # | Aktor | Sistem | Catatan | Risiko |
|---|-------|--------|---------|--------|
| 1 | Logistik login (Supabase Auth) ke `/logistik` | Peran dan outlet diturunkan dari `profiles` | Tidak ada jalur lain | RBAC bocor 🔍 |
| 2 | Logistik (opsional) menekan "Salin stok kemarin" | Formulir diisi dari total `opening` kemarin (bukan sisa); dapat diubah | Satu halaman, satu angka per menu | Menyalin angka lama tanpa memeriksa |
| 3 | Logistik mengisi porsi per menu (0-999) | | Target T3: 10 menu ≤ 3 menit | Salah ketik 999 |
| 4 | Logistik menekan Simpan | Server menghitung selisih terhadap saldo hari itu dan menulis satu movement `opening` bertanda; hanya `businessDate` hari ini atau +1 | Menurunkan `opening` mengunci baris stok yang sama 🔍 | Penurunan di bawah reservasi `held` + terjual ditolak (BR-126, kode `STOCK_BELOW_COMMITTED`) |
| 5 | Logistik melihat sisa per menu dan ledger | `available_portions` | Ketersediaan negatif ditampilkan 0 | |
| 6 | Logistik menandai HABIS manual pada menu tertentu | `manualSoldOut` | Berlaku sampai staf membukanya kembali; tidak ada reset harian (BR-127) | Lupa dibuka kembali: menu tetap HABIS keesokan hari |

**Journey lain yang melibatkan logistik (dari Seksi 2.7, 2.8):**

- Ketika dua customer berebut porsi terakhir: logistik dapat menambah `opening` jika kehabisan (`available_portions` mengabaikan reservasi kedaluwarsa — Seksi 2.7).
- Saat pembayaran kedaluwarsa: porsi kembali tersedia; logistik tidak perlu tindakan (Seksi 2.8).

---

## BAGIAN 4: IZIN PERAN LOGISTIK

Sumber: `02-actors-journeys-permissions.md` ("folder yang baru") — Seksi 3 (Matriks Izin) dan Seksi 1.4 (Persona Logistik).

### Persona Logistik

| Aspek | Detail | Label |
|-------|--------|-------|
| Konteks | Mengisi stok tiap pagi; melihat sisa; mengecek ledger; di rumah makan kecil bisa pemilik atau juru masak | [ASUMSI] |
| Tujuan | Satu angka per menu per hari, secepat mungkin | [FAKTA] prinsip desain |
| Titik sakit | Beban input resep bahan baku (dihindari di demo) | [FAKTA] |
| Perangkat | HP Android | [ASUMSI] |
| Literasi digital | Tidak diketahui | [ASUMSI] |

### Yang BOLEH dilakukan logistik (Y)

| Kemampuan | Dasar |
|-----------|-------|
| Melihat menu dan ketersediaan | Matriks Demo Pack v1 Bagian 6 |
| Mengisi stok pagi | Matriks; J-02 |
| Melihat sisa stok | Matriks |
| Melihat ledger pergerakan stok | Matriks |
| Menandai HABIS manual | Matriks; BR-127 |
| Melihat reservasi stok | Matriks |

### Yang TIDAK BOLEH dilakukan logistik (T)

| Kemampuan | Dasar |
|-----------|-------|
| Membuat pesanan (createOrder) | Matriks |
| Melihat status pesanan customer | Matriks |
| Mengunggah bukti transfer | Matriks |
| Membatalkan pesanan | Matriks |
| Melihat antrean dan semua pesanan | Matriks |
| Mengubah status pesanan | Matriks |
| Verifikasi pembayaran (Valid/Tolak) | Matriks |
| Terima tunai | Matriks |
| Perpanjang batas waktu bayar | Matriks |
| Melihat bukti transfer | Matriks; J-02 |
| Melihat log audit | BR-112 |
| Melihat payment atau orders (via Realtime maupun API) | BR-112 |

**Catatan keputusan yang sudah final (relevan logistik):**
- Q-018 (A): kasir dapat melihat ledger di `/kasir` hanya baca — implementasi di F-KAS-07, bukan F-LOG.
- Q-019 (A): `manualSoldOut` berlaku sampai dibuka kembali (tidak reset harian) — berlaku di F-LOG-05, BR-127.
- Q-027 (A): kode error `STOCK_BELOW_COMMITTED` + daftar pengingat HABIS manual di layar isi stok — berlaku di F-LOG-01.

---

## BAGIAN 5: MODEL DATA DOMAIN LOGISTIK

Sumber: `DEMO_PACK_v1.1_Amandemen.md` Seksi 2 (Skema Prisma v1.1) dan Seksi 3 (SQL Migrasi).

### Tabel Prisma Utama

#### `stock_items` (StockItem)
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | UUID | PK |
| `outletId` | UUID | FK ke outlets; isolasi tenant |
| `menuItemId` | UUID? | FK ke menu_items (nullable; bisa tanpa menu) |
| `type` | Enum StockType | `portion` atau `ingredient` — demo hanya `portion` |
| `name` | String | Nama stok item |
| `unit` | String | Default `"porsi"` |

Catatan: satu StockItem per MenuItem (relasi `@unique`). Menu tanpa StockItem = stok tak terbatas.

#### `stock_movements` (StockMovement) — **Append-Only**
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | UUID | PK |
| `outletId` | UUID | FK ke outlets |
| `stockItemId` | UUID | FK ke stock_items |
| `type` | Enum MovementType | `opening` / `consume` / `adjust` / `waste` / `void_return` (reserved V2) |
| `qty` | Int | Bertanda (positif = masuk, negatif = keluar) |
| `businessDate` | Date | Hari bisnis (bukan kalender); dihitung dari J-09 |
| `orderId` | UUID? | Terkait order (untuk tipe `consume`) |
| `reservationId` | UUID? | `@unique` — mencegah consume ganda (J-06) |
| `reason` | String? | Wajib untuk tipe `adjust` dan `waste` |
| `createdBy` | UUID? | Actor logistik atau sistem |
| `createdAt` | DateTime | Timestamp server |

Indeks: `(stockItemId, businessDate)`.
Constraint: trigger `stock_movements_append_only` — UPDATE dan DELETE diblokir (SQL 3.5). TRUNCATE diblokir oleh BR-121.

#### `stock_reservations` (StockReservation)
| Field | Tipe | Keterangan |
|-------|------|-----------|
| `id` | UUID | PK |
| `outletId` | UUID | FK ke outlets |
| `stockItemId` | UUID | FK ke stock_items |
| `orderItemId` | UUID | FK ke order_items; `@unique` |
| `qty` | Int | Jumlah porsi yang ditahan |
| `status` | Enum ReservationStatus | `held` / `confirmed` / `released` |
| `businessDate` | Date | Hari bisnis |
| `expiresAt` | DateTime | Mengikuti TTL payment; diperbarui atomik bersama perpanjangan (BR-120) |
| `createdAt` | DateTime | |

Indeks: `(stockItemId, businessDate, status)` dan `(status, expiresAt)`.
Status final: `confirmed` dan `released` — tidak bisa kembali (trigger J-07).

### Fungsi Database Kritis untuk Logistik

| Fungsi | SQL | Keterangan |
|--------|-----|-----------|
| `available_portions(p_item, p_date)` | SQL 3.4 | Rumus tunggal J-04: SUM(movements) − SUM(reservasi held aktif hari itu). Wajib satu sumber; tidak boleh disalin di kode |
| `business_date(p_outlet)` | SQL 3.6 | Menghitung hari bisnis dari timezone dan cutoff outlet |

### Kontrak Zod Logistik

Dari `DEMO_PACK_v1.1_Amandemen.md` Seksi 4:

```ts
export const SetDailyStockInput = z.object({
  businessDate: day,          // hanya hari bisnis ini atau +1
  entries: z.array(z.object({
    menuItemId: uuid,
    portions: z.number().int().min(0).max(999)
  })).min(1),
});
```

### Field yang Masih Draft / Belum Resolved

| Item | Status | Keterangan |
|------|--------|-----------|
| Kolom `is_active` di `PaymentProof` | Menunggu task D-xx | Q-028 disetujui tetapi belum diimplementasi; tidak langsung memengaruhi logistik |
| `tableToken` wajib di `CreateOrderInput` | Menunggu task D-xx | Q-029 disetujui tetapi belum diimplementasi; tidak memengaruhi logistik (logistik tidak membuat order) |
| Angka rate limit endpoint logistik | [HIPOTESIS] | Belum ada tabel rate limit untuk `/api/staff/logistik/*` secara eksplisit |

---

## BAGIAN 6: PERTANYAAN TERBUKA YANG RELEVAN

Sumber: `OPEN-QUESTIONS.md` ("folder yang baru").

### Status: SELURUH Q-001..Q-029 sudah DIJAWAB per 7 Nov 2026.

Tidak ada pertanyaan terbuka yang memblokir requirement logistik secara langsung. Namun ada 3 item yang berdampak implementasi:

| Q | Topik | Status | Dampak ke Logistik |
|---|-------|--------|-------------------|
| Q-027 (A) | Kode error `STOCK_BELOW_COMMITTED` 422 + daftar pengingat HABIS manual | DIJAWAB — implementasi di F-LOG-01 | BR-126 dan BR-127 sudah definitif; harus tercantum di F-LOG-01 dan SL-F-LOG-01 |
| Q-028 (A) | Kolom `is_active` + partial unique index untuk bukti transfer | DIJAWAB — menunggu task D-xx | Tidak memblokir logistik; ini adalah perubahan pada tabel `payment_proofs` |
| Q-029 (A) | `tableToken` wajib di `CreateOrderInput` | DIJAWAB — menunggu task D-xx | Tidak memblokir logistik; logistik tidak membuat pesanan |

### Pertanyaan yang Hanya Bisa Dijawab T1-T3 (relevan untuk logistik)

| Pertanyaan | Tes | Dampak |
|-----------|-----|--------|
| Apakah warung menghitung ketersediaan dalam porsi dan mau mengisi stok tiap pagi? | T2 (A2, A3), T3 | Jika gagal, fitur B2 (F-LOG-01, F-LOG-02) harus disederhanakan |
| Waktu isi stok 10 menu ≤ 3 menit tanpa bantuan (MT-2) | T3 | Menentukan apakah "Salin stok kemarin" cukup atau perlu UX berbeda |

**Catatan:** Semua fitur logistik berlabel "menunggu G0" karena wedge (stok porsi) belum tervalidasi. Namun G0 tidak memblokir penulisan requirement — cukup semua doc berlabel [menunggu G0] dan provisional.

---

## BAGIAN 7: TEMPLATE ARTEFAK DARI PROMPT PACK

Sumber: `PROMPT_PACK_PRD_PER_FITUR.md` dan `PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md`.

### Artefak Level 1 (Modul)

**L1-LOG** — `docs/prd/modules/logistik/_module.md`

Template: Bagian D (PROMPT_PACK_PRD_PER_FITUR.md — "L1-LOG"):
- Tujuan modul dan nilai pengguna; metrik PRD yang disentuh (MT-1, MT-2, MT-8)
- Cakupan dan di luar cakupan (stok porsi bukan bahan baku)
- Aktor: logistik, pemilik (HP Android)
- Peta perjalanan modul (tabel langkah dari login sampai selesai isi stok)
- Indeks fitur final (F-LOG-01..08 dengan CRUD, MoSCoW, dependensi)
- Aturan lintas-fitur: definisi "tersedia" (satu rumus J-04), istilah (opening/terjual/tertahan/tersedia/terbuang) dalam Bahasa Indonesia, sifat tidak bisa diubah riwayat
- Pola layar bersama (mobile-first, HP Android)
- Risiko modul dan pertanyaan terbuka
- Matriks entitas × fitur (C/R/U/D)

Prasyarat dari PROGRESS.md: P0-P3 APPROVED.

### Artefak Level 2 (PRD Per Fitur)

Setiap fitur menggunakan Tugas Baku (S1-S14) dari Bagian C PROMPT_PACK_PRD_PER_FITUR.md + amandemen dari PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md Bagian C.

| ID | Nama | Path Output | MoSCoW | SL Wajib? |
|----|------|------------|--------|-----------|
| F-LOG-01 | Isi stok pagi | `logistik/F-LOG-01-isi-stok-pagi.md` | MUST | **Ya** (SL-F-LOG-01) |
| F-LOG-02 | Salin stok kemarin | `logistik/F-LOG-02-salin-stok-kemarin.md` | SHOULD | Tidak (S6b) |
| F-LOG-03 | Lihat sisa stok dan status menu | `logistik/F-LOG-03-lihat-sisa-stok.md` | MUST | Tidak (S6b) |
| F-LOG-04 | Koreksi stok saat hari berjalan | `logistik/F-LOG-04-koreksi-stok.md` | SHOULD | **Ya** (SL-F-LOG-04) |
| F-LOG-05 | Toggle HABIS manual | `logistik/F-LOG-05-toggle-habis-manual.md` | MUST | Tidak (S6b) |
| F-LOG-06 | Catat porsi terbuang | `logistik/F-LOG-06-catat-terbuang.md` | COULD | Tidak (S6b) |
| F-LOG-07 | Rekap harian | `logistik/F-LOG-07-rekap-harian.md` | COULD | Tidak (S6b) |
| F-LOG-08 | Riwayat pergerakan stok (ledger) | `logistik/F-LOG-08-riwayat-ledger.md` | SHOULD | Tidak (S6b) |

Semua berada di `docs/prd/modules/logistik/`.

### Artefak Spesifikasi Logika Domain

**DL-STK** — `docs/prd/logic/DL-STK.md`

Template: Bagian D (PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md — "DL-STK: Stok, ketersediaan, reservasi"):
- L1-L14 dari templat (identitas, tujuan, masukan, batas transaksi, langkah, tabel keputusan, konkurensi, kegagalan, efek samping, aturan LR, contoh numerik, pembuktian, peristiwa, Q-xxx)
- Cakupan wajib: rumus ketersediaan tunggal (J-04); menu tanpa StockItem = tak terbatas; aturan kunci (mengurangi = kunci, menambah = tidak); opening selisih; menurunkan stok di bawah reserved; ledger append-only; HABIS = manual OR tersedia ≤ 0; pelepasan reservasi; contoh porsi terakhir diperebutkan 20 permintaan
- Prasyarat: P0-P3 dan P5 APPROVED

### Artefak Spesifikasi Logika Fitur (SL)

**SL-F-LOG-01** — `docs/prd/modules/logistik/logic/SL-F-LOG-01.md`

Template: Bagian F (PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md — "SL-F-LOG-01 Isi stok pagi"):
- Algoritma selisih per menu (saldo hari itu vs input → satu movement bertanda; selisih nol tidak menulis)
- Atomik semua-atau-tidak
- Validasi (0-999, bulat) dan pesan `STOCK_BELOW_COMMITTED`
- Hari bisnis yang diizinkan (hari ini/+1)
- Simpan ulang di hari sama
- Dua penyimpan bersamaan (siapa menang)
- Ringkasan konfirmasi (apa yang akan berubah)
- Pencatatan waktu isi untuk T3
- Menu tanpa StockItem tidak ada di formulir
- Rujukan: DL-STK, DL-CODE (hari bisnis)

**SL-F-LOG-04** — `docs/prd/modules/logistik/logic/SL-F-LOG-04.md`

Template: Bagian F (PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md — "SL-F-LOG-04 Koreksi stok"):
- Mekanisme: opening ulang vs movement `adjust` dengan alasan
- Aturan kenaikan vs penurunan (penurunan harus mengunci)
- Penurunan di bawah yang sudah tereservasi
- Riwayat tidak berubah (koreksi = baris baru)
- Konkurensi dengan pesanan masuk
- Tabel hasil dan pesan
- Rujukan: DL-STK

### Artefak Rakit Modul

**R-LOG** — `docs/prd/modules/logistik/_rollup.md`

Template: Bagian F Level 3 (PROMPT_PACK_PRD_PER_FITUR.md — R-LOG) + tambahan dari PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md Bagian G:
- Tabel ringkas: fitur | jumlah story | MoSCoW | 🔍 | status
- Konsistensi lintas-fitur (istilah, pesan, angka)
- Duplikasi/bentrok antar fitur
- Matriks entitas × fitur (C/R/U/D)
- Matriks story → BR → J → jenis test; BR/J belum tertutup = GAP
- Pemeriksaan tambahan: matriks story/AC → LR; LR yatim; duplikasi logika antara PRD, SL, DL; kontradiksi AC vs LR; fitur wajib-SL yang belum punya SL
- Daftar pertanyaan terbuka modul
- Statistik dan verdik modul

---

## BAGIAN 8: CHECKLIST OUTPUT ARTEFAK (FINAL)

Berikut adalah daftar lengkap artefak yang **harus ada** sebelum developer dapat mengimplementasi modul logistik.

### Legenda Status
- ✅ Ada dan sudah APPROVED
- 🔶 Ada tetapi masih DONE-MENUNGGU-REVIEW (belum APPROVED manusia)
- ❌ Belum ada (NOT-STARTED)
- 🔒 Menunggu artefak lain selesai terlebih dahulu

---

### KELOMPOK A: Foundation (Harus APPROVED sebelum apapun di Kelompok B-E dapat dimulai)

| # | ID Artefak | Nama | Path | Template/Sumber | Input Utama | Diblokir oleh | Status |
|---|-----------|------|------|----------------|-------------|---------------|--------|
| A1 | P1 | PRD Induk | `project constitution/folder yang baru/01-prd-master.md` | Pack 1 Prompt P1 | Brainstorm Tahap 0, Demo Pack v1 | — | 🔶 DONE-MENUNGGU-REVIEW |
| A2 | P2 | Aktor, Perjalanan, Izin | `project constitution/folder yang baru/02-actors-journeys-permissions.md` | Pack 1 Prompt P2 | P1, Demo Pack v1 Bagian 2,5,6 | P1 | 🔶 DONE-MENUNGGU-REVIEW |
| A3 | P3 | Katalog Aturan Bisnis | `project constitution/folder yang baru/03-business-rules.md` | Pack 1 Prompt P3 | P1, Amandemen v1.1, Jaminan DB | P1 | 🔶 DONE-MENUNGGU-REVIEW |

**⚠ BLOCKER UTAMA: A1, A2, A3 harus mendapat status APPROVED dari manusia sebelum semua item di bawah bisa dimulai.**

---

### KELOMPOK B: Spesifikasi Logika Domain (Diperlukan sebelum F-LOG-01 dan F-LOG-04)

| # | ID Artefak | Nama | Path | Template | Input (BR, J, Zod) | Diblokir oleh | Status |
|---|-----------|------|------|----------|-------------------|---------------|--------|
| B1 | DL-STK | Spesifikasi Logika Domain Stok 🔍 | `docs/prd/logic/DL-STK.md` | PROMPT_PACK_v2.1 Bagian E — "DL-STK" | BR-070..081, BR-121, BR-124, BR-126, BR-127; J-04, J-06, J-07, J-09; Amandemen 5.2; `available_portions` (SQL 3.4) | P1, P2, P3 APPROVED + P5 APPROVED | ❌ NOT-STARTED |
| B2 | DL-CODE (parsial) | Spesifikasi Hari Bisnis | Bagian dari `docs/prd/logic/DL-CODE.md` | PROMPT_PACK_v2.1 Bagian E — "DL-CODE" (bagian hari bisnis saja) | BR-090; SQL 3.6; Amandemen 5.5; `business_date()` | P1, P2, P3 APPROVED + P5 APPROVED | ❌ NOT-STARTED |

**Catatan:** DL-STK adalah dokumen paling kritis untuk logistik. Semua aturan LR-STK-xx yang harus dirujuk oleh F-LOG-01, F-LOG-03, F-LOG-04, F-LOG-05 berasal dari DL-STK.

---

### KELOMPOK C: PRD Modul Level 1

| # | ID Artefak | Nama | Path | Template | Input | Diblokir oleh | Status |
|---|-----------|------|------|----------|-------|---------------|--------|
| C1 | L1-LOG | PRD Modul Logistik | `docs/prd/modules/logistik/_module.md` | PROMPT_PACK_PRD_PER_FITUR.md Bagian D — "L1-LOG" | P1, P2, P3 APPROVED; Persona 1.4; Journey 2.6; Matriks Seksi 3; F-LOG-01..08 (indeks) | P0-P3 APPROVED | ❌ NOT-STARTED |

---

### KELOMPOK D: PRD Per Fitur (Level 2) + Spesifikasi Logika Fitur (SL)

Semua memerlukan L1-LOG APPROVED sebagai prasyarat. Fitur MUST diprioritaskan.

| # | ID Artefak | Nama | Path | Template | Input BR | Input J | Input Zod/Contract | SL Wajib? | Diblokir oleh | Status |
|---|-----------|------|------|----------|----------|---------|-------------------|-----------|---------------|--------|
| D1 | F-LOG-01 | Isi Stok Pagi 🔍 | `docs/prd/modules/logistik/F-LOG-01-isi-stok-pagi.md` | Pack 2 Bagian E.3 "F-LOG-01" | BR-071, BR-075, BR-077, BR-090, BR-114, BR-121, BR-126, BR-127 | J-04, J-06, J-09 | `SetDailyStockInput` | **Ya** → SL-F-LOG-01 | L1-LOG APPROVED, DL-STK APPROVED | ❌ NOT-STARTED |
| D2 | SL-F-LOG-01 | Spec Logika: Isi Stok Pagi 🔍 | `docs/prd/modules/logistik/logic/SL-F-LOG-01.md` | PROMPT_PACK_v2.1 Bagian F — "SL-F-LOG-01" | Sama dengan F-LOG-01 | Sama dengan F-LOG-01 | `SetDailyStockInput` | — | F-LOG-01 APPROVED, DL-STK APPROVED | ❌ NOT-STARTED |
| D3 | F-LOG-02 | Salin Stok Kemarin | `docs/prd/modules/logistik/F-LOG-02-salin-stok-kemarin.md` | Pack 2 Bagian E.3 "F-LOG-02" | BR-079, BR-090 | J-09 | `SetDailyStockInput` (turunan) | Tidak | F-LOG-01 APPROVED | ❌ NOT-STARTED |
| D4 | F-LOG-03 | Lihat Sisa Stok dan Status Menu | `docs/prd/modules/logistik/F-LOG-03-lihat-sisa-stok.md` | Pack 2 Bagian E.3 "F-LOG-03" | BR-071, BR-072, BR-081, BR-124, BR-125 | J-04 | — | Tidak | L1-LOG APPROVED | ❌ NOT-STARTED |
| D5 | F-LOG-04 | Koreksi Stok Saat Hari Berjalan 🔍 | `docs/prd/modules/logistik/F-LOG-04-koreksi-stok.md` | Pack 2 Bagian E.3 "F-LOG-04" | BR-075, BR-077, BR-078, BR-126 | J-06 | `SetDailyStockInput` (extend) | **Ya** → SL-F-LOG-04 | F-LOG-03 APPROVED, DL-STK APPROVED | ❌ NOT-STARTED |
| D6 | SL-F-LOG-04 | Spec Logika: Koreksi Stok 🔍 | `docs/prd/modules/logistik/logic/SL-F-LOG-04.md` | PROMPT_PACK_v2.1 Bagian F — "SL-F-LOG-04" | Sama dengan F-LOG-04 | Sama dengan F-LOG-04 | — | — | F-LOG-04 APPROVED, DL-STK APPROVED | ❌ NOT-STARTED |
| D7 | F-LOG-05 | Toggle HABIS Manual | `docs/prd/modules/logistik/F-LOG-05-toggle-habis-manual.md` | Pack 2 Bagian E.3 "F-LOG-05" | BR-006, BR-114, BR-124, BR-127 | — | — | Tidak | L1-LOG APPROVED | ❌ NOT-STARTED |
| D8 | F-LOG-06 | Catat Porsi Terbuang | `docs/prd/modules/logistik/F-LOG-06-catat-terbuang.md` | Pack 2 Bagian E.3 "F-LOG-06" | BR-078 | J-06 | — | Tidak | F-LOG-04 APPROVED | ❌ NOT-STARTED |
| D9 | F-LOG-07 | Rekap Harian | `docs/prd/modules/logistik/F-LOG-07-rekap-harian.md` | Pack 2 Bagian E.3 "F-LOG-07" | — | J-04 | — | Tidak | F-LOG-03 APPROVED | ❌ NOT-STARTED |
| D10 | F-LOG-08 | Riwayat Pergerakan Stok (Ledger) | `docs/prd/modules/logistik/F-LOG-08-riwayat-ledger.md` | Pack 2 Bagian E.3 "F-LOG-08" | BR-078 | J-06 | — | Tidak | F-LOG-03 APPROVED | ❌ NOT-STARTED |

---

### KELOMPOK E: Rakit Modul dan Task Card

| # | ID Artefak | Nama | Path | Template | Input | Diblokir oleh | Status |
|---|-----------|------|------|----------|-------|---------------|--------|
| E1 | R-LOG | Rakit Modul Logistik | `docs/prd/modules/logistik/_rollup.md` | Pack 2 Bagian F + PROMPT_PACK_v2.1 Bagian G | Semua F-LOG-01..08 + SL APPROVED; matriks story→BR→J | Semua F-LOG APPROVED | ❌ NOT-STARTED |
| E2 | P14 (logistik) | Task Card Logistik | `docs/task-cards` (belum ada path final) | Pack 1 Prompt P14 + PROMPT_PACK_v2.1 Bagian G (P14) | R-LOG APPROVED; P9, P10, P11, P12, P13 APPROVED | R-LOG APPROVED + P9-P13 | ❌ NOT-STARTED |

---

### KELOMPOK F: Pending Task D-xx (Tidak Memblokir Logistik tetapi Harus Selesai Sebelum Freeze)

| # | Q | Perubahan | Dampak ke Logistik | Status |
|---|---|-----------|-------------------|--------|
| F1 | Q-028 | Kolom `is_active` + partial unique index di `payment_proofs` | Tidak langsung memengaruhi logistik | ❌ Menunggu task D-xx |
| F2 | Q-029 | `tableToken` wajib di `CreateOrderInput` + batas per `(tableToken, sid)` untuk takeaway | Tidak memengaruhi logistik (logistik tidak membuat order) | ❌ Menunggu task D-xx |

---

## RINGKASAN STATUS ARTEFAK

| Kelompok | Total | Sudah Ada | DONE-Menunggu-Review | Belum Ada |
|---------|-------|-----------|---------------------|-----------|
| A: Foundation | 3 | 0 | 3 🔶 | 0 |
| B: DL Logika Domain | 2 | 0 | 0 | 2 ❌ |
| C: PRD Modul L1 | 1 | 0 | 0 | 1 ❌ |
| D: PRD Fitur + SL | 10 | 0 | 0 | 10 ❌ |
| E: Rakit + Task Card | 2 | 0 | 0 | 2 ❌ |
| **TOTAL** | **18** | **0** | **3** | **15** |

---

## URUTAN EKSEKUSI YANG DISARANKAN

Mengikuti PROGRESS.md Bagian D (Urutan 6: Logistik dan Wedge) dengan prasyarat lengkap:

```
1. [SEGERA] Manusia: APPROVE P1 (01-prd-master.md)
2. [SEGERA] Manusia: APPROVE P2 (02-actors-journeys-permissions.md)
3. [SEGERA] Manusia: APPROVE P3 (03-business-rules.md)
4. [Sesudah 1-3] Eksekusi P8 (14-module-access-auth.md) — prasyarat hanya P2
5. [Sesudah 1-3] Eksekusi P5 (11-module-payment.md) — prasyarat P2, P3
6. [Sesudah 5] Eksekusi DL-STK — prasyarat P0-P3, P5 APPROVED
7. [Sesudah 5] Eksekusi DL-CODE (bagian hari bisnis) — prasyarat P0-P3, P5 APPROVED
8. [Sesudah 6, 7] Eksekusi L1-LOG — prasyarat P0-P3 APPROVED
9. [Sesudah 8] Eksekusi F-LOG-01, F-LOG-03, F-LOG-05 (MUST) — prasyarat L1-LOG APPROVED
10. [Sesudah 9 + 6] Eksekusi SL-F-LOG-01 — prasyarat F-LOG-01 APPROVED, DL-STK APPROVED
11. [Sesudah 9] Eksekusi F-LOG-02, F-LOG-04, F-LOG-08 (SHOULD)
12. [Sesudah 11 + 6] Eksekusi SL-F-LOG-04 — prasyarat F-LOG-04 APPROVED, DL-STK APPROVED
13. [Sesudah 9] Eksekusi F-LOG-06, F-LOG-07 (COULD) — jika dalam cakupan demo
14. [Sesudah 10-13] Eksekusi R-LOG
15. [Sesudah 14] Eksekusi task card logistik (bagian dari P14)
```

---

## CATATAN PENTING UNTUK VIBE CODER

Sebelum mulai coding modul logistik, developer **wajib** memiliki semua artefak berikut dalam kondisi APPROVED:

1. **DL-STK** — sumber tunggal semua aturan logika stok (LR-STK-xx). Tanpa ini, tidak ada acuan untuk implementasi `available_portions`, `reserveStock`, dan `setDailyStock`.
2. **F-LOG-01** + **SL-F-LOG-01** — spesifikasi lengkap fitur isi stok pagi termasuk kode error `STOCK_BELOW_COMMITTED` dan algoritma selisih movement.
3. **F-LOG-03** — spec tampilan sisa stok (satu rumus J-04, bukan kalkulasi sendiri).
4. **F-LOG-05** — spec toggle HABIS manual termasuk aturan reset harian = TIDAK (BR-127) dan daftar pengingat di layar.

**Peringatan khusus area 🔍 untuk logistik:**
- Rumus `available_portions` HARUS satu sumber di database (SQL 3.4); tidak boleh ada salinan di TypeScript (BR-071).
- Setiap aksi yang MENGURANGI ketersediaan wajib `FOR UPDATE` pada `stock_items` (BR-075); jika urutan kunci salah → deadlock.
- Movement `stock_movements` adalah ledger append-only; trigger database menolak UPDATE/DELETE (BR-078); test wajib membuktikan ini (J-06).
- Hari bisnis HANYA dihitung dari fungsi database `business_date(outlet_id)`; tidak dari zona waktu server (BR-090).

---

*Laporan ini dihasilkan secara read-only. Tidak ada berkas yang dimodifikasi.*
*Sumber: `project constitution/` — 11 berkas dibaca lengkap, 2 dibaca selektif.*
