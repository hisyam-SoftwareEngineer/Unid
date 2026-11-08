# 03 Katalog Aturan Bisnis

Status: DONE-MENUNGGU-REVIEW · Disusun: 6 Nov 2026 · Direvisi: 7 Nov 2026 (keputusan Q-001..Q-025; Q-016 opsi B) · Prompt: P3 · Prasyarat: P1
Label: [FAKTA] ada di sumber · [HIPOTESIS] belum diuji · [ASUMSI] perlu konfirmasi · 🔍 area wajib review manusia.
Singkatan sumber: DP1 = Demo Pack v1; AM = Amandemen v1.1; JD = Jaminan Database v1.1 (J-xx); BS = brainstorm Tahap 0; AG = AGENTS.md.
Modul pemilik: ORD pesanan dan antrean · PAY pembayaran · KAS kasir · STK stok dan logistik · ACC akses dan autentikasi · PLT platform.
Hierarki bila bertentangan: JD, AM, DP1, AG, riset. Konflik yang ditemukan tercatat di bagian 8 dan `OPEN-QUESTIONS.md`.

Semua pernyataan memakai "harus" atau "tidak boleh" dan dapat diuji. Contoh angka konkret bersifat ilustrasi, bukan data pasar.

---

## 1. Harga dan tagihan

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-001 | Harga, diskon, dan total harus dihitung server dari harga di database lewat `calculateBill`; klien tidak boleh mengirim harga atau total | Mencegah manipulasi harga | AM 0, 4; BS 6.3 | | ORD | Customer mengubah harga di klien jadi Rp1; server tetap menagih Rp25.000 |
| BR-002 | Uang harus bilangan bulat Rupiah, tanpa desimal | Menghindari galat pembulatan | BS 6.3; AM 4 (`rupiah` int) | | ORD | Rp24.983, bukan Rp24.983,5 |
| BR-003 | Tidak boleh ada surcharge atau biaya QRIS yang ditambahkan ke total customer | MDR ditanggung merchant [FAKTA] | BS 3.4c, 6.4 | | PAY | Total Rp25.000 tetap tagihan maksimal customer; tidak ada "biaya QRIS Rp175" |
| BR-004 | Total tagihan harus sama di layar customer, layar kasir, dan data (`bill.total`) | Menghindari sengketa | DP1 8 | | ORD | Item 2 × Rp12.500 + varian +Rp2.000 menghasilkan Rp27.000 di semua layar |
| BR-005 | Item pesanan harus menyimpan snapshot nama dan harga saat dibuat | Perubahan harga tidak mengubah pesanan lama | DP1 3 (`orderItem` snapshot) | | ORD | Harga naik dari Rp12.000 ke Rp13.000 setelah dipesan; tagihan tetap Rp12.000 |
| BR-006 | Menu dengan `isActive = false` atau `manualSoldOut = true` tidak boleh dipesan | Menjaga ketersediaan yang jujur | AM 5.1 langkah 3 | | ORD | Menu ditandai HABIS manual; `createOrder` ditolak |
| BR-007 | Pajak dan biaya layanan harus bernilai 0 pada demo | Di luar cakupan demo. Catatan: PBJT makanan dan minuman Kota Malang 10% untuk omzet ≥ Rp15 juta per bulan (Perda 1/2025, berlaku 18 Jun 2025) [FAKTA dari sumber sekunder kuat; bunyi pasal perlu dicek ke JDIH]; relevan untuk outlet pilot, bukan demo | DP1 2; OPEN-QUESTIONS Q-008 | | ORD | `taxTotal = 0`, `serviceTotal = 0` [kolom ada] |
| BR-008 | Pada pay_first, satu bill hanya boleh punya satu order; bill dibuat dengan status `open` lalu `awaiting_payment` saat payment dibuat | Satu unit pembayaran per pesanan | DP1 5.3; BS 6.1 | | ORD | Pesanan kedua dari meja yang sama menghasilkan bill kedua |
| BR-009 | Jumlah baris `qty` per item harus 1 sampai 10; total porsi per pesanan tidak boleh lebih dari 30; item per pesanan 1 sampai 30; catatan ≤ 140 karakter; nama customer ≤ 40 karakter | Membatasi penyalahgunaan QR statis | AM 4, 5.10 | | ORD | Pesanan 31 porsi ditolak dengan pesan "Maksimal 30 porsi per pesanan" |

## 2. Pesanan dan antrean

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-010 | Setiap order harus milik tepat satu bill | Satu unit pembayaran | BS 6.1 | J-08 | ORD | Order tanpa `billId` ditolak |
| BR-011 | Order hanya boleh berpindah dari `placed` ke `queued` lewat `releaseToQueue`, bila `paymentTiming = pay_after` atau `bill.status = paid`; demo hanya pay_first | Satu titik gerbang | DP1 5.1; AM 0 | | ORD | Bill belum `paid`: order tetap `placed` |
| BR-012 | Status order harus maju berurutan `queued → preparing → ready → completed`; loncat status tidak boleh | Kontrol operasional | DP1 5.4; AM 4 | | KAS | `queued → ready` ditolak |
| BR-013 | Order tidak boleh dibatalkan setelah `queued` | Stok sudah terpakai; void ditunda | AM 1 (kep. 14), 5.7 | | ORD | Kasir menekan batal pada order `preparing`: ditolak |
| BR-014 | Pembatalan order `placed` oleh customer atau kasir harus mengubah dalam satu transaksi: payment `cancelled`, reservasi `released`, order `cancelled`, bill `void` | Tidak ada keadaan setengah jadi | AM 5.7 | | ORD | Order `placed` dibatalkan: porsi kembali tersedia |
| BR-015 | Metode bayar pada pesanan yang sudah dibuat tidak boleh diganti; customer harus membatalkan lalu memesan ulang | Menyederhanakan state | AM 1 (kep. 14), 5.7 | | ORD | Keranjang tersimpan di klien untuk pesan ulang |
| BR-016 | Pesanan walk-in harus dibuat oleh kasir atau pemilik lewat service yang sama dengan `createOrder` customer, dengan `source = walk_in`, dan metode bayar hanya `cash` atau `manual_qris` (Q-026 B) | Satu logika harga, stok, bill | DP1 7 (D-11); AM 7; Q-018; Q-026 (B) | | KAS | Meja kosong atau takeaway; `tableId` null. Bukti transfer tidak diizinkan untuk walk-in |
| BR-017 | Jenis pesanan harus `dine_in` atau `takeaway`; jenis menentukan awalan kode pesanan | Membedakan antrean | AM 4, 5.5 | | ORD | dine-in A-042, takeaway B-007 |
| BR-018 | `createOrder` dengan `idempotencyKey` sama dan `requestHash` sama harus mengembalikan hasil lama (200); hash berbeda harus menghasilkan `IDEMPOTENCY_CONFLICT` 409 | Klik ganda dan jaringan buruk | AM 5.1 | J-12 | ORD | Customer klik Pesan dua kali: satu pesanan |

## 3. Pembayaran dan TTL

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-020 | Hanya `confirmPayment` yang boleh menulis status `paid`; lint melarang `status: "paid"` di luar berkas itu | Satu pintu uang 🔍 | AM 0, 5.3 | | PAY | Sandbox, validator, dan tunai semuanya memanggil fungsi yang sama |
| BR-021 | Satu bill hanya boleh punya satu payment non-final pada satu waktu | Mencegah bayar ganda | DP1 5.2 | | PAY | Payment kedua pada bill yang masih `pending` ditolak |
| BR-022 | Payment berstatus final (`paid`, `rejected`, `expired`, `cancelled`) tidak boleh berubah status | Menjaga catatan | DP1 5.2; JD J-07 | J-07 | PAY | `paid → rejected` ditolak, termasuk lewat SQL langsung |
| BR-023 | Metode bayar harus salah satu: `sandbox`, `manual_qris`, `transfer_proof`, `cash` | Keputusan 3 | DP1 0 | | PAY | Metode lain ditolak Zod |
| BR-024 | TTL awal harus: sandbox 10 menit, manual_qris 10 menit, transfer_proof 15 menit, cash 20 menit | Keputusan 8 | DP1 0; AM 5.6 | | PAY | Pesanan 10:00 manual_qris kedaluwarsa 10:10 |
| BR-025 | Saat customer menekan "Sudah bayar" pada manual_qris, `expiresAt` harus menjadi `max(expiresAt, sekarang + 15 menit)` sekali saja | Menutup celah klaim di menit ke-9 | AM 5.6 | | PAY | Klaim 10:09: `expiresAt` menjadi 10:24 |
| BR-026 | Setelah finalize bukti transfer, `expiresAt` harus menjadi `sekarang + 30 menit` sekali saja [HIPOTESIS] | Memberi waktu validator | AM 5.6; DP1 ADR-0004 | | PAY | Finalize 10:12: `expiresAt` 10:42 |
| BR-027 | Validator boleh memperpanjang +15 menit paling banyak 2 kali (`holdExtensions`) hanya pada payment berstatus `awaiting_verification` atau `awaiting_cash`, dan setiap perpanjangan harus diaudit dan memperbarui reservasi (BR-120) | Validator lambat | AM 5.6; Q-020 (A) | | KAS | Perpanjangan ketiga ditolak; perpanjangan pada payment `pending` ditolak |
| BR-028 | `confirmPayment` harus menolak dengan `PAYMENT_EXPIRED` bila `expiresAt` payment sudah lewat | Stok mungkin sudah dilepas | AM 5.3 | | PAY | Valid pada 10:43 untuk `expiresAt` 10:42 ditolak; audit `payment.expired_with_proof` bila ada bukti |
| BR-029 | `confirmPayment` pada payment yang sudah `paid` harus mengembalikan `replay: true` tanpa efek ganda | Klik ganda aman | AM 5.3 | | PAY | Dua klik Valid: satu `consume` per reservasi |
| BR-030 | Valid pada non-tunai harus disertai kotak "Sudah cocok dengan mutasi" dan `mutationAmount` sama dengan `payment.amount`; bila tidak sama harus `AMOUNT_MISMATCH` 422 | Kontrol utama lawan bukti palsu 🔍 | DP1 ADR-0004; AM 4 | | KAS | Amount Rp24.983, input Rp25.000: ditolak |
| BR-031 | Tolak harus mengisi alasan (≤ 140 karakter) | Customer berhak tahu | AM 4 | | KAS | Alasan kosong: validasi gagal |
| BR-032 | Payment `rejected` harus membuat dalam satu transaksi: reservasi `released`, order `cancelled`, bill `void`; customer memesan ulang | Keputusan 15 | AM 1, 5.7 | | PAY | Tolak: porsi kembali tersedia |
| BR-033 | Endpoint sandbox harus 404 dan banner SIMULASI hilang bila `PAYMENT_SANDBOX_ENABLED` nonaktif; `env.ts` harus menolak boot bila `APP_ENV=production` dan sandbox aktif | Mencegah "uang palsu" di produksi 🔍 | AM 5.12 | | PLT | `APP_ENV=production` + sandbox on: aplikasi gagal start |
| BR-034 | Status efektif harus dihitung saat dibaca (non-final dengan `expiresAt` lewat menjadi `expired`); jalur baca tidak boleh menulis | Kebenaran tanpa job | AM 5.8 | | PLT | Customer melihat `expired` padahal sweeper mati |
| BR-035 | Sweeper harus mengubah dalam satu transaksi per baris: payment `expired`, reservasi `released`, order `expired`, bill `void`, audit; memproses paling banyak 50 baris `FOR UPDATE SKIP LOCKED` | Merapikan data | AM 5.8 | | PLT | Dua sweeper bersamaan tidak memproses baris yang sama |

## 4. Kode unik

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-040 | Kode unik harus berupa potongan 1 sampai 99 Rupiah yang mengurangi `payment.amount`; tidak boleh menambah yang dibayar customer, tidak masuk `discountTotal`, dan `bill.total` tidak berubah | Koreksi ADR-0004 | DP1 ADR-0004; AM 5.4 | | PAY | Total Rp25.000, potongan Rp17, bayar Rp24.983 |
| BR-041 | Kode unik harus berlaku hanya untuk `transfer_proof` dan `manual_qris`; kode harus 0 bila total < Rp1.000 atau `TRANSFER_UNIQUE_CODE=off` | Keputusan 13 [HIPOTESIS] | AM 1, 5.4 | | PAY | Total Rp900: kode 0 |
| BR-042 | Pemilihan kode harus acak dari 1-99 sehingga `total - d` tidak dipakai payment aktif atau payment berumur < 24 jam; bila 99 slot habis harus `SYSTEM_BUSY` 503 | Menghindari ambiguitas pencocokan mutasi | AM 5.4 | | PAY | Dua customer Rp25.000 bersamaan: Rp24.983 dan Rp24.941 |
| BR-043 | Database harus menolak dua payment aktif (`pending` atau `awaiting_verification`) dengan `amount` sama dalam satu outlet bila keduanya `unique_code_discount > 0`; payment kode 0, `awaiting_cash`, dan final tidak membatasi | Jaring pengaman paralel | JD J-05 | J-05 | PAY | 100 pembuatan paralel menghasilkan 100 nominal berbeda |
| BR-044 | Bila terjadi pelanggaran unik (P2002), pemilihan kode harus dihitung ulang pada percobaan berikutnya | Race | AM 5.1 | J-05 | PAY | Retry maks 3× |
| BR-045 | UI harus menampilkan teks "Bayar tepat Rp… (potongan kode unik Rp…). Nominal harus persis agar dikenali." pada metode berkode | Transparan ke customer | AM 5.4 | | PAY | Teks tampil bersama nominal |

## 5. Bukti transfer

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-050 | Bukti transfer harus diperlakukan sebagai klaim; order tidak boleh masuk antrean sebelum payment `paid` | Keputusan terkunci Tahap 0 | DP1 ADR-0004 | | PAY | Bukti terunggah, belum divalidasi: order tetap `placed` |
| BR-051 | Hanya JPEG atau PNG, ukuran ≤ 2 MB; tipe harus ditentukan server dari magic bytes (`FF D8 FF`; `89 50 4E 47 0D 0A 1A 0A`), bukan klaim klien | Mencegah file berbahaya | AM 5.9; JD J-11 | J-11 | PAY | File .exe berekstensi .jpg: `PROOF_INVALID` |
| BR-052 | SHA-256 bukti harus dihitung di server dan unik per outlet **hanya di antara bukti aktif milik payment non-final atau `paid`**; bukti milik payment `rejected`, `expired`, atau `cancelled` tidak boleh memblokir unggahan baru. Bukti yang ditolak tetap tersimpan sebagai jejak. Mekanisme: kolom `is_active` (default true) + partial unique index `ON (outlet_id, sha256) WHERE is_active = true`; transisi final payment (`rejected`, `expired`, `cancelled`) mematikan `is_active` dalam transaksi yang sama, dijamin database (Q-028 A) 🔍 | Anti-pakai-ulang file identik (bukan anti-pemalsuan) tanpa menghukum customer sah yang ditolak karena kesalahan validator | AM ADR-0004, Skema; Q-016 (B); Q-028 (A) | | PAY | Foto sama diunggah dua kali pada dua payment aktif: `PROOF_DUPLICATE`. Foto yang pernah ditolak diunggah di pesanan baru: diterima. Keputusan Q-028 A disetujui 7 Nov 2026; mengubah Skema + Jaminan DB — implementasi via task D-xx terpisah dengan persetujuan, bukan otomatis |
| BR-053 | Bucket `payment-proofs` harus privat tanpa policy anon atau authenticated; akses hanya lewat service role di server dengan signed URL 60 detik, dibuat saat item dibuka, hanya untuk kasir atau pemilik | Privasi dan kontrol 🔍 | JD J-11; AM 5.9 | J-11 | PAY | Unduh langsung oleh staf tanpa signed URL ditolak |
| BR-054 | Unggah harus dua tahap: `proof/init` lalu `proof/finalize`; klien tidak boleh mengirim mime, ukuran, atau hash | Server sebagai sumber kebenaran | AM 4, 5.9 | | PAY | Body `proof/finalize` hanya `paymentId` dan `objectPath` |
| BR-055 | Path objek harus `{outletId}/{paymentId}/{uuid}.jpg` | Terstruktur per outlet | AM 5.9 | | PAY | Path di luar pola ditolak |
| BR-056 | Klien harus mengompres bukti sebelum unggah (sisi maks 1600 px, JPEG kualitas 0,8) | Foto HP sering > 2 MB | AM 5.9 | | PAY | Foto 4 MB menjadi < 500 KB |
| BR-057 | Hanya pemegang `orderId` dengan cookie `sid` yang cocok boleh mengunggah bukti atau menekan "Sudah bayar" untuk pesanan itu | Mencegah serangan ke pesanan orang lain 🔍 | AM 5.9, 5.10 | | ACC | Cookie lain: ditolak |
| BR-058 | Pada kegagalan atau duplikat, objek Storage harus dihapus | Tidak ada sisa file | AM 5.9 | | PAY | Objek tidak tertinggal di bucket |

## 6. Tunai

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-060 | Payment tunai harus berstatus `awaiting_cash` sejak dibuat dengan TTL 20 menit; kode pesanan harus ditampilkan besar di layar customer | Customer menyebut kode di kasir | DP1 5.2, 5.6 | | PAY | Kode A-042 tampil besar |
| BR-061 | `amountReceived` harus ≥ `payment.amount`; kembalian harus dihitung server | Hindari salah hitung 🔍 | DP1 5.2, 7 (D-09) | | KAS | Amount Rp25.000, diterima Rp30.000, kembalian Rp5.000 |
| BR-062 | Tidak boleh ada lebih dari 1 order tunai aktif per meja | Batas penyalahgunaan QR | AM 5.10 | | ORD | Pesanan tunai kedua dari meja yang sama ditolak |
| BR-063 | Pembayaran tunai tidak memakai kode unik | Tidak ada mutasi untuk dicocokkan | AM 5.4; JD J-05 | J-05 | PAY | `unique_code_discount = 0` |

## 7. Stok dan reservasi

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-070 | `reserveStock` harus dipanggil di dalam `createOrder`; menu tanpa `stockItem` dianggap tak terbatas | Anti-oversell | AM 5.1, 5.2 | | STK | Menu Es Teh tanpa stok: selalu bisa dipesan |
| BR-071 | Ketersediaan harus dihitung dengan satu rumus di database (J-04): jumlah movement hari bisnis itu dikurangi jumlah reservasi `held` yang `expires_at`-nya di masa depan pada hari bisnis itu; tidak boleh ada salinan rumus di kode aplikasi | Kebenaran stok 🔍 | JD J-04 | J-04 | STK | Opening 10, 3 terjual, 2 held aktif: tersedia 5 |
| BR-072 | Ketersediaan negatif harus ditampilkan 0 atau HABIS | Menghindari angka aneh | AM 5.2 | | STK | −1 tampil 0 |
| BR-073 | Reservasi `held` harus berubah menjadi `confirmed` dengan satu movement `consume` bertanda negatif saat payment `paid`; menjadi `released` tanpa movement saat payment rejected, expired, atau cancelled | Ledger mencatat yang terjual | DP1 5.5; AM 5.3 | | STK | Dibayar: `consume −2` |
| BR-074 | Satu reservasi paling banyak menghasilkan satu movement `consume` (dijamin database) | Anti-ganda | JD J-06 | J-06 | STK | Dua `consume` untuk satu reservasi ditolak |
| BR-075 | Aksi yang mengurangi ketersediaan (reservasi baru, `opening` diturunkan) harus mengunci baris `stock_items` yang sama; yang menambah (release, expire) tidak | Anti-oversell paralel 🔍 | AM 5.2 | | STK | Dua pesanan paralel untuk porsi terakhir: satu berhasil |
| BR-076 | Urutan kunci global harus: idempotensi advisory → tables → payments → stock_reservations → stock_items (urut id) → daily_counters; baris reservasi dikunci setelah payment karena BR-120 memperbarui `expires_at` reservasi atomik dengan transisi payment | Mencegah deadlock 🔍 | AM 0; BR-120 | | PLT | Semua jalur mengikuti urutan ini; reservasi dikunci bersama transisi payment |
| BR-077 | `opening` harus ditulis sebagai satu movement bertanda selisih terhadap saldo hari itu; nilai porsi 0 sampai 999 dan tidak boleh di bawah jumlah reservasi `held` ditambah terjual hari itu (ditolak; BR-126); `businessDate` hanya hari bisnis ini atau +1 | Ledger append-only | DP1 3 (catatan), AM 4; Q-019 (A) | J-06 | STK | Saldo 10, diisi 8: movement `−2` |
| BR-078 | Movement stok dan baris audit tidak boleh diubah atau dihapus oleh siapa pun, termasuk service role; koreksi hanya dengan baris baru; TRUNCATE harus diblokir lewat pemblokir di migrasi J-06 dan reset test memakai template database (BR-121) | Jejak tak terhapus 🔍 | JD J-06; Q-002 (A) | J-06 | STK | UPDATE, DELETE, TRUNCATE ditolak |
| BR-079 | "Salin stok kemarin" harus mengisi formulir dari total `opening` kemarin, bukan dari sisa; nilai dapat diubah | Mempercepat input | DP1 3 | | STK | Opening kemarin 20, terjual 18, sisa 2: formulir terisi 20 |
| BR-080 | Movement `consume` harus memakai `order.businessDate` | Konsistensi hari | AM 5.5 | J-09 | STK | Order 02:30 (sebelum cutoff 03:00) memakai hari kemarin |
| BR-081 | Reservasi hari bisnis lain tidak boleh mengurangi stok hari ini | Isolasi hari | JD J-04 | J-04 | STK | Reservasi kemarin tidak memengaruhi hari ini |

## 8. Hari bisnis dan kode pesanan

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-090 | Hari bisnis harus dihitung di database dari `timezone` dan `day_cutoff_minutes` outlet (default 180) dan tidak boleh dihitung di aplikasi atau zona waktu server | Satu sumber 🔍 | JD J-09; AM 1 (kep. 12) | J-09 | PLT | WIB, cutoff 180, 01:30 lokal: tanggal kemarin; 03:30: tanggal hari ini |
| BR-091 | `pickupCode` harus berasal dari penghitung atomik per (outlet, hari bisnis, jenis): dua penghitung terpisah, A (dine-in) dan B (takeaway), masing-masing mulai 001; tidak boleh ganda; bila transaksi dibatalkan, kenaikan ikut batal (tanpa lubang) | Antrean tertib | JD J-10; AM 5.5 (disesuaikan); Q-025 (A) | J-10 | PLT | A-001 dan B-001 dapat ada bersamaan pada hari yang sama; 50 pesanan paralel menghasilkan 50 kode berurutan unik per jenis |
| BR-092 | Format kode harus `A-{n:03}` untuk dine-in dan `B-{n:03}` untuk takeaway; setelah 999 harus melanjutkan 4 digit; urutan angka per jenis (BR-091) | Pembeda jenis | AM 5.5; Q-025 | | PLT | A-042; B-007; A-1000 |
| BR-093 | `nextPickupCode` harus dipanggil paling akhir dalam transaksi `createOrder` | Kunci counter sesingkat mungkin | AM 5.1 | | PLT | Gagal di langkah 5: counter tidak naik |
| BR-094 | Kode pesanan harus unik per (outlet, hari bisnis, kode) sebagai jaring pengaman | Anti-duplikat | JD J-10 | J-10 | PLT | Insert kode ganda ditolak |

## 9. Batas dan anti-penyalahgunaan

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-100 | Tidak boleh ada lebih dari 3 order `placed` per meja pada satu waktu, dihitung di dalam transaksi dengan kunci baris meja; ini kontrol keamanan utama | QR statis bisa difoto | AM 5.1, 5.10 | | ORD | Pesanan keempat ditolak dengan pesan Bahasa Indonesia |
| BR-101 | Tidak boleh ada lebih dari 3 order `placed` per `sid`; ini hanya kenyamanan karena cookie dapat dihapus | | DP1 5.6; AM 5.10 | | ORD | |
| BR-102 | Rate limit endpoint publik harus mengikuti tabel bagian 12.3 [HIPOTESIS], dengan penghitung atomik per kunci dan jendela | Mencegah banjir | AM 5.10; JD J-12 | J-12 | PLT | 100 permintaan paralel pada batas 6: tepat 6 lolos |
| BR-103 | `tableToken` harus 16 byte acak (22 karakter) | Tidak mudah ditebak | AM 5.10 | | ACC | Token pendek ditolak Zod |
| BR-104 | Cookie `sid` harus httpOnly, Secure, SameSite=Lax, berisi 16 byte acak + HMAC-SHA256, diterbitkan server | Sesi anonim terpercaya 🔍 | AM 5.10 | | ACC | Cookie dimodifikasi: ditolak |
| BR-105 | Baca status harus memakai `orderId` (UUID v4); aksi tulis harus memakai `orderId` dan cookie | Capability URL | AM 5.10 | | ACC | Membaca tanpa cookie diperbolehkan hanya untuk status |
| BR-106 | Customer tidak boleh punya jalur DB langsung; semua aksi lewat route handler server | Keputusan 10; J-01 | AM 1 (kep. 10) | J-01 | ACC | Anon key bocor: tidak ada data terbuka |

## 10. Akses dan audit

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-110 | RLS harus aktif di semua tabel; role `anon` tidak boleh membaca atau menulis; role `authenticated` tidak boleh INSERT/UPDATE/DELETE | Default tertutup 🔍 | JD J-01 | J-01 | ACC | Tabel uji baru: tanpa hak sama sekali |
| BR-111 | Staf hanya boleh membaca baris dengan `outlet_id` outlet profilnya; role dan outlet harus diturunkan dari `profiles`, bukan klaim klien | Isolasi tenant 🔍 | JD J-02 | J-02 | ACC | Staf outlet B tidak melihat baris outlet A |
| BR-112 | Logistik tidak boleh melihat `payments` atau `orders`; kasir tidak boleh melihat `audit_logs`; hanya pemilik melihat `audit_logs` | Pemisahan tugas | JD J-02; DP1 6 | J-02 | ACC | Logistik membuka /kasir: ditolak |
| BR-113 | Realtime hanya sebagai pemicu refetch; payload tidak boleh menjadi sumber data | Kebenaran dari server | JD J-03; AM ADR-0005 | J-03 | ACC | Event diterima; layar memuat ulang dari API |
| BR-114 | Aksi sensitif harus menulis log audit append-only: verifikasi, tolak, terima tunai, perpanjang, `payment.expired_with_proof`, isi stok, HABIS manual, pembatalan oleh staf, dan pesanan walk-in | Jejak | DP1 ADR-0004; AM 5.3, 5.6; Q-023 (A) | J-06 | PLT | Tolak: satu baris audit dengan `actorId` |
| BR-115 | Status final tidak boleh dibuka lagi: payments (`paid`, `rejected`, `expired`, `cancelled`), orders (`completed`, `cancelled`, `expired`), reservasi (`confirmed`, `released`); graf transisi lengkap tetap satu sumber di kode | Jaring pengaman | JD J-07 | J-07 | PLT | UPDATE status pada baris final ditolak |
| BR-116 | Hubungan bill↔order, bill↔payment, order↔order_item harus mengikat `id` dan `outlet_id` bersama | Isolasi tenant | JD J-08 | J-08 | PLT | Payment outlet beda dari bill: ditolak |
| BR-117 | Migrasi hanya lewat Prisma Migrate; objek J-xx tidak boleh dihapus tanpa persetujuan manusia; T-00 harus berjalan di CI | Jaminan tidak hilang 🔍 | JD aturan migrasi; AM 1 (kep. 16) | | PLT | Manifest objek dan database berbeda: CI gagal |
| BR-118 | Login hanya untuk `kasir`, `pemilik`, `logistik` (Supabase Auth); customer anonim | Keputusan | DP1 6 | | ACC | Customer tidak punya form login |
| BR-119 | Seed harus menolak jalan bila `APP_ENV=production` | Mencegah data demo di produksi | AM 6 | | PLT | |

## 10A. Aturan tambahan dari keputusan 7 Nov 2026

Menutup celah yang tercatat di bagian 14. Keputusan manusia tercatat di `OPEN-QUESTIONS.md`.

| ID | Aturan | Alasan bisnis | Sumber | J | Modul | Contoh |
|---|---|---|---|---|---|---|
| BR-120 | Setiap perpanjangan batas waktu payment (otomatis atau oleh validator) harus memperbarui `expires_at` semua reservasi `held` milik bill itu, atomik, lewat satu fungsi; reservasi tidak boleh berakhir lebih awal dari payment-nya. Rumus ketersediaan J-04 tidak berubah | Porsi tidak boleh dijual ganda setelah customer sah membayar 🔍 | Q-001 (A); AM 5.6 | J-04 | PAY | Klaim manual_qris 10:09: payment dan reservasi sama-sama berakhir 10:24 |
| BR-121 | Pemblokir TRUNCATE harus ada pada `stock_movements` dan `audit_logs` di migrasi J-06 | Ledger tak bolong 🔍 | Q-002 (A); JD J-06, T-06 | J-06 | STK | TRUNCATE sebagai role aplikasi ditolak |
| BR-122 | Customer tidak boleh membatalkan order saat payment `awaiting_verification`; payment hanya berakhir lewat Valid, Tolak oleh validator, atau kedaluwarsa | Mencegah balapan dengan validator dan customer yang sudah transfer 🔍 | Q-003 (A) | | PAY | Tombol Batal tidak tersedia; kasir memakai Tolak |
| BR-123 | `confirmPayment` tunai dengan `amountReceived` < `payment.amount` harus ditolak dengan `AMOUNT_INSUFFICIENT` 422 dan pesan "Uang diterima kurang dari tagihan" | Pesan jelas bagi kasir | Q-022 (A) | | KAS | Tagihan Rp25.000, diterima Rp20.000: ditolak |
| BR-124 | Customer hanya boleh melihat status tersedia atau HABIS; jumlah sisa porsi tidak boleh ditampilkan | Angka sisa menyesatkan karena reservasi `held` | Q-017 (A) | | STK | Menu dengan 3 porsi tersedia tampil "tersedia", bukan "sisa 3" |
| BR-125 | Kasir harus dapat melihat ledger dan reservasi stok di `/kasir` hanya baca; kasir tidak boleh mengisi stok | Kasir perlu tahu sisa tanpa hak ubah | Q-018 (A) | J-02 | STK | Kasir membuka ledger: ada; tombol isi stok: tidak ada |
| BR-126 | Penurunan `opening` di bawah jumlah reservasi `held` ditambah terjual hari itu harus ditolak dengan kode `STOCK_BELOW_COMMITTED` 422; pesan harus menyebut jumlah minimum yang diizinkan (Q-027 A) | Pesanan sah tidak boleh tak terpenuhi 🔍 | Q-019 (A); Q-027 (A) | J-06 | STK | Held 3, terjual 4, diisi 6: ditolak dengan `STOCK_BELOW_COMMITTED`; diisi 7: diterima |
| BR-127 | `manualSoldOut` harus berlaku sampai staf membukanya kembali; tidak ada reset otomatis tiap hari bisnis; layar isi stok harus menampilkan daftar menu yang masih HABIS manual sebagai pengingat tiap pagi (Q-027 A) | Keputusan manusia; mencegah menu HABIS tanpa disadari | Q-019 (A); Q-027 (A) | | STK | Ditandai HABIS hari ini, masih HABIS besok pagi sampai dibuka; layar logistik menampilkan daftar pengingat |
| BR-128 | Pesanan takeaway harus melalui QR outlet khusus yang berfungsi sebagai "meja" takeaway; pesanan customer tanpa `tableToken` harus ditolak. Batas per meja untuk takeaway dihitung per (`tableToken`, `sid`) (angka dipakai ulang: maks 3 order belum bayar, maks 1 order tunai aktif), sedangkan dine-in tetap per `tableToken` (Q-029 A). `tableToken` wajib hanya untuk pesanan sisi customer; pesanan walk-in (`source = walk_in`) `tableToken`-nya diisi service berdasarkan pilihan kasir (meja untuk dine-in / QR takeaway untuk bawa pulang), kasir tidak memegang token mentah 🔍 | Kontrol keamanan utama tetap ada | Q-021 (A); Q-029 (A) | | ORD | Takeaway tanpa token: ditolak. Keputusan Q-029 A disetujui 7 Nov 2026; mengubah `CreateOrderInput` — implementasi via task D-xx terpisah dengan persetujuan, bukan otomatis |
| BR-129 | File bukti transfer harus disimpan sampai akhir demo dan dihapus manual; jangka retensi otomatis harus ditentukan sebelum pilot | Bukti bisa memuat data pribadi 🔍 | Q-024 (A) | J-11 | PAY | Setelah demo, bucket dikosongkan oleh manusia |

---

## 11. Tabel transisi status

Disalin dari sumber; tidak ada transisi baru. Usulan atau ambiguitas masuk `OPEN-QUESTIONS.md`.

### 11.1 Payment (DP1 5.2 dengan perubahan AM 5.6, 5.7, 5.8)

| Dari | Ke | Pemicu | Aktor |
|---|---|---|---|
| (buat) | `pending` | sandbox / manual_qris / transfer_proof dibuat | sistem |
| (buat) | `awaiting_cash` | method = cash | sistem |
| `pending` | `paid` | tombol simulasi (sandbox) | customer |
| `pending` | `awaiting_verification` | customer menekan "Sudah bayar" (manual_qris) atau finalize bukti (transfer_proof) | customer |
| `awaiting_verification` | `paid` | Valid + kotak cocok dengan mutasi + `mutationAmount` sama | kasir/pemilik |
| `awaiting_verification` | `rejected` | Tolak + alasan | kasir/pemilik |
| `awaiting_cash` | `paid` | `amountReceived` ≥ `amount` | kasir/pemilik |
| `awaiting_cash` / `pending` / `awaiting_verification` | `expired` | `expiresAt` terlewat (sweeper atau status efektif) | sistem |
| non-final | `cancelled` | pembatalan order `placed` (AM 5.7) | customer/kasir; customer tidak boleh membatalkan saat `awaiting_verification`, kasir memakai Tolak (Q-003 A, BR-122) |

Final: `paid`, `rejected`, `expired`, `cancelled`. Transisi lain ditolak (J-07 sebagai jaring pengaman).

### 11.2 Order (DP1 5.4, diperbarui AM 5.7)

| Dari | Ke | Pemicu | Aktor |
|---|---|---|---|
| (buat) | `placed` | `createOrder` | customer/kasir (walk-in) |
| `placed` | `queued` | `releaseToQueue` (bill `paid`) | sistem |
| `queued` | `preparing` | `AdvanceOrderInput` | kasir/pemilik |
| `preparing` | `ready` | `AdvanceOrderInput` | kasir/pemilik |
| `ready` | `completed` | `AdvanceOrderInput` | kasir/pemilik |
| `placed` | `cancelled` | pembatalan `placed` atau payment `rejected` | customer/kasir |
| `placed` | `expired` | sweeper | sistem |

Catatan: DP1 5.4 mengizinkan `queued → cancelled` oleh kasir; AM 1 (kep. 14) dan 5.7 melarangnya, dan AM menang (konflik K6).

### 11.3 Bill (pay_first, DP1 5.3)

| Dari | Ke | Pemicu | Aktor |
|---|---|---|---|
| (buat) | `open` | `createOrder` | sistem |
| `open` | `awaiting_payment` | payment dibuat | sistem |
| `awaiting_payment` | `paid` | payment `paid` | sistem |
| `awaiting_payment` | `void` | payment rejected, expired, atau cancelled; order dibatalkan atau kedaluwarsa | sistem |

### 11.4 Reservasi stok (DP1 5.5)

| Dari | Ke | Pemicu | Aktor |
|---|---|---|---|
| (buat) | `held` | `reserveStock` | sistem |
| `held` | `confirmed` | payment `paid`; tulis `consume` | sistem |
| `held` | `released` | payment rejected, expired, atau cancelled; tanpa movement | sistem |

Final: `confirmed`, `released`.

---

## 12. Tabel TTL, perpanjangan, batas, rate limit

### 12.1 TTL dan perpanjangan (AM 5.6)

| Metode | TTL awal | Perpanjangan otomatis | Perpanjangan validator |
|---|---|---|---|
| sandbox | 10 menit | tidak | tidak (status `pending`; Q-020) |
| manual_qris | 10 menit | saat "Sudah bayar": `max(expiresAt, sekarang+15 mnt)` sekali | +15 menit, maks 2×, hanya saat `awaiting_verification` |
| transfer_proof | 15 menit | finalize bukti: `sekarang+30 mnt` sekali | +15 menit, maks 2×, hanya saat `awaiting_verification` |
| cash | 20 menit | tidak | +15 menit, maks 2×, saat `awaiting_cash` (Q-020 A) |

Semua perpanjangan (otomatis maupun validator) ikut memperbarui `expires_at` reservasi `held` milik bill itu secara atomik (BR-120).

### 12.2 Batas

| Batas | Nilai | Sumber |
|---|---|---|
| qty per baris | 1-10 | AM 4 |
| item per pesanan | 1-30 baris | AM 4 |
| total porsi per pesanan | ≤ 30 | AM 4, 5.10 |
| catatan per item | ≤ 140 karakter | AM 4 |
| nama customer | ≤ 40 karakter | AM 4 |
| order belum bayar per meja | ≤ 3 | AM 5.10 |
| order belum bayar per sid | ≤ 3 | DP1 5.6 |
| order tunai aktif per meja | ≤ 1 | AM 5.10 |
| stok pagi per menu | 0-999 | AM 4 |
| ukuran bukti | ≤ 2 MB, JPEG/PNG | JD J-11 |
| nominal potongan kode unik | 1-99 Rupiah | AM 5.4 |
| perpanjangan validator | ≤ 2× | AM 5.6 |
| retry `withTx` | ≤ 3× | AM 5.1 |
| sweeper per putaran | ≤ 50 baris | AM 5.8 |
| signed URL bukti | 60 detik | AM 5.9 |

### 12.3 Rate limit [HIPOTESIS] (AM 5.10; setel dari log demo)

| Endpoint | per sid | per IP |
|---|---|---|
| `POST orders` | 6 / 10 mnt | 30 / 10 mnt |
| `proof/*` | 10 / 10 mnt | 30 / 10 mnt |
| `GET status` | 40 / mnt | 200 / mnt |
| `GET menu` | tidak ada | 120 / mnt |

Batas IP sengaja longgar untuk WiFi warung atau CGNAT.

---

## 13. Aturan yang saling bergantung

| Rantai | Aturan terkait |
|---|---|
| Payment `rejected` → order `cancelled` → bill `void` → reservasi `released` → porsi tersedia lagi | BR-032, BR-014, BR-073, BR-071 |
| Payment `expired` (sweeper atau status efektif) → reservasi `released` → order `expired` → bill `void` | BR-034, BR-035, BR-073 |
| Payment `paid` → bill `paid` → reservasi `confirmed` + `consume` → `releaseToQueue` → order `queued` | BR-020, BR-073, BR-011 |
| `createOrder`: idempotensi → kunci meja → `calculateBill` → `reserveStock` → payment dengan TTL dan kode unik → `nextPickupCode` | BR-018, BR-100, BR-001, BR-070, BR-024, BR-040, BR-093 |
| Perpanjangan payment (BR-025, BR-026, BR-027) ↔ batas waktu reservasi (BR-071) | Ditutup BR-120 (Q-001 A) 🔍 |
| `opening` diturunkan → kunci stok sama dengan `reserveStock` → ketersediaan | BR-075, BR-077 |
| Bukti unik per outlet (BR-052) ↔ pesan ulang setelah penolakan (BR-032) | Ditutup BR-052 revisi (Q-016 B); mekanisme database: Q-028 A disetujui (menunggu task implementasi) 🔍 |
| Kode unik aktif (BR-043) ↔ jendela 24 jam di aplikasi (BR-042) | Aplikasi lebih ketat dari database (J-05), bukan konflik |
| Hari bisnis (BR-090) → `businessDate` order → `consume` (BR-080) → kode pesanan (BR-091) | Satu sumber hari |

---

## 14. Celah: status setelah keputusan 7 Nov 2026

| Celah | Q | Status |
|---|---|---|
| Perpanjangan payment vs `reservation.expires_at` | Q-001 | Ditutup: BR-120 |
| TRUNCATE tidak diblokir | Q-002 | Ditutup: BR-121 |
| Pembatalan saat `awaiting_verification` | Q-003 | Ditutup: BR-122 |
| Bukti yang ditolak tidak bisa dipakai ulang | Q-016 | Ditutup: BR-052 revisi (opsi B); mekanisme DB: Q-028 A disetujui, menunggu task implementasi |
| Customer melihat jumlah sisa | Q-017 | Ditutup: BR-124 |
| Akses kasir ke ledger; metode walk-in | Q-018 | Ditutup: BR-125 (ledger), BR-016 (Q-026 B) |
| Menurunkan `opening`; masa HABIS manual | Q-019 | Ditutup: BR-126 (`STOCK_BELOW_COMMITTED` 422, Q-027 A), BR-127 (pengingat HABIS manual, Q-027 A) |
| Perpanjangan validator pada status tertentu | Q-020 | Ditutup: BR-027, tabel 12.1 |
| Takeaway tanpa `tableToken` | Q-021 | Ditutup: BR-128 (Q-029 A disetujui, menunggu task implementasi) |
| Kode kesalahan tunai kurang | Q-022 | Ditutup: BR-123 |
| Daftar aksi audit | Q-023 | Ditutup: BR-114 |
| Retensi file bukti | Q-024 | Ditutup untuk demo: BR-129 |
| Penghitung kode pesanan | Q-025 | Ditutup: BR-091, BR-092 |

---

## 15. Pertanyaan terbuka baru dari revisi

Q-026, Q-028, Q-029 dijawab manusia 7 Nov 2026 (Q-026 B; Q-028 A; Q-029 A); Q-028 dan Q-029 mengubah kontrak beku dan menunggu task implementasi terpisah. Q-027 (kode error penurunan `opening` dan pengingat HABIS manual) masih terbuka. Semua tercatat di `OPEN-QUESTIONS.md`. Q-020 sampai Q-025 dari P3 sudah dijawab.
