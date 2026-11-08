# PROMPT PACK v2.1: Tambahan Spesifikasi Logika (addendum untuk Pack 2)

Status: draft · Berlaku **bersama** `PROMPT_PACK_PRD_PER_FITUR.md` (Pack 2) dan `PROMPT_PACK_PRD_USER_STORY.md` (Pack 1).
Bila ada pertentangan, addendum ini yang berlaku untuk hal yang diatur di sini.

---

## A. Ringkasan perubahan

1. **Tiga lapisan dokumen:** PRD fitur + story (apa yang terlihat) · Spesifikasi Logika (bagaimana aturan berjalan) · Task card (penunjuk per PR).
2. **Logika milik pemilik aturan, bukan milik fitur.** Logika lintas-fitur ditulis sekali di **Spesifikasi Logika Domain (DL)**. Logika khusus
   satu fitur ditulis di **Spesifikasi Logika Fitur (SL)** dan hanya berisi perbedaan/penambahan terhadap DL.
3. **Story menyatakan hasil, logika menyatakan cara.** AC merujuk aturan logika dengan ID; dilarang menyalin langkah logika ke story.
4. **Urutan baru:** P0-P3 → P5 → **DL-ORD…DL-UPL** → L1 → fitur → **SL (fitur berisiko)** → R-modul → P8-P14.
5. **Batas baca:** satu task card membaca paling banyak 4 berkas (PRD fitur, SL/DL, Jaminan DB, AGENTS.md).

### Hierarki sumber (jika bertentangan; JANGAN menyelesaikan sendiri, catat Q-xxx)
Jaminan DB > Amandemen v1.1 > Demo Pack v1 > 03-business-rules (BR) > DL > SL > PRD fitur/story.
Konflik antar dokumen di level yang sama atau yang menyangkut keputusan terkunci → berhenti, tulis di OPEN-QUESTIONS.

### Skema ID
| Objek | Format | Contoh |
|---|---|---|
| Spesifikasi logika domain | `DL-<DOMAIN>` | DL-PAY |
| Aturan logika domain | `LR-<DOMAIN>-<nn>` | LR-PAY-03 |
| Spesifikasi logika fitur | `SL-<ID fitur>` | SL-KAS-03 |
| Aturan logika fitur | `LR-<FITUR tanpa strip>-<nn>` | LR-KAS03-01 |
| Story (tetap) | `US-<FITUR tanpa strip>-<nn>` | US-KAS03-02 |
Domain: ORD, PAY, STK, QUE, CODE, EXP, SES, UPL. Nomor `nn` tidak dipakai ulang. Aturan yang dihapus ditandai DEPRECATED.

### Lokasi berkas
```
docs/prd/logic/            DL-ORD.md ... DL-UPL.md
docs/prd/modules/<modul>/  F-xxx-nn-....md   (PRD fitur + story)
docs/prd/modules/<modul>/logic/  SL-F-xxx-nn.md
```

---

## B. Kapan logika di dalam berkas fitur, kapan dipisah

| Kondisi fitur | Tempat logika |
|---|---|
| Hanya membaca / tampilan, logika < ±10 langkah, tanpa uang/stok/konkurensi | Di PRD fitur, bagian **S6b Logika ringan** (langkah bernomor + aturan LR-fitur) |
| Menyentuh uang, stok, status payment/order, konkurensi, atau 🔍 | Berkas **SL** terpisah; PRD fitur hanya memuat rujukan |
| Logika dipakai ≥ 2 fitur | **DL** (satu kali), fitur merujuk |
Fitur yang wajib SL (default): F-CUS-04, F-CUS-06, F-CUS-09, F-KAS-03, F-KAS-04, F-KAS-06, F-KAS-08, F-KAS-09, F-LOG-01, F-LOG-04.
Fitur lain memakai S6b. AI boleh mengusulkan penambahan SL (catat Q-xxx), tidak mengurangi daftar wajib.

---

## C. Perubahan pada TUGAS BAKU FITUR (Pack 2, Bagian C)

Ganti/tambah ketentuan berikut (bagian lain tetap):
```
S5  Alur: HANYA perilaku yang dapat diamati pengguna (langkah, layar, hasil). Dilarang menjelaskan mekanisme internal
    (kunci, transaksi, urutan tulis); itu masuk logika.
S6  Rujukan aturan: tabel BR-xx, J-xx, DL-xx/LR-xx, SL-xx yang berlaku + alasan relevan. Tidak menyalin isi aturan.
S6b Logika ringan (hanya fitur tanpa SL): langkah bernomor (bahasa alami), tabel keputusan bila ada cabang, aturan LR-<FITUR>-nn
    yang dapat diuji, contoh numerik ≥ 2. Lebih dari ±10 langkah/lebih dari satu cabang kritis → hentikan, usulkan SL (Q-xxx).
S12 Story: tambah baris "Rujukan logika: LR-xxx (dan/atau DL/SL)". Setiap AC yang menyatakan perilaku bersyarat WAJIB menyebut
    LR yang melandasinya. Tidak ada AC yang memuat aturan baru yang tidak ada di BR/LR.
CEK-MANDIRI tambahan:
[ ] tidak ada langkah logika yang disalin dari DL/SL ke PRD fitur  [ ] semua LR yang dirujuk benar-benar ada
[ ] tidak ada kontradiksi antara AC dan LR  [ ] S5 bebas istilah mekanisme internal
```

---

## D. Templat Spesifikasi Logika (DL dan SL)

Dipakai semua prompt DL dan SL. **Tanpa kode, tanpa SQL, tanpa sintaks bahasa pemrograman.** Boleh: langkah bernomor berbahasa alami,
tabel keputusan, ekspresi kondisi sederhana ("jika sisa < jumlah dipesan"), nama fungsi/domain yang sudah ada di dokumen sumber.
```
L1  Identitas: ID, nama, jenis (DL/SL), fitur/domain pemilik, pemanggil (siapa memakai), 🔍 (ya/tidak + alasan), status.
L2  Tujuan dan batas tanggung jawab: apa yang dijamin, dan apa yang BUKAN tanggung jawab (didelegasikan ke mana).
L3  Masukan dan prasyarat: data yang diterima, kondisi yang harus benar sebelum mulai (guard), siapa aktornya.
L4  Batas transaksi: bagian mana yang harus atomik (semua berhasil atau semua batal); apa yang TIDAK boleh di dalamnya (mis. panggilan jaringan).
L5  Langkah bernomor: tiap langkah satu baris; tandai langkah yang mengunci, menulis, atau bisa gagal. Urutan penting dinyatakan eksplisit.
L6  Tabel keputusan: kondisi → hasil untuk setiap cabang (status awal × metode × kondisi lain), termasuk kombinasi yang DILARANG dan hasilnya.
L7  Konkurensi dan idempotensi: skenario paralel (dua pemanggil, klik ganda, balapan dengan sweeper), urutan kunci global, hasil replay.
L8  Kegagalan: tiap kegagalan → kode error baku, efek pada data (rollback/tetap), pesan yang dilihat pengguna (rujuk errors/messages).
L9  Efek samping dan invarian: apa yang berubah di entitas lain; invarian yang harus selalu benar setelah selesai (dapat diuji dengan query/pemeriksaan).
L10 Aturan logika bernomor LR-...: kalimat tunggal yang dapat diuji ("harus/tidak boleh"), tiap satu dengan sumber (BR/J/Amandemen) atau Q-xxx.
L11 Contoh numerik (≥ 3): angka konkret (Rupiah, porsi, waktu), termasuk satu kasus tepi dan satu kasus paralel.
L12 Pembuktian: tes yang membuktikan tiap LR (unit/integrasi/konkurensi/E2E) dan invarian yang diperiksa; bukan implementasi tes.
L13 Peristiwa: audit/event yang ditulis (nama, kapan, data minimal).
L14 Pertanyaan terbuka (Q-xxx), keputusan manusia yang dibutuhkan, dan checklist 🔍 untuk reviewer manusia.
CEK-MANDIRI: [ ] tiap langkah dapat diubah menjadi kode tanpa menebak  [ ] tiap LR dapat diuji  [ ] urutan kunci tidak melanggar urutan global
[ ] tidak ada angka tanpa sumber/label  [ ] tidak ada kode/SQL  [ ] batas atomik jelas  [ ] kegagalan punya kode error baku
[ ] contoh numerik konsisten dengan LR  [ ] PROGRESS dan OPEN-QUESTIONS diperbarui
```
Ukuran: DL ≤ ±300 baris; SL ≤ ±120 baris (SL hanya memuat apa yang BERBEDA/TAMBAHAN dari DL). Lebih → pecah.
Urutan kunci global yang harus dihormati semua spesifikasi: `idempotensi → tables → payments → stock_items (urut id) → daily_counters`.

---

## E. Prompt Spesifikasi Logika Domain (DL), jalankan setelah P5, sebelum L1

Semua DL: PRASYARAT P0-P3 dan P5 APPROVED · Pembuka Wajib Pack 1 Bagian B berlaku · Templat Bagian D · berkas di `docs/prd/logic/`.
Sumber utama: Amandemen v1.1 (Bagian 5), Jaminan DB, Demo Pack v1 (Bagian 5), 03-business-rules.

**DL-ORD: Pembuatan pesanan** 🔍
```
PERAN: Senior Business Analyst transaksi + Solution Architect (sistem pesanan konkuren). KELUARAN: logic/DL-ORD.md
Cakup: seluruh proses membuat bill+order+item+payment+reservasi dalam SATU transaksi: urutan (idempotensi, validasi meja dan batas,
perhitungan tagihan dari harga basis data, reservasi stok, penyisipan, alokasi kode unik, kode pesanan terakhir, audit); jalur customer
dan jalur walk-in (satu proses, perbedaan parameter source/sesi); TTL per metode; satu bill satu payment non-final; kunci idempotensi
dan hash isi permintaan (kunci sama + isi beda = konflik); percobaan ulang otomatis yang aman (apa yang dihitung ulang);
SEMUA kegagalan → kode error → efek (OUT_OF_STOCK dengan rincian, ITEM_UNAVAILABLE, TOO_MANY_UNPAID, RATE_LIMITED, TABLE_TOKEN_INVALID,
IDEMPOTENCY_CONFLICT, SYSTEM_BUSY). Contoh numerik: tagihan dengan varian dan qty ganda; dua permintaan identik bersamaan; porsi terakhir.
```

**DL-PAY: Pembayaran dan transisi status** 🔍
```
PERAN: Payments Domain Expert + Senior Business Analyst. KELUARAN: logic/DL-PAY.md
Cakup: tabel transisi payment (salin setia dari sumber, tanpa menambah); satu-satunya jalur menuju `paid` (konfirmasi pembayaran) dan
efek berantai atomik (payment, bill, reservasi confirmed, movement consume bertanda negatif, gerbang antrean, audit); bukti yang
dibutuhkan per metode (nominal mutasi diketik = amount untuk transfer/manual_qris; nominal diterima ≥ amount + kembalian server untuk tunai;
tidak ada bukti untuk sandbox, hanya di lingkungan demo); penolakan (rejected: reservasi dilepas, order dibatalkan, bill void);
pembatalan sebelum bayar; perpanjangan TTL (klaim ManualQris, setelah bukti, perpanjangan validator maks 2×) dengan tabel kapan
berlaku; replay (konfirmasi dua kali = satu efek); bayar-tapi-kedaluwarsa (PAYMENT_EXPIRED, jalan keluar walk-in, peristiwa audit);
status final tidak bisa dibuka (rujuk J-07). Contoh numerik: kode unik 17 pada total 25.000; kembalian tunai; dua validator bersamaan.
```

**DL-STK: Stok, ketersediaan, reservasi** 🔍
```
PERAN: Operations Analyst + Solution Architect (konkurensi inventori). KELUARAN: logic/DL-STK.md
Cakup: rumus ketersediaan tunggal (J-04) dan siapa yang memakainya; menu tanpa StockItem = tak terbatas; reservasi (agregasi per stockItem
dari banyak baris, urutan kunci menurut id, hitung ulang di dalam transaksi); aturan kunci: aksi yang MENGURANGI ketersediaan wajib mengunci,
yang menambah tidak; opening (selisih terhadap saldo hari itu menjadi satu movement bertanda), adjust, waste; menurunkan stok di bawah yang
sudah tereservasi; ketersediaan negatif ditampilkan 0/HABIS; reservasi per hari bisnis; HABIS = manual ATAU tersedia ≤ 0; pelepasan
reservasi saat rejected/expired/cancelled tanpa movement; ledger append-only. Contoh numerik: porsi terakhir diperebutkan 20 permintaan;
order [x,y] vs [y,x]; satu order dua baris menu sama (2+2, stok 3).
```

**DL-QUE: Gerbang antrean dan status pesanan**
```
PERAN: Business Analyst + Product Owner POS. KELUARAN: logic/DL-QUE.md
Cakup: gerbang antrean tunggal (placed→queued bila pay_after ATAU bill paid; tidak ada salinan aturan); transisi order (queued→preparing→
ready→completed; tidak boleh loncat/mundur; placed→cancelled|expired); tidak ada pembatalan setelah queued dan alasannya; status bill
(open, awaiting_payment, paid, void) dan kapan berubah; hubungan antar status (rejected → order cancelled → bill void); siapa aktor sah tiap transisi;
walk-in memakai gerbang yang sama. Contoh: urutan status satu order dari dibuat sampai selesai untuk tiap metode.
```

**DL-CODE: Kode unik, kode pesanan, hari bisnis** 🔍
```
PERAN: Business Analyst + Payments Domain Expert. KELUARAN: logic/DL-CODE.md
Cakup: kode unik sebagai POTONGAN 1-99 Rupiah (bukan surcharge; tidak masuk diskon bisnis; total bill tidak berubah); kapan berlaku
(transfer_proof, manual_qris; total ≥ 1.000; flag env); alokasi acak dari nominal yang tidak dipakai payment aktif atau dibayar < 24 jam;
slot habis (SYSTEM_BUSY); perulangan bila bentrok; pembukuan terpisah (uniqueCodeDiscount); teks yang dilihat customer. Kode pesanan:
format per jenis (A-/B-), counter atomik per outlet per hari bisnis, tanpa lubang saat batal. Hari bisnis: zona outlet, cutoff 03:00
(keputusan 12, perlu persetujuan), dipakai untuk reservasi dan consume. Contoh: pukul 01:30 vs 03:30; 100 payment bernominal sama.
```

**DL-EXP: Kedaluwarsa**
```
PERAN: Solution Architect + Operations Analyst. KELUARAN: logic/DL-EXP.md
Cakup: tiga lapis: (1) ketersediaan benar tanpa job karena reservasi kedaluwarsa tidak dihitung, (2) status efektif untuk pembacaan
(baca tidak pernah menulis), (3) sweeper yang membersihkan status (payment→expired, reservasi→released, order→expired, bill→void, audit);
pemicu sweeper (penjadwal eksternal, oportunistik saat staf memuat antrean) dan batasnya; pengambilan baris tanpa saling tunggu; apa yang
terjadi bila sweeper mati lama; tabrakan sweeper dengan konfirmasi pembayaran dan dengan perpanjangan; aksi selalu memeriksa ulang
batas waktu. Contoh: payment kedaluwarsa 10 detik lalu belum disapu tetapi stok sudah terlihat tersedia.
```

**DL-SES: Sesi, batas, rate limit, idempotensi** 🔍
```
PERAN: Security Analyst aplikasi web + Solution Architect. KELUARAN: logic/DL-SES.md
Cakup: sesi anonim customer (cookie bertanda tangan, apa yang diizinkan baca vs tulis, kemampuan = orderId + cookie); token meja (entropi,
validasi); batas per sesi (kenyamanan) dan per meja (kontrol keamanan: ≤ 3 order belum bayar, ≤ 1 tunai aktif, qty baris 1-10, ≤ 30 porsi);
rate limit window tetap per kunci (tabel angka [HIPOTESIS] dari Amandemen); idempotensi (kunci + hash isi); apa yang dilihat klien saat
dibatasi; risiko sisa QR statis difoto. Contoh: 100 permintaan paralel pada batas 6 meloloskan tepat 6.
```

**DL-UPL: Unggah bukti transfer** 🔍
```
PERAN: Security Analyst + Payments Domain Expert. KELUARAN: logic/DL-UPL.md
Cakup: tiga langkah init → unggah langsung → finalisasi; apa yang diperiksa server (kepemilikan payment, status, ukuran, tipe dari isi berkas,
hash dihitung server); duplikat hash per outlet; kegagalan di tiap langkah dan pembersihan objek; efek sukses (awaiting_verification,
perpanjangan TTL ke 30 menit sekali); bucket privat dan signed URL lihat 60 detik untuk validator; apa yang BUKAN jaminan (hash dikalahkan
ubah-satu-piksel; bukti = klaim). Contoh: JPEG 3 MB dikompres klien; bukti yang sama dipakai dua order; jaringan putus sebelum finalisasi.
```

---

## F. Prompt Spesifikasi Logika Fitur (SL), jalankan setelah PRD fitur terkait APPROVED

Semua SL: PRASYARAT PRD fitur terkait APPROVED dan DL yang dirujuk APPROVED · Templat Bagian D · berkas `modules/<modul>/logic/SL-<ID>.md`
· **hanya memuat yang khusus fitur ini**; selebihnya rujuk DL (jangan menyalin). Jika SL ternyata hampir kosong, tulis singkat dan catat bahwa
fitur ini cukup dengan S6b (Q-xxx).

```
SL-F-CUS-04 Checkout. PERAN: Business Analyst + UX Lead. Rujuk DL-ORD, DL-SES.
Khusus fitur: pembentukan permintaan dari isi keranjang (apa yang dikirim, apa yang TIDAK pernah dikirim: harga); kapan kunci idempotensi
dibuat ulang vs dipakai ulang (retry jaringan = sama; pengguna mengubah keranjang = baru); pemetaan SETIAP kode error → pesan dan tindakan UI
(mis. OUT_OF_STOCK menandai baris habis dan menawarkan sisa); isi keranjang setelah sukses/gagal; metode bayar yang ditawarkan menurut flag
lingkungan; mencegah kirim ganda di klien; apa yang disimpan lokal setelah sukses (orderId).

SL-F-CUS-06 Transfer + bukti (sisi klien). PERAN: Security Analyst + Product Owner. Rujuk DL-UPL, DL-CODE.
Khusus fitur: mesin status unggah di klien (memilih, mengompres, menginisialisasi, mengunggah, memfinalisasi, sukses/gagal/dibatalkan) dengan
tabel transisi; aturan kompresi (sisi maks, kualitas, bila sudah kecil jangan dikompres ulang); retry dan lanjut setelah jaringan putus
(finalisasi idempoten); penanganan tipe/ukuran tidak valid sebelum unggah; pengosongan berkas lokal; apa yang ditampilkan saat TTL habis di tengah unggah.

SL-F-CUS-09 Batalkan pesanan (customer). PERAN: Business Analyst. Rujuk DL-PAY, DL-QUE, DL-EXP.
Khusus fitur: tabel keputusan: status payment/order × boleh batal? × hasil (termasuk keputusan Q tentang awaiting_verification); balapan
dengan kasir yang sedang memverifikasi (siapa menang, pesan untuk yang kalah); klik ganda; pesan berbeda untuk sudah-transfer;
apa yang tersisa di layar customer setelah batal (alasan, tombol pesan ulang).

SL-F-KAS-03 Validasi (Valid). PERAN: Payments Domain Expert + Business Analyst. Rujuk DL-PAY, DL-EXP.
Khusus fitur: guard sebelum memanggil konfirmasi pembayaran (peran, outlet, status, nominal diketik vs amount); tabel hasil
(sukses, replay "sudah diproses oleh <kasir lain/waktu>", PAYMENT_EXPIRED + saran walk-in, AMOUNT_MISMATCH, status tidak sah) → pesan dan
tindakan UI; mesin status layar konfirmasi (membuka, mengetik, konfirmasi, mengirim, hasil); apa yang dilakukan UI saat respons hilang
(koneksi putus) agar validator tahu hasilnya tanpa menekan ulang buta; pencatatan catatan mutasi.

SL-F-KAS-04 Tolak. PERAN: Business Analyst. Rujuk DL-PAY.
Khusus fitur: guard (hanya awaiting_verification), alasan wajib (aturan panjang, daftar alasan cepat), tabel hasil (sukses, sudah diproses,
sudah kedaluwarsa), pesan yang diterima customer per alasan, konfirmasi, balapan dengan Valid oleh kasir lain.

SL-F-KAS-06 Terima tunai. PERAN: Payments Domain Expert (tunai). Rujuk DL-PAY, DL-EXP.
Khusus fitur: guard (awaiting_cash, belum kedaluwarsa), aturan nominal (integer, ≥ amount), perhitungan kembalian oleh server dan
tampilannya, pencegahan salah ketik nol ekstra (peringatan di atas ambang [Q-xxx]), tabel hasil (sukses, nominal kurang, replay,
kedaluwarsa), pembulatan/uang receh (Q-xxx), mesin status layar.

SL-F-KAS-08 Walk-in. PERAN: Business Analyst. Rujuk DL-ORD, DL-PAY, DL-QUE.
Khusus fitur: perbedaan parameter dibanding customer (source, sesi, meja opsional, batas yang tidak berlaku/berlaku); metode bayar
yang boleh; keputusan Q tentang pintasan bayar-langsung (jika disetujui: urutan membuat order lalu menerima tunai TANPA melanggar
"satu pintu ke paid"); penggunaan untuk kasus pelanggan-terlambat dari validasi; kode pesanan; idempotensi pada klik ganda.

SL-F-KAS-09 Batalkan pesanan (kasir). PERAN: Business Analyst. Rujuk DL-PAY, DL-QUE.
Khusus fitur: tabel keputusan seperti SL-F-CUS-09 dari sisi kasir (siapa yang boleh, status yang sah, alasan), konflik dengan customer
yang sedang membayar/mengunggah, audit pembatalan sepihak vs atas permintaan, pesan ke customer.

SL-F-LOG-01 Isi stok pagi. PERAN: Operations Analyst. Rujuk DL-STK, DL-CODE (hari bisnis).
Khusus fitur: algoritma selisih per menu (saldo hari itu vs angka input → satu movement bertanda; selisih nol tidak menulis); atomik semua-atau-tidak;
validasi (0-999, bulat) dan pesan; hari bisnis yang diizinkan (hari ini/+1); simpan ulang di hari sama; dua penyimpan bersamaan (siapa
menang, apa yang dilihat yang kalah); ringkasan konfirmasi (apa yang akan berubah); pencatatan waktu isi untuk T3 (kapan mulai dan selesai
dihitung); menu tanpa StockItem tidak ada di formulir.

SL-F-LOG-04 Koreksi stok. PERAN: Operations Analyst. Rujuk DL-STK.
Khusus fitur: mekanisme sesuai keputusan Q (opening ulang vs adjust); aturan alasan; kenaikan vs penurunan (penurunan harus mengunci);
penurunan di bawah jumlah tereservasi (apa yang dilihat logistik, customer, kasir); porsi terakhir sedang diperebutkan; riwayat tidak berubah
(koreksi = baris baru); tabel hasil dan pesan.
```

---

## G. Perubahan pada prompt lain

**Rakit modul (R-CUS/KAS/LOG):** tambahkan pemeriksaan
```
9. Matriks story/AC → LR yang dirujuk; AC bersyarat tanpa LR = GAP. 10. LR yang tidak dirujuk satu pun story = yatim. 11. Duplikasi langkah
logika antara PRD fitur, SL, dan DL (kutip lokasi). 12. Kontradiksi AC vs LR. 13. Fitur wajib-SL yang belum punya SL.
```
**P12 (Matriks ketertelusuran):** tambah kolom LR dan DL/SL; J-xx harus terhubung ke LR yang menegakkannya.
**P13 (Tinjauan independen):** tambah daftar periksa: setiap LR dapat diuji, urutan kunci tidak bertentangan antar DL, tidak ada logika
tersembunyi di S5/story, tiap kegagalan di DL punya kode error baku.
**P14 (Task card v2):** ganti bagian bacaan wajib:
```
Setiap kartu memuat "Bacaan wajib (maks 4)": (1) PRD fitur, (2) SL fitur atau DL pemilik logika, (3) Jaminan DB yang relevan (J-xx), (4) AGENTS.md.
Kartu memuat AC (disalin dari story) DAN daftar LR yang harus dibuktikan oleh test. Kartu yang membutuhkan > 4 berkas dipecah.
Kartu untuk DL (mis. membangun konfirmasi pembayaran) dimiliki satu kartu fondasi; kartu fitur hanya memanggilnya dan TIDAK menulis ulang logikanya.
```

---

## H. Urutan eksekusi final

1. Pack 1: P0 → P1 → P2 → P3 → P5 (APPROVED).
2. **DL-ORD, DL-PAY, DL-STK, DL-QUE, DL-CODE, DL-EXP, DL-SES, DL-UPL** (urutan ini; DL-PAY dan DL-STK paling berisiko, tinjau teliti 🔍).
3. L1-CUS, L1-KAS, L1-LOG (Pack 2).
4. PRD fitur (Pack 2 Bagian E, dengan Bagian C yang sudah diubah di sini).
5. **SL** untuk fitur wajib-SL, setelah PRD fitur terkait APPROVED.
6. R-CUS, R-KAS, R-LOG (dengan tambahan Bagian G).
7. Pack 1: P8 → P9 → P10 → P11 → P12 → P13 → P14.
Penambahan baris PROGRESS.md: satu baris per DL dan per SL (ID, status, berkas, prasyarat, LANJUTKAN DARI).

Perintah singkat:
- `Eksekusi DL-PAY dari docs/prompts/PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md. Ikuti Pembuka Wajib (Pack 1 Bagian B) dan Templat Bagian D.`
- `Eksekusi SL-F-KAS-03 dari docs/prompts/PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md.`
- `Lanjutkan dari docs/prd/PROGRESS.md.`
