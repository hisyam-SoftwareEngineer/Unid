# Review Kritis Dokumen Spesifikasi (Versi Baru vs Sudah Ada)

Repo: GTNIC-WEB · Tipe: READ-ONLY review · Reviewer: lintas-bidang (Product, Business Rules, Arsitektur, Permissions)
Versi BARU (direview): subfolder `folder yang baru ( perlu direview dan diabndingkan dengan yang sudah ada )/`
Versi SUDAH ADA (baseline): root repo `01-prd-master.md`, `02-actors-journeys-permissions.md`, `03-business-rules.md`, `OPEN-QUESTIONS.md`, `PROGRESS.md`
Acuan otoritas: `AGENTS.md` (tertinggi), `MVP.md`, `DEMO_PACK_v1.1_Amandemen.md`, `DEMO_PACK_v1.1_Jaminan_Database.md`, `SPEK_TECH_STACK_DAN_SETUP.md`, `rekomendasi_arsitektur.md`

Catatan metodologi: pernyataan "konsisten dengan J-xx" dibenarkan lewat pembacaan langsung `DEMO_PACK_v1.1_Jaminan_Database.md` (J-06 baris 61-66: TRUNCATE diblokir termasuk service role; J-10 baris 85-88: penghitung per (outlet, hari bisnis, jenis)). Klaim hosting `A-1` dicek terhadap `SPEK_TECH_STACK_DAN_SETUP.md`. Hal yang tidak dapat diverifikasi dari dokumen ditandai "perlu verifikasi manusia".

---

## 1. Ringkasan eksekutif

Versi BARU adalah **revisi 7 Nov 2026** yang menerapkan 25 keputusan manusia (Q-001..Q-025; Q-016 diubah dari Opsi A ke Opsi B). Versi SUDAH ADA di root adalah **dokumen 6 Nov 2026 pra-revisi** untuk 01/02/03, padahal `OPEN-QUESTIONS.md` dan `PROGRESS.md` di root sudah mencatat keputusan 7 Nov (dengan Q-016 = A). Artinya root berada dalam **campuran status**: tiga dokumen inti belum direvisi, dua dokumen pendukung sudah. Subfolder adalah kandidat pengganti yang konsisten secara internal.

Kesimpulan agregat: **versi BARU layak menggantikan versi lama secara keseluruhan, DENGAN DUA SYARAT**: (1) penggantian harus dilakukan sebagai **satu paket lengkap** (lima berkas sekaligus), bukan sebagian, karena root dan subfolder berbeda pada Q-016 (A vs B) sehingga penggantian sebagian menimbulkan kontradiksi; (2) tiga aturan bisnis (BR-016, BR-052 mekanisme, BR-128) bergantung pada pertanyaan terbuka yang menyentuh **kontrak beku** (Q-026/Q-028/Q-029) dan tidak boleh diperlakukan final oleh implementer sebelum keputusan manusia. Revisi memperkuat (bukan melemahkan) hampir semua aturan, menutup mayoritas celah, dan tetap konsisten dengan `AGENTS.md` dan `Jaminan Database`. Satu temuan yang naik ke REVISI WAJIB: `03-business-rules.md` melekatkan ambiguitas belum-terpecahkan ke dalam tubuh aturan (BR-016 bertanda "[BELUM PASTI]"), yang melanggar kontrak dokumen sendiri ("dapat diuji").

Verdikt agregat: **APPROVE DENGAN CATATAN** untuk paket secara keseluruhan; **REVISI WAJIB** untuk `03-business-rules.md` (satu poin); `01` dan `02` APPROVE DENGAN CATATAN; `OPEN-QUESTIONS` dan `PROGRESS` APPROVE DENGAN CATATAN.

---

## 2. Per file — tabel perubahan, verdikt, kritik/kelebihan

### 2.1 `01-prd-master.md`

| Aspek | Versi SUDAH ADA (root) | Versi BARU (subfolder) | Sifat |
|---|---|---|---|
| Header tanggal | "Disusun: 6 Nov 2026" | tambah "Direvisi: 7 Nov 2026 (keputusan Q-001..Q-025; Q-016 opsi B)" | Perbaikan |
| §1 Wedge | "belum divalidasi (Low confidence)" | "disetujui manusia sebagai arah kerja provisional (7 Nov 2026), belum divalidasi (Low confidence; G0 belum lolos)" | Perbaikan (jujur, konsisten MVP.md) |
| §2 tabel M | M-1..M-8 | tambah **M-9** (PBJT Malang 10% omzet ≥ Rp15 juta, Perda 1/2025), diletakkan **sebelum M-8** | Penambahan baik; urutan nomor tidak runtut (minor) |
| §2 Kekosongan data | "R1 Gelombang 3 belum ada" | "R1 Gelombang 3 sudah tersedia (data harga/tier kompetitor per 4 Nov 2026), data Malang tetap kosong" | Perbaikan (faktual) |
| §6 SHOULD | "Perpanjang +15 menit; kode unik manual_qris; polling adaptif" | tambah "hanya awaiting_verification atau awaiting_cash" + "takeaway lewat QR outlet khusus" | Perbaikan (Q-020 A, Q-021 A) |
| §6 Di luar cakupan | "pembatalan saat awaiting_verification (diusulkan, Q-003)" | "pembatalan oleh customer saat awaiting_verification (tidak diizinkan; Q-003 A)" | Perbaikan |
| §8 A-1 | "Keputusan 2 (usulan); batas dan ToS Hobby belum diverifikasi" | "Keputusan Q-007 A; [TERVERIFIKASI 4 Nov 2026 di Spesifikasi Tech Stack]; Hobby khusus non-komersial, 300 dtk; Supabase pause 1 minggu, tanpa backup" | Perbaikan mayor; label "[TERVERIFIKASI]" sedikit berlebih (lihat §4) |
| §8 A-6/A-7/A-8 | "perlu persetujuan" / "[HIPOTESIS]" / "[BELUM TERVERIFIKASI]" | mencantum "disetujui 7 Nov 2026 (Q-005 A / Q-006 A / Q-011 A)" | Perbaikan |
| §9 R-5/R-6 | "Q-001: ... (risiko)" / "Q-002: ... (risiko)" | "Q-001 A: ... (BR-120); Diputuskan 7 Nov 2026" / "Q-002 A: ... (BR-121)" | Perbaikan |
| §11 DoDD | "[ ] Keputusan 12 dan 14 disetujui; Q-001, Q-002, Q-003 dijawab" | "[x] ... (7 Nov 2026)"; tambah bullet "Penolakan bukti ... termasuk dengan foto yang sama (Q-016 B; mekanisme database menunggu Q-028)" | Perbaikan; bullet baru menambah dependensi Q-028 |
| §12 | "Pertanyaan terbuka yang memblokir PRD" (Q-001..Q-011) | "Pertanyaan terbuka": Q-001..Q-025 dijawab; Q-026..Q-029 terbuka | Perbaikan |

Verdikt: **APPROVE DENGAN CATATAN**.
- Kelebihan: label kejujuran (wedge provisional, PBJT dengan caveat "bunyi pasal belum dicek ke JDIH"), DoDD terbarui, A-1 jauh lebih konkret.
- Catatan: (a) A-1 berlabel "[TERVERIFIKASI]" padahal `SPEK_TECH_STACK_DAN_SETUP.md` masih menandai batas cron, batas body, dan ToS komersial Hobby sebagai "[BELUM TERVERIFIKASI]" — label agak berlebih, meski teks A-1 sendiri menyebut "konfirmasi manusia ... tetap diperlukan". (b) M-9 diletakkan sebelum M-8 (urutan nomor tidak runtut) — kosmetik. (c) DoDD kini memuat bullet yang bergantung pada Q-028 (mekanisme DB belum disetujui); pastikan Q-028 dijawab sebelum bullet itu bisa dicentang.

### 2.2 `02-actors-journeys-permissions.md`

| Aspek | Versi SUDAH ADA | Versi BARU | Sifat |
|---|---|---|---|
| Header | "Disusun 6 Nov 2026" | tambah "Direvisi 7 Nov 2026" | Perbaikan |
| 2.1 langkah 1 | scan QR meja | tambah "untuk bawa pulang memakai QR takeaway khusus outlet (Q-021)" | Perbaikan (Q-021 A) |
| 2.3 langkah 7 | "Gagal atau duplikat → PROOF_INVALID atau PROOF_DUPLICATE" | tambah "duplikat hanya bila hash sama sudah dipakai pada payment non-final atau paid (Q-016 B)" | Perbaikan |
| 2.5d | "Perpanjangan tak menyentuh reservasi → Q-001 🔍" | "hanya pada awaiting_verification atau awaiting_cash (Q-020); expires_at reservasi held ikut diperbarui, atomik, satu fungsi (Q-001 A)"; risiko bergeser ke "Salah mengatur urutan kunci saat memperbarui reservasi 🔍" | Perbaikan + evolusi risiko |
| 2.5e | "Batal saat awaiting_verification ambigu (Q-003)" | "Customer tidak boleh batal saat awaiting_verification; kasir memakai Tolak (Q-003 A)" | Perbaikan |
| 2.6 langkah 4 | "Menurunkan di bawah reservasi → ketersediaan negatif; tampil 0 (Q-019)" | "Penurunan di bawah reservasi held + terjual ditolak (Q-019 A; kode error: Q-027); tampilan 0 tetap jaring pengaman" | Perbaikan |
| 2.6 langkah 6 | "Berlaku sampai ditandai kembali (Q-019)" | "Berlaku sampai staf membukanya kembali; tidak ada reset harian (Q-019 A); usulan pengingat (Q-027)" | Perbaikan |
| 2.9 langkah 3 | "Customer memakai bukti yang sama: PROOF_DUPLICATE (Q-016)" | "Customer boleh memakai foto yang sama: bukti pada payment rejected tidak lagi memblokir (Q-016 B)" | Perbaikan (perilaku berubah) |
| §3 matriks "Membatalkan placed" | "Y, kecuali saat awaiting_verification (Q-003)" | "Y, kecuali saat awaiting_verification (tidak boleh; Q-003 A)" | Perbaikan |
| §3 "Melihat ledger" kasir | "Y (lihat; Q-018)" | "Y (hanya baca di /kasir; Q-018 A)" | Perbaikan |
| §3 "Yang TIDAK boleh customer" | "...hanya status tersedia/HABIS (Q-017)" | "...tanpa jumlah sisa (Q-017 A)" | Perbaikan |
| §3 "Sel ambigu" | 4 sel: Q-003, Q-017, Q-018 (ledger), Q-018 (walk-in) | 4 baris: 3 sudah "diputuskan", walk-in "Masih ambigu (Q-026)" | Perbaikan; judul "Sel ambigu" kurang tepat karena 3 sudah pasti (minor) |
| §4 Bukti duplikat | "Hash unik per outlet" | "Hash unik hanya di antara bukti pada payment non-final atau paid (Q-016 B)" | Perbaikan |

Verdikt: **APPROVE DENGAN CATATAN**.
- Kelebihan: perjalanan kini mencerminkan keputusan; risiko 2.5d jujur bergeser dari "celah belum ditutup" ke "risiko implementasi kunci".
- Catatan: (a) Q-026 (metode walk-in) masih "Masih ambigu" dan BR-016/02 menyiratkan "semua kecuali sandbox" secara harfiah — lihat §3/§5. (b) Judul "Sel ambigu" menyiratkan keempatnya masih terbuka padahal tiga sudah diputus — kosmetik. (c) Urutan kunci untuk pembaruan reservasi (BR-120) tidak disebut di BR-076 — lihat §3 Arsitektur.

### 2.3 `03-business-rules.md`

| Aspek | Versi SUDAH ADA | Versi BARU | Sifat |
|---|---|---|---|
| Header | "Disusun 6 Nov 2026" | tambah "Direvisi 7 Nov 2026" | Perbaikan |
| BR-007 | "Pajak dan biaya layanan harus 0 pada demo" | tambah catatan PBJT Malang 10% ≥ Rp15 juta (Perda 1/2025) relevan untuk pilot | Perbaikan (konteks) |
| BR-016 | "...service yang sama dengan createOrder customer, source = walk_in" | tambah "metode bayar boleh semua kecuali sandbox (teks Opsi A, Q-018)" + **"[BELUM PASTI: teks Opsi A dan rekomendasi Q-018 berbeda, lihat Q-026]"** | Penambahan ambiguitas (lihat §5) |
| BR-027 | "Validator boleh memperpanjang +15 menit maks 2×, diaudit" | tambah "hanya pada awaiting_verification atau awaiting_cash ... dan memperbarui reservasi (BR-120)" | Perbaikan (Q-020 A, Q-001 A) |
| BR-052 | "SHA-256 ... unik per outlet" | "unik per outlet **hanya di antara bukti milik payment non-final atau paid**; bukti payment rejected/expired/cancelled tidak memblokir; hash ditolak tetap tersimpan sebagai jejak" | Perbaikan (Q-016 B); mekanisme DB menunggu Q-028 |
| BR-077 | "opening ... nilai 0-999; businessDate hari ini atau +1" | tambah "tidak boleh di bawah jumlah reservasi held + terjual (ditolak; BR-126)" | Penguatan |
| BR-078 | "...tidak boleh diubah/dihapus; koreksi baris baru" | tambah "TRUNCATE harus diblokir lewat pemblokir di migrasi J-06 dan reset test memakai template database (BR-121)" | Penguatan (konsisten J-06) |
| BR-091 | "penghitung atomik per outlet dan hari bisnis" | "per (outlet, hari bisnis, jenis): dua penghitung terpisah A dan B (Q-025 A)" | Perbaikan (konsisten J-10) |
| BR-092 | "A-{n:03} dine-in, B-{n:03} takeaway; setelah 999 lanjut 4 digit" | tambah "urutan angka per jenis (BR-091)" | Perbaikan |
| BR-114 | "Aksi sensitif (verifikasi, tolak, perpanjang, tunai, expired_with_proof, aksi stok)" | "...tambah HABIS manual, pembatalan oleh staf, dan pesanan walk-in" | Penguatan (Q-023 A) |
| §10A baru | tidak ada | "Aturan tambahan dari keputusan 7 Nov 2026": BR-120..BR-129 | Penambahan mayor (menutup celah) |
| §11.1 transisi cancelled | "customer/kasir (ambigu pada awaiting_verification, Q-003)" | "customer tidak boleh membatalkan saat awaiting_verification, kasir memakai Tolak (Q-003 A, BR-122)" | Perbaikan |
| §12.1 TTL sandbox validator | "+15 menit, maks 2×" | "tidak (status pending; Q-020)" | Koreksi (sandbox tidak punya awaiting_verification) |
| §13 rantai | 9 rantai | 2 diperbarui: "Ditutup BR-120 (Q-001 A)" dan "Ditutup BR-052 revisi (Q-016 B); mekanisme Q-028" | Perbaikan |
| §14 Celah | 12 celah terbuka | 12 celah dengan kolom Status; 11 "Ditutup: BR-xxx", 1 "masih ambigu (Q-026)" | Perbaikan |
| §15 | "Q-020..Q-025 ditambahkan" | "Q-026..Q-029 ditambahkan; Q-020..Q-025 dijawab" | Perbaikan |

Verdikt: **REVISI WAJIB** (satu poin), selain itu APPROVE.
- Kelebihan kuat: tidak ada aturan yang dilemahkan; BR-077/078/027/091/114 diperkuat; BR-120..129 menutup celah; konsisten dengan J-06/J-10 (terverifikasi langsung di `Jaminan Database`); koreksi §12.1 sandbox (akurat — sandbox tidak punya status `awaiting_verification` sehingga tak ada perpanjangan validator, menyiratkan root salah mencantum "+15 menit").
- REVISI WAJIB: BR-016 kini memuat klausa "metode bayar boleh semua kecuali sandbox" yang ditandai "[BELUM PASTI]". Ini melanggar kontrak dokumen sendiri (header: "Semua pernyataan memakai 'harus' atau 'tidak boleh' dan **dapat diuji**"). Aturan yang "belum pasti" tidak dapat diuji. Rekomendasi konkret: hingga Q-026 dijawab, **hapus klausa metode bayar dari BR-016** dan biarkan BR-016 hanya menyatakan "walk-in dibuat lewat service yang sama, source = walk_in" (seperti versi lama), dengan metode bayar dirujuk ke Q-026 di `OPEN-QUESTIONS.md`. Alternatif: pindahkan klausa ke sub-bagian terpisah "Aturan provisional menunggu Q-026" di luar janji "dapat diuji".
- Catatan tambahan: BR-052 (mekanisme DB) dan BR-128 (tableToken wajib) bergantung pada Q-028/Q-029 yang mengubah **kontrak beku** (Skema, Jaminan DB, CreateOrderInput). Dokumen sudah jujur menandai ini, tetapi tambahkan penanda eksplisit "menunggu persetujuan manusia; jangan implementasikan sebelum Q-028/Q-029 disetujui" pada BR-052 dan BR-128 agar implementer tidak menganggap final.

### 2.4 `OPEN-QUESTIONS.md`

| Aspek | Versi SUDAH ADA | Versi BARU | Sifat |
|---|---|---|---|
| Q-001..Q-015 | DIJAWAB (Opsi A, 7 Nov 2026) | sama | sama |
| **Q-016** | "Keputusan manusia: **Opsi A** — disetujui 7 Nov 2026" | "Keputusan manusia: **Opsi B** — diubah dari A ke B oleh manusia, 7 Nov 2026" + konsekuensi Skema/Jaminan → Q-028 | **Perubahan keputusan (A→B)** |
| Q-017..Q-025 | DIJAWAB | sama (Q-017 A, Q-018 A, Q-019 A, Q-020 A, Q-021 A, Q-022 A, Q-023 A, Q-024 A, Q-025 A) | sama |
| Q-026..Q-029 | tidak ada | ditambahkan, Status TERBUKA, "Keputusan manusia:" kosong | Penambahan (konsisten) |
| "Usulan perubahan keputusan terkunci" | "Tidak ada yang diterapkan. Q-001 melengkapi..." | tambah "Yang berpotensi mengubah kontrak beku dan menunggu persetujuan: Q-028 (Skema dan Jaminan DB) dan Q-029 (tableToken wajib)" | Perbaikan (transparan) |

Verdikt: **APPROVE DENGAN CATATAN**.
- Kelebihan: menangkap kontradiksi internal Q-018 (teks Opsi A vs rekomendasi berbeda) sebagai Q-026; menandai Q-028/Q-029 sebagai penyentuh kontrak beku.
- Catatan KRITIS lintas-file: root `OPEN-QUESTIONS.md` masih menulis Q-016 = Opsi A, sedangkan subfolder menulis Opsi B. Karena Q-016 berubah, **root `OPEN-QUESTIONS.md` kini basahan (stale)**. Jika hanya sebagian berkas diganti, akan ada kontradiksi Q-016 A vs B. Kewajiban: ganti sebagai satu paket, atau perbarui root `OPEN-QUESTIONS.md` secara terpisah agar Q-016 = B.

### 2.5 `PROGRESS.md`

| Aspek | Versi SUDAH ADA | Versi BARU | Sifat |
|---|---|---|---|
| Header | "Diperbarui 7 Nov 2026 ... P1,P2,P3 DONE-MENUNGGU-REVIEW" | "P1,P2,P3 direvisi 7 Nov 2026 dan tetap DONE-MENUNGGU-REVIEW" | Perbaikan |
| Tabel A catatan P1 | "8 metrik, 12 risiko" | "8 metrik, 12 risiko; direvisi 7 Nov (Q-001..025, PBJT, wedge provisional)" | Perbaikan |
| Tabel A catatan P3 | "87 BR; Q-020..Q-025" | "87 BR + BR-120..BR-129 (bagian 10A); Q-020..Q-025 dijawab; direvisi 7 Nov" | Perbaikan (sedikit tak presis: beberapa BR lama juga direvisi, bukan hanya tambah) |
| Log E | 3 baris (sampai 7 Nov: wedge, 77%, PBJT) | tambah baris: "Seluruh Q-001..Q-025 dijawab; Q-016 → B; P1,P2,P3 direvisi; Q-026..Q-029; Q-028/Q-029 mengubah kontrak beku" | Perbaikan |
| Status | DONE-MENUNGGU-REVIEW (hanya manusia APPROVED) | tetap DONE-MENUNGGU-REVIEW | Konsisten AGENTS.md |

Verdikt: **APPROVE DENGAN CATATAN**.
- Kelebihan: status tidak naik menjadi APPROVED (benar — hanya manusia yang berhak, per AGENTS.md §1); log lengkap.
- Catatan: frasa "87 BR + BR-120..BR-129" menyiratkan hanya penambahan, padahal BR-007/016/027/052/077/078/091/092/114 juga **direvisi**. Sebaiknya tulis "87 BR direvisi/sebagian diperbarui + 10 aturan baru (BR-120..129)" agar akurat.

---

## 3. Temuan per domain

### 3.1 Product / PRD
- Temuan kritis: tidak ada. Cakupan MVP, metrik (MT-1..MT-8), non-goals, dan prinsip produk tidak berubah secara substantif; revisi hanya menyelaraskan keputusan.
- Temuan minor: (a) M-9 tidak runtut nomor (sebelum M-8). (b) A-1 berlabel "[TERVERIFIKASI]" padahal ToS komersial Hobby belum final di `SPEK_TECH_STACK`. (c) Terminologi tetap konsisten (order/bill/payment/menuItem); tidak ada istilah baru yang melanggar glosarium.
- Hal yang sudah baik: kejujuran wedge ("provisional, G0 belum lolos"), PBJT dengan caveat JDIH, DoDD terbarui, metrik tetap [HIPOTESIS] tanpa target dari pasar.

### 3.2 Business Rules / Domain Logic
- Temuan kritis: BR-016 menanam ambiguitas "[BELUM PASTI]" ke dalam tubuh aturan (lihat §5 REVISI-1). Ini satu-satunya aturan yang melanggar janji "dapat diuji".
- Temuan kritis (ringan): BR-052 (mekanisme) dan BR-128 (tableToken wajib) bergantung pada Q-028/Q-029 yang mengubah kontrak beku. Dokumen jujur, tetapi perlu penanda eksplisit "jangan implementasikan sebelum disetujui".
- Temuan minor: BR-076 (urutan kunci global: idempotensi advisory → tables → payments → stock_items → daily_counters) **tidak menyebut baris reservasi**, padahal BR-120 kini mewajibkan pembaruan `expires_at` reservasi secara atomik bersama payment. Urutan kunci untuk reservasi tidak dispesifikasikan; 02 §2.5d sudah menandai 🔍, tetapi BR-076 sebaiknya diperluas (atau diberi catatan) agar deadlock terprofil.
- Verifikasi aturan inti terhadap AGENTS.md: uang integer (BR-002 ✓), total server (BR-001 ✓), gerbang antrean tunggal releaseToQueue (BR-011 ✓), paid hanya via confirmPayment (BR-020 + aturan lint ✓), businessDate YYYY-MM-DD tanpa zona waktu server (BR-090 ✓), AppError berkode (BR katalog ✓). Tidak ada yang dilemahkan.
- Verifikasi terhadap `Jaminan Database`: BR-121 (TRUNCATE) konsisten dengan J-06 baris 61-66 ("termasuk service role"; "truncate ikut diblokir"); BR-091 (dua penghitung per jenis) konsisten dengan J-10 baris 85-88 ("per (outlet, hari bisnis, jenis)"). BR-074 (satu consume per reservasi) konsisten J-06. BR-094 (unik per outlet/hari/kode) konsisten J-10.
- Hal yang sudah baik: §12.1 sandbox diperbaiki (tidak ada perpanjangan validator untuk `pending`); semua celah §14 diberi status penutupan; rantai ketergantungan §13 diperbarui; BR-126/127/128/129 menutup Q-019/Q-021/Q-024.

### 3.3 Arsitektur / Teknis
- Temuan kritis: tidak ada. Revisi tidak menyiratkan pelanggaran arah dependensi (app/api → services → db; client/components → contracts). Endpoint tetap Route Handler (`/api/cron/expire`, `proof/init`, `proof/finalize`, `createOrder`), bukan Server Action. Prisma tetap di services/db.
- Temuan minor: BR-120 "satu fungsi" untuk perpanjangan payment+reservasi konsisten dengan prinsip "satu pintu per aturan" (AGENTS.md §3), tetapi urutan kunci (BR-076) perlu menyertakan reservasi (lihat 3.2).
- Hal yang sudah baik: A-1 kini mengacu ke `SPEK_TECH_STACK` (bukan `rekomendasi_arsitektur`) untuk klaim terverifikasi — sumber yang benar karena `SPEK_TECH_STACK` memuat label [TERVERIFIKASI 4 Nov 2026]; env dipisah per lingkungan konsisten dengan `SPEK_TECH_STACK` §4.

### 3.4 Actors / Journeys / Permissions
- Temuan kritis: tidak ada celah otorisasi baru. Pemisahan tugas (logistik tidak lihat payments/orders; kasir tidak lihat audit_logs; hanya pemilik lihat audit_logs) dipertahankan (BR-112). Capability URL (orderId + cookie sid) dipertahankan (BR-105, BR-057).
- Temuan minor (Q-026): metode bayar walk-in belum final. Matriks §3 menyebut walk-in "Y (walk-in)" tanpa membatasi metode; 02 §2.5 tidak menyebut metode walk-in; BR-016 menyiratkan "semua kecuali sandbox". Jika akhirnya "tunai dan manual_qris" (rekomendasi Q-018), maka BR-016 dan narasi perlu disesuaikan. Risiko keamanan: bila sandbox bocor ke walk-in, kasir bisa "membayar" pesanan tanpa uang — namun BR-033 (`env.ts` menolak boot production+sandbox) menjadi jaring terakhir. Tetap, batas di lapis BR lebih aman.
- Hal yang sudah baik: Q-003 A (customer tidak batal saat awaiting_verification), Q-017 A (tanpa jumlah sisa), Q-018 A (kasir lihat ledger read-only di /kasir), Q-021 A (takeaway lewat QR khusus) — semuanya terimplementasi di matriks dan perjalanan.

---

## 4. Inkonsistensi lintas-file & konflik dengan AGENTS.md / dokumen acuan

1. **Q-016 A vs B (paling penting):** root `OPEN-QUESTIONS.md` Q-016 = Opsi A; subfolder Q-016 = Opsi B ("diubah dari A ke B"). Root kini basahan. Wajib ganti sebagai satu paket atau perbarui root.
2. **Status root campuran:** root 01/02/03 pra-revisi (6 Nov), root OPEN-QUESTIONS/PROGRESS pasca-keputusan (7 Nov). Subfolder konsisten penuh pasca-revisi. Pemilihan subfolder sebagai sumber kebenaran menyelesaikan ketegangan ini.
3. **A-1 "[TERVERIFIKASI]" vs `SPEK_TECH_STACK`:** A-1 mengklaim terverifikasi, tetapi `SPEK_TECH_STACK` §5 dan §7 butir 5-6 masih menandai batas cron Hobby, batas body, ToS komersial, dan interval workflow GitHub sebagai [BELUM TERVERIFIKASI]. A-1 sendiri menulis "konfirmasi manusia ... tetap diperlukan", jadi tidak fatal, tetapi label "[TERVERIFIKASI]" menyesatkan pembaca cepat.
4. **BR-016 vs matriks 02:** BR-016 menyiratkan "semua kecuali sandbox" untuk walk-in; 02 §3 matriks walk-in tidak membatasi metode; 02 §2.5 tidak menyebut metode walk-in. Tidak kontradiksi formal, tetapi tidak ada satu pun yang menegaskan keputusan final (karena Q-026 terbuka).
5. **Tidak ada konflik dengan AGENTS.md:** aturan kerja inti (uang integer, satu pintu, paid via confirmPayment, businessDate DB, mutasi via Route Handler, layar tipis, satu berkas service satu fungsi, identifier Inggris/teks Indonesia) semuanya dipertahankan. Revisi bahkan memperkuat penegakan (BR-121 eksplisit menyebut migrasi J-06).
6. **Tidak ada konflik dengan `MVP.md`:** status wedge "provisional, G0 belum lolos" sama; PBJT Rp15 juta sama; empat PaymentProvider (sandbox/manual_qris/transfer_proof/cash) sama.

---

## 5. Daftar REVISI WAJIB (prioritas tinggi) + rekomendasi konkret

**REVISI-1 (03-business-rules, BR-016) — Hapus klausa ambigu dari tubuh aturan.**
Masalah: BR-016 kini berbunyi "...metode bayar boleh semua kecuali sandbox (teks Opsi A, Q-018)" dengan penanda "[BELUM PASTI]", melanggar janji dokumen bahwa setiap aturan "dapat diuji".
Rekomendasi: kembalikan BR-016 ke "Pesanan walk-in harus dibuat oleh kasir atau pemilik lewat service yang sama dengan createOrder customer, dengan source = walk_in" (tanpa klausa metode). Pindahkan ketidakpastian metode bayar ke `OPEN-QUESTIONS.md` Q-026 dan ke catatan modul KAS (P2/02), bukan ke katalog aturan uji. Setelah Q-026 dijawab, baru tambahkan BR baru (mis. BR-130) yang menyatakan metode walk-in secara definitif.

**REVISI-2 (03-business-rules, BR-052 & BR-128) — Tandai dependensi kontrak beku secara eksplisit.**
Masalah: BR-052 menyatakan aturan keunikan hash (Q-016 B) yang **mengubah Skema dan Jaminan DB** (Q-028 terbuka); BR-128 menyatakan takeaway lewat QR khusus yang **mengubah CreateOrderInput** (tableToken wajib, Q-029 terbuka). Keduanya menyentuh kontrak beku yang menurut AGENTS.md §1 tidak boleh diubah tanpa persetujuan manusia.
Rekomendasi: tambahkan penanda pada BR-052 dan BR-128: "⚠ Menunggu Q-028/Q-029 (kontrak beku); jangan implementasikan sebelum disetujui manusia." Ini mencegah implementer/AI menganggap aturan final dan mengubah `schema.prisma`/`server/contracts/*` tanpa persetujuan.

**(Opsional, ringan) REVISI-3 (03-business-rules, BR-076) — Perluas urutan kunci untuk reservasi.**
Masalah: BR-120 memperbarui `expires_at` reservasi atomik dengan payment, tetapi BR-076 (urutan kunci global) tidak menyebut baris reservasi, berisiko deadlock (02 §2.5d sudah menandai 🔍).
Rekomendasi: tambahkan posisi reservasi dalam urutan kunci BR-076 (mis. setelah payments, sebelum stock_items), atau catat bahwa pembaruan reservasi memakai kunci yang sama dengan payment-nya.

---

## 6. Daftar pertanyaan / ambiguitas yang perlu keputusan manusia

1. **Q-026 (metode walk-in)** — teks Opsi A ("semua kecuali sandbox") vs rekomendasi ("tunai dan manual_qris"). Rekomendasi reviewer: ikuti rekomendasi (tunai dan manual_qris) karena walk-in terjadi di depan kasir; transfer_proof dengan bukti foto tidak diperlukan dan menambah permukaan penipuan tanpa manfaat. Keputusan ini juga menentukan isi BR-016 final (REVISI-1).
2. **Q-028 (mekanisme keunikan hash bukti)** — merekomendasikan Opsi A (penanda "aktif" + keunikan pada baris aktif, dijamin DB), karena aturan uang dijamin database (keputusan terkunci); Opsi B (cek di kode) rawan balapan unggah paralel. Mengubah Skema + Jaminan DB + manifest T-00 — butuh persetujuan.
3. **Q-029 (batas per meja takeaway + tableToken wajib)** — menentukan apakah satu QR takeaway berbagi batas untuk semua pelanggan (terlalu ketat) atau beberapa QR per loket. Opsi A (batas sendiri berbasis sid, tableToken wajib) direkomendasikan. Mengubah CreateOrderInput (kontrak beku) — butuh persetujuan.
4. **Q-027 (kode error penurunan opening + pengingat HABIS manual)** — merekomendasikan Opsi A (`STOCK_BELOW_COMMITTED` 422 + daftar menu masih HABIS di layar isi stok). Bukan kontrak beku; bisa diselesaikan cepat.
5. **Penggantian berkas** — keputusan proses: apakah subfolder menggantikan root sebagai **satu paket lengkap**? (Direkomendasikan ya, untuk menghindari kontradiksi Q-016 A/B.)

---

## 7. Verdikt akhir per file

| File | Verdikt | Alasan (1 baris) |
|---|---|---|
| `01-prd-master.md` | APPROVE DENGAN CATATAN | Revisi menyelaraskan keputusan dan jujur; perbaikan A-1/M-9/DoDD; catatan kecil pada label "[TERVERIFIKASI]" dan urutan M-9. |
| `02-actors-journeys-permissions.md` | APPROVE DENGAN CATATAN | Perjalanan dan matriks kini mencerminkan keputusan; Q-026 walk-in terbawa sebagai ambiguitas; judul "Sel ambigu" sedikit usang. |
| `03-business-rules.md` | REVISI WAJIB | BR-016 "[BELUM PASTI]" melanggar janji "dapat diuji"; BR-052/BR-128 bergantung kontrak beku terbuka — butuh penanda eksplisit. |
| `OPEN-QUESTIONS.md` | APPROVE DENGAN CATATAN | Menangkap kontradiksi Q-018 sebagai Q-026 dan menandai Q-028/Q-029; root basahan (Q-016=A) wajib disinkronkan. |
| `PROGRESS.md` | APPROVE DENGAN CATATAN | Status tidak naik ke APPROVED (benar); log lengkap; frasa "87 BR + ..." sedikit tak presis soal revisi vs tambah. |

Catatan akhir: seluruh kritik di atas dapat ditindaklanjuti tanpa mengubah keputusan terkunci; REVISI-1 dan REVISI-2 bersifat penyempurnaan dokumen, bukan perubahan aturan bisnis. Tidak ada area yang dilaporkan "aman"; yang dilaporkan adalah konsistensi terverifikasi terhadap `AGENTS.md`, `Jaminan Database` (J-06/J-10), dan `SPEK_TECH_STACK`. Batas cron/ToS Hobby, bunyi pasal PBJT di JDIH, dan ketersediaan pg_cron tetap "perlu verifikasi manusia" sesuai penanda sumber.
