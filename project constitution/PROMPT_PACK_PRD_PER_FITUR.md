# PROMPT PACK v2: PRD per Modul (Customer / Kasir / Logistik) dan per Fitur

Status: draft · Melengkapi `PROMPT_PACK_PRD_USER_STORY.md` (Pack 1). **Pack 2 menggantikan P4, P6, P7 dari Pack 1** dengan pembagian lebih halus. P0-P3, P5, P8-P14 di Pack 1 tetap dipakai.

---

## A. Struktur pembagian

```
Level 1  PRD INDUK MODUL   : 3 prompt  (CUS, KAS, LOG)   → _module.md + indeks fitur
Level 2  PRD FITUR         : 1 prompt per fitur/operasi   → satu berkas per fitur
Level 3  RAKIT MODUL       : 3 prompt  (R-CUS, R-KAS, R-LOG) → konsistensi + statistik
Opsional PASCA-DEMO        : 3 prompt  (ADM) master data CRUD (di luar cakupan demo)
```

Keluaran:
```
docs/prd/modules/
  customer/  _module.md  F-CUS-01-....md  ...  F-CUS-10-....md
  kasir/     _module.md  F-KAS-01-....md  ...  F-KAS-09-....md
  logistik/  _module.md  F-LOG-01-....md  ...  F-LOG-08-....md
  admin-pasca-demo/  F-ADM-01..03
```

### Indeks fitur dan operasi CRUD (acuan seluruh pack)

C = membuat · R = membaca · U = mengubah · D = membatalkan/menghapus (di demo: pembatalan status, bukan penghapusan fisik)

| ID | Fitur | Operasi | Entitas utama | MoSCoW |
|---|---|---|---|---|
| **CUSTOMER** | | | | |
| F-CUS-01 | Akses meja dan token | R | table, sesi | MUST |
| F-CUS-02 | Menu dan ketersediaan | R | menu, varian, stok | MUST |
| F-CUS-03 | Keranjang | C·U·D (lokal) | keranjang klien | MUST |
| F-CUS-04 | Checkout dan buat pesanan | C | bill, order, payment, reservasi | MUST |
| F-CUS-05 | Bayar: Sandbox dan ManualQris | U (status) | payment | MUST |
| F-CUS-06 | Bayar: Transfer + bukti | C (bukti), U | payment, proof | MUST |
| F-CUS-07 | Bayar: Tunai di kasir | C·R | payment | MUST |
| F-CUS-08 | Status pesanan dan hitung mundur | R | order, payment | MUST |
| F-CUS-09 | Batalkan pesanan | D | order, payment, reservasi | SHOULD |
| F-CUS-10 | Pesan ulang | C | keranjang, order | SHOULD |
| **KASIR** | | | | |
| F-KAS-01 | Daftar menunggu verifikasi dan tunai | R | payment | MUST |
| F-KAS-02 | Lihat bukti transfer | R | proof | MUST |
| F-KAS-03 | Validasi pembayaran (Valid) | U | payment, bill, stok, order | MUST |
| F-KAS-04 | Tolak pembayaran | U | payment, order, reservasi | MUST |
| F-KAS-05 | Perpanjang hold | U | payment | SHOULD |
| F-KAS-06 | Terima tunai | U | payment | MUST |
| F-KAS-07 | Antrean pesanan dan ubah status | R·U | order | MUST |
| F-KAS-08 | Order walk-in | C | bill, order, payment | MUST |
| F-KAS-09 | Batalkan pesanan belum bayar | D | order, payment, reservasi | SHOULD |
| **LOGISTIK** | | | | |
| F-LOG-01 | Isi stok pagi | C | movement `opening` | MUST |
| F-LOG-02 | Salin stok kemarin | R→C | movement | SHOULD |
| F-LOG-03 | Lihat sisa stok dan status menu | R | stok, reservasi | MUST |
| F-LOG-04 | Koreksi stok saat hari berjalan | U | movement | SHOULD |
| F-LOG-05 | Toggle HABIS manual (logistik, kasir, pemilik) | U | menu | MUST |
| F-LOG-06 | Catat porsi terbuang | C | movement `waste` | COULD |
| F-LOG-07 | Rekap harian | R | movement | COULD |
| F-LOG-08 | Riwayat pergerakan stok (ledger) | R | movement | SHOULD |
| **PASCA-DEMO** | | | | |
| F-ADM-01 | Kelola menu dan varian | C·R·U·D | menu | pasca-demo |
| F-ADM-02 | Kelola meja dan token QR | C·R·U·D | table | pasca-demo |
| F-ADM-03 | Kelola akun staf | C·R·U·D | profile | pasca-demo |

Catatan: toggle HABIS dimiliki **F-LOG-05**; kasir memakai fungsi yang sama (tidak ada fitur kembar). Payment lintas modul: aturan domain ada di PRD Payment (P5 Pack 1); fitur CUS-05..07 dan KAS-03..06 merujuknya.

---

## B. Cara menjalankan

**Urutan**
1. Pack 1: P0 → P1 → P2 → P3 → **P5** (APPROVED semua).
2. Level 1: `L1-CUS`, `L1-KAS`, `L1-LOG` (APPROVED; indeks fitur di atas boleh disesuaikan lewat Q-xxx).
3. Level 2: fitur-fitur (urutan bebas dalam satu modul selama prasyaratnya APPROVED; urutan yang disarankan = nomor).
4. Level 3: `R-CUS`, `R-KAS`, `R-LOG`.
5. Pack 1: P8, P9 → P10 → P11 → P12 → P13 → P14.

**Perintah singkat**
- Mulai: `Eksekusi F-KAS-03 dari docs/prompts/PROMPT_PACK_PRD_PER_FITUR.md. Ikuti Pembuka Wajib (Pack 1, Bagian B) dan Tugas Baku Fitur (Bagian C).`
- Lanjut (token habis): `Lanjutkan dari docs/prd/PROGRESS.md.`
- Dua fitur kecil boleh digabung satu sesi bila token longgar (mis. F-KAS-04 + F-KAS-05); AI tetap menulis berkas terpisah dan baris PROGRESS terpisah.

**Tambahan Protokol (khusus Pack 2)**
- Satu sesi = satu fitur (atau dua fitur kecil). PROGRESS.md mendapat satu baris per fitur: ID, status, berkas, prasyarat, "LANJUTKAN DARI".
- **ID user story pada Pack 2: `US-<ID fitur tanpa strip>-<nn>`**, mis. `US-KAS03-01`, `US-LOG01-02`, `US-CUS04-05`. Ini **menggantikan** format `US-ORD-nn` dst. dari Pack 1 agar sesi terpisah tidak bentrok nomor.
- ID pertanyaan `Q-xxx`: sebelum menambah, baca `OPEN-QUESTIONS.md`, ambil nomor tertinggi, lanjutkan berurutan.
- Fitur dengan > 8 story: tulis 8 pertama, status PARTIAL, usulkan pemecahan fitur di OPEN-QUESTIONS (jangan memaksakan).
- Fitur boleh merujuk fitur lain hanya lewat ID (`lihat F-KAS-03`), tidak menyalin isinya.
- Berkas fitur ≤ ±250 baris. Lebih → pecah fitur.

---

## C. TUGAS BAKU FITUR (berlaku untuk semua prompt Level 2; tidak diulang di tiap prompt)

```
Tulis PRD fitur di docs/prd/modules/<modul>/<ID>-<slug>.md. Simpan BERTAHAP per bagian. Struktur wajib:

S1  Identitas: ID, nama, modul, jenis operasi (C/R/U/D), MoSCoW, 🔍 (ya/tidak + alasan), status.
S2  Tujuan pengguna: masalah yang diselesaikan (1 paragraf), hasil yang diinginkan, metrik PRD induk yang disentuh.
S3  Aktor dan izin: siapa boleh/tidak boleh (rujuk 02), termasuk customer anonim bila relevan.
S4  Pemicu dan prasyarat: dari mana fitur dimulai (entry point), kondisi data/sesi yang harus ada.
S5  Alur: (a) alur utama berlangkah, (b) alur alternatif, (c) alur kesalahan/gagal. Tabel: langkah | aktor | sistem | hasil.
S6  Aturan bisnis: daftar BR-xx dan J-xx yang berlaku (rujuk 03 dan Jaminan DB; jangan menyalin isi). Aturan baru
    yang dibutuhkan fitur ini → catat sebagai Q-xxx, jangan dikarang.
S7  Layar dan state: untuk tiap layar/komponen: tujuan, elemen, dan state wajib (memuat, kosong, galat, sukses,
    terputus, kedaluwarsa/habis, tidak berizin). Perilaku mobile (layar kecil, satu tangan). Tanpa mockup piksel.
S8  Spesifikasi input (wajib bila fitur menerima masukan): tabel
    kolom: nama tampil | nama konsep | wajib? | tipe | batas/aturan (angka dari sumber) | pesan galat Indonesia |
    contoh valid | contoh tidak valid. Batas yang tidak ada di sumber → Q-xxx, bukan dikarang.
S9  Data: entitas yang dibaca/ditulis (konsep), efek samping (reservasi, movement, audit, antrean, notifikasi),
    apa yang berubah pada fitur lain.
S10 Paralelisme dan keandalan: dua pengguna bersamaan, klik ganda, koneksi putus di tengah, kedaluwarsa saat
    proses, replay/idempotensi, urutan operasi. Untuk setiap skenario: perilaku yang diharapkan.
S11 Teks UI Indonesia: label tombol, pesan sukses/galat/peringatan/kosong yang spesifik (bukan placeholder).
S12 User story (Format Baku Pack 1, ID `US-<ID>-<nn>`), ≤ 8, tiap story ≥ 3 AC Given-When-Then yang mencakup
    jalur normal, validasi/galat, batas/tepi; tiap AC dapat dijadikan satu test otomatis.
S13 Peristiwa yang dicatat (untuk metrik demo dan audit): nama peristiwa, kapan, data minimal.
S14 Risiko, pertanyaan terbuka (Q-xxx), hal yang harus ditinjau manusia 🔍, dan di luar cakupan fitur.

CEK-MANDIRI (jalankan sebelum menandai selesai)
[ ] setiap BR/J yang disebut ada di katalog/jaminan asli  [ ] setiap angka berasal dari sumber atau berlabel Q/[HIPOTESIS]
[ ] S8 lengkap untuk semua input  [ ] S10 membahas minimal klik ganda + konkurensi + koneksi putus
[ ] semua AC dapat diuji tanpa tafsir  [ ] tidak ada kode/SQL  [ ] istilah sesuai glosarium  [ ] tidak ada fitur kembar
[ ] PROGRESS.md dan OPEN-QUESTIONS.md diperbarui
```

---

## D. LEVEL 1: PRD induk modul

**Tugas baku Level 1** (untuk L1-CUS, L1-KAS, L1-LOG): tulis `docs/prd/modules/<modul>/_module.md`:
1. Tujuan modul dan nilai pengguna; metrik PRD yang disentuh. 2. Cakupan dan di luar cakupan. 3. Aktor, izin, perangkat tipikal.
4. Peta perjalanan modul dari awal sampai akhir (tabel langkah). 5. **Indeks fitur final**: ambil dari tabel Bagian A, tambahkan/kurangi
hanya bila ada alasan (catat di OPEN-QUESTIONS), tiap fitur: ID, nama, operasi CRUD, MoSCoW, ketergantungan antar fitur, urutan
pengerjaan. 6. Aturan lintas-fitur di modul ini (mis. istilah status, pola pesan galat, perilaku koneksi putus) yang akan dirujuk semua
fitur, supaya tidak ditulis ulang. 7. Pola layar yang dipakai bersama (navigasi, header, indikator realtime, banner koneksi).
8. Risiko modul dan pertanyaan terbuka. 9. Kebutuhan data tingkat konsep (matriks entitas × fitur: C/R/U/D).
Maks 4 langkah penyimpanan. Tanpa user story (story ditulis di Level 2).

### L1-CUS
```
PERAN: Product Owner senior e-commerce/F&B mobile-first + UX Lead untuk pesan-di-meja dengan ponsel kelas menengah-bawah
dan koneksi seluler tidak stabil. PRASYARAT: P0-P3 dan P5 APPROVED. KELUARAN: modules/customer/_module.md
FOKUS: customer anonim tanpa akun; semua aksi lewat tautan meja (QR statis) + cookie sesi; mobile-first; literasi digital rendah;
empat metode bayar; pemulihan setelah tutup tab/koneksi putus; satu halaman status yang menjadi "rumah" pesanan.
Wajib dibahas di aturan lintas-fitur: kamus status yang tampil ke customer (pemetaan status internal → kata sederhana),
pola pesan galat, perilaku saat koneksi putus, penyimpanan lokal (keranjang, orderId) yang aman jika browser memblokirnya.
```

### L1-KAS
```
PERAN: Product Owner senior sistem POS + UX Lead untuk kasir yang sibuk (multitasking, tablet/ponsel, interupsi tinggi).
PRASYARAT: P0-P3 dan P5 APPROVED. KELUARAN: modules/kasir/_module.md
FOKUS: validator pembayaran (kasir/pemilik), antrean pesanan, walk-in; beban kerja dan prioritas tampilan (yang hampir
kedaluwarsa di atas); pencegahan salah tekan; dua kasir bekerja bersamaan; pemilik merangkap kasir; kasir tanpa dapur
(gerbang antrean kasir). Wajib di aturan lintas-fitur: pola konfirmasi aksi tak-terbatalkan, indikator item baru,
perilaku realtime+polling cadangan, pola konflik "item sudah diproses kasir lain".
```

### L1-LOG
```
PERAN: Product Owner senior manajemen stok F&B + Operations Analyst yang paham persiapan pagi warung/dapur kecil.
PRASYARAT: P0-P3 APPROVED. KELUARAN: modules/logistik/_module.md
FOKUS: stok porsi harian (bukan bahan baku), ledger append-only (koreksi = menambah baris), hari bisnis dan cutoff, menu
tanpa StockItem = tak terbatas, reservasi sebagai pengurang ketersediaan, bahan uji T3 (waktu isi stok).
Wajib di aturan lintas-fitur: definisi "tersedia" (satu rumus, rujuk J-04) dan cara ditampilkan ke tiap peran,
istilah (opening/terjual/tertahan/tersedia/terbuang) dalam bahasa Indonesia yang konsisten, dan sifat tidak bisa diubahnya riwayat.
```

---

## E. LEVEL 2: PRD fitur (prompt per fitur)

Format tiap prompt: **Peran · Prasyarat · Keluaran · Parameter**. Tugas = Bagian C.
Setiap "Wajib dibahas" adalah daftar minimum; AI boleh menambah, tidak boleh mengurangi.

### E.1 Customer

**F-CUS-01 Akses meja dan token** (R, MUST)
```
PERAN: Product Owner + Security Analyst aplikasi web publik. PRASYARAT: L1-CUS APPROVED. KELUARAN: customer/F-CUS-01-akses-meja-token.md
Wajib dibahas: tautan /m/{outlet}/{token}; token valid, tidak valid, kedaluwarsa/diputar (tokenRotated); outlet tidak ada;
penerbitan sesi anonim (cookie bertanda tangan, rujuk ACC); apa yang tampil sebelum menu (nama outlet, label meja);
pelanggan takeaway tanpa meja (tableToken opsional di kontrak: bagaimana mereka masuk? → Q-xxx); rate limit baca;
QR difoto pihak lain (risiko sisa, tampilkan jujur); pesan galat Indonesia; JS dimatikan/cookie diblokir.
Operasi: R. S8 (input): hanya parameter URL (outlet, token) - spesifikasikan format dan penolakannya.
```

**F-CUS-02 Menu dan ketersediaan** (R, MUST)
```
PERAN: Product Owner + UX Lead mobile. PRASYARAT: F-CUS-01. KELUARAN: customer/F-CUS-02-menu-ketersediaan.md
Wajib dibahas: kategori dan urutan; kartu menu (nama, harga Rupiah format, varian dan selisih harga); status HABIS otomatis
(tersedia ≤ 0) vs manual (manualSoldOut) dan alasan yang tampil ke customer; menu tanpa StockItem = tak terbatas;
apakah "sisa N porsi" ditampilkan (ambang? → Q-xxx); menu isActive=false disembunyikan; data berubah saat halaman terbuka
(kapan segarkan: polling menu? saat kembali ke tab? saat buka keranjang?); performa di 4G lambat (ukuran, skeleton);
tidak ada gambar di demo (imageUrl tidak dipakai); state kosong (outlet tanpa menu), galat, memuat.
Operasi: R. Metrik: waktu sampai menu tampil [HIPOTESIS target].
```

**F-CUS-03 Keranjang** (C·U·D lokal, MUST)
```
PERAN: Product Owner + UX Lead mobile. PRASYARAT: F-CUS-02. KELUARAN: customer/F-CUS-03-keranjang.md
Wajib dibahas: tambah (menu+varian+catatan), ubah qty (1-10 per baris), hapus baris, kosongkan; catatan ≤ 140 karakter;
batas total 30 porsi per pesanan; baris sama dengan varian/catatan berbeda = baris terpisah?; total ESTIMASI di keranjang
vs total final dari server (tampilkan label jelas); item yang menjadi HABIS/nonaktif saat di keranjang (peringatan, cara
menyelesaikan); harga berubah (menu diubah seed) saat di keranjang; persistensi lokal (refresh, tutup tab; penyimpanan
diblokir → tetap berfungsi dalam memori); keranjang terikat outlet/meja (pindah meja, token berbeda); kedaluwarsa keranjang.
Operasi: C·U·D pada keranjang klien (tidak ada penulisan server). S8: tiap field keranjang dengan batas.
```

**F-CUS-04 Checkout dan buat pesanan** (C, MUST) 🔍
```
PERAN: Product Owner + Senior Business Analyst transaksi. PRASYARAT: F-CUS-03, P5. KELUARAN: customer/F-CUS-04-checkout-buat-pesanan.md
Wajib dibahas: jenis pesanan (dine_in/takeaway) dan kaitannya dengan meja; nama customer (≤ 40, opsional?); pilihan metode bayar
(empat, mana yang tampil menurut flag lingkungan); ringkasan total dari server (tidak pernah dari klien); kunci idempotensi (klik ganda,
retry jaringan, dua tab); hasil sukses (orderId, kode pesanan, instruksi bayar sesuai metode); SEMUA jalur gagal dengan pesan:
menu habis (bagian mana yang habis, tawarkan sisa), item tak tersedia, batas 3 order belum bayar (per sesi/per meja),
rate limit, sistem sibuk (retry), harga berubah, token meja tidak valid saat kirim; apa yang terjadi pada keranjang setelah gagal/sukses;
satu bill satu payment non-final. Bahas jujur: stok ditahan segera saat order dibuat (TTL) - dampaknya ke customer lain.
Operasi: C. S8 wajib sangat rinci (CreateOrder: tiap field + batas).
```

**F-CUS-05 Bayar: Sandbox dan ManualQris** (U status, MUST) 🔍
```
PERAN: Product Owner + Payments Domain Expert. PRASYARAT: F-CUS-04. KELUARAN: customer/F-CUS-05-bayar-sandbox-manualqris.md
Wajib dibahas: Sandbox - tombol "Bayar (simulasi)", banner SIMULASI, hilang total di produksi (rujuk M7), hasil (paid, antre);
ManualQris - tampil QRIS statis + nominal PERSIS (termasuk potongan kode unik dan teks penjelasannya), tombol "Sudah bayar" →
awaiting_verification, perpanjangan TTL saat klaim (sekali), layar "menunggu verifikasi kasir" dan apa yang customer lakukan
sambil menunggu; klaim palsu (customer menekan tanpa bayar) dan dampaknya ke kasir; klik ganda; TTL habis sebelum/sesudah klaim;
status ditolak/kedaluwarsa. Operasi: U (transisi status payment lewat aksi customer).
```

**F-CUS-06 Bayar: Transfer + bukti** (C bukti, MUST) 🔍
```
PERAN: Product Owner + Payments Domain Expert + Security Analyst. PRASYARAT: F-CUS-04. KELUARAN: customer/F-CUS-06-bayar-transfer-bukti.md
Wajib dibahas: tampil rekening tujuan (bank, nomor, nama) dan nominal persis (kode unik); pemilihan foto (kamera/galeri),
kompresi di klien (target sisi 1600px, kualitas 0,8 [rujuk Amandemen]), pratinjau, unggah langsung (init → unggah → finalize),
progres dan pembatalan unggah, jaringan putus di tengah (lanjut/ulang), tipe/ukuran tidak valid, bukti duplikat (hash),
ganti foto sebelum finalisasi?, perpanjangan TTL ke 30 menit sekali setelah bukti, layar menunggu verifikasi, bukti ditolak
(alasan, cara melanjutkan), transfer dengan nominal salah (apa yang customer lihat, apa yang dilakukan). Hash dihitung server;
bukti = klaim, bukan bukti (ADR-0004) - tampilkan ekspektasi yang jujur ke customer. Operasi: C (bukti), U (status).
S8: file (tipe, ukuran, dimensi), paymentId.
```

**F-CUS-07 Bayar: Tunai di kasir** (C·R, MUST) 🔍
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-CUS-04. KELUARAN: customer/F-CUS-07-bayar-tunai.md
Wajib dibahas: layar kode pesanan BESAR terbaca dari jauh; instruksi "bayar di kasir"; hitung mundur TTL 20 menit; apa yang
terjadi saat TTL habis (stok dilepas) dan cara memesan ulang; batas ≤ 1 order tunai aktif per meja (alasan, pesan);
customer pergi dan tidak datang (dampak ke stok orang lain); kasir menerima → layar berubah ke status antrean; nominal yang
harus dibawa (total, tanpa kode unik); kembalian tidak dihitung customer. Operasi: C (order tunai) dan R (kode). 
```

**F-CUS-08 Status pesanan dan hitung mundur** (R, MUST)
```
PERAN: Product Owner + UX Lead mobile. PRASYARAT: F-CUS-04. KELUARAN: customer/F-CUS-08-status-pesanan.md
Wajib dibahas: halaman status sebagai "rumah" pesanan (akses via orderId; pulih setelah tab ditutup lewat penyimpanan lokal;
dari perangkat lain tidak otomatis); pemetaan status internal → kata customer (placed, queued, preparing, ready, completed,
rejected/expired/cancelled dengan alasan); hitung mundur TTL (sumber waktu server, selisih jam perangkat); polling adaptif
(3→5→10 dtk), jeda saat tab tersembunyi, ETag/304, backoff dan banner "Menyambung ulang…", pemulihan saat online;
ringkasan pesanan dan total; kode pesanan; status final; pesan yang menenangkan saat menunggu verifikasi lama;
akses ke pesanan orang lain (capability URL: risiko dan batasan data yang tampil - minimal).
Operasi: R. S8: parameter orderId. Peristiwa: waktu antar status (untuk metrik).
```

**F-CUS-09 Batalkan pesanan** (D, SHOULD) 🔍
```
PERAN: Product Owner + Business Analyst. PRASYARAT: F-CUS-08. KELUARAN: customer/F-CUS-09-batalkan-pesanan.md
Wajib dibahas: kapan tombol Batal ada (status placed/payment non-final); apakah boleh saat awaiting_verification (kasir mungkin
sedang memverifikasi → bahaya balapan → Q-xxx dengan rekomendasi); konfirmasi; efek (payment cancelled, reservasi released, order
cancelled, bill void) dalam satu kejadian; setelah queued tidak ada pembatalan (jelaskan ke customer apa yang bisa dilakukan);
sudah transfer lalu batal (uang customer!) - tampilkan kebijakan dan siapa menangani di luar sistem [ASUMSI]; klik ganda;
kasir membatalkan bersamaan. Operasi: D (pembatalan status).
```

**F-CUS-10 Pesan ulang** (C, SHOULD)
```
PERAN: Product Owner + UX Lead. PRASYARAT: F-CUS-03, F-CUS-08. KELUARAN: customer/F-CUS-10-pesan-ulang.md
Wajib dibahas: titik masuk (dari payment rejected/expired/cancelled); pemulihan isi keranjang; pengecekan ulang ketersediaan dan
harga; kunci idempotensi baru; alasan penolakan tetap terlihat; mengubah metode bayar (tidak ada "ganti metode": batal lalu pesan
ulang - jelaskan pengalaman pengguna); batas order belum bayar yang bisa tercapai karena percobaan ulang; pesan saat item sekarang habis.
Operasi: C (turunan F-CUS-04).
```

### E.2 Kasir

**F-KAS-01 Daftar menunggu verifikasi dan tunai** (R, MUST)
```
PERAN: Product Owner + UX Lead (POS). PRASYARAT: L1-KAS, P5. KELUARAN: kasir/F-KAS-01-daftar-menunggu.md
Wajib dibahas: dua daftar terpisah (menunggu verifikasi: transfer & manual_qris; menunggu bayar tunai); kolom/kartu (kode pesanan,
meja, metode, nominal persis, sisa waktu, jumlah item, nama); urutan (yang hampir kedaluwarsa di atas); pencarian cepat lewat kode
pesanan; indikator item baru dan perilaku bila kasir sedang membuka item lain; realtime + polling cadangan 10 dtk + refetch saat online;
daftar kosong; banyak item (puluhan); dua kasir melihat daftar sama; item yang kedaluwarsa saat dilihat; indikator koneksi.
Operasi: R. Peristiwa: waktu tunggu per item (untuk metrik waktu verifikasi).
```

**F-KAS-02 Lihat bukti transfer** (R, MUST) 🔍
```
PERAN: Product Owner + Security Analyst. PRASYARAT: F-KAS-01. KELUARAN: kasir/F-KAS-02-lihat-bukti.md
Wajib dibahas: bukti ditampilkan hanya lewat signed URL berumur 60 detik dibuat saat item dibuka; URL kedaluwarsa saat dilihat
(muat ulang otomatis/manual); zoom/geser di layar kecil; berdampingan dengan nominal yang harus dicocokkan dan data rekening;
payment tanpa bukti (manual_qris) tampil seperti apa; bukti gagal dimuat; siapa yang boleh (kasir, pemilik; logistik tidak);
apakah akses bukti dicatat audit (→ Q-xxx); pengingat bahwa bukti = klaim, wajib cocokkan mutasi sebenarnya.
Operasi: R.
```

**F-KAS-03 Validasi pembayaran (Valid)** (U, MUST) 🔍
```
PERAN: Product Owner + Payments Domain Expert + Senior Business Analyst. PRASYARAT: F-KAS-01, F-KAS-02, P5. KELUARAN: kasir/F-KAS-03-validasi-pembayaran.md
Wajib dibahas: nominal mutasi DIKETIK validator (bukan checkbox) harus sama persis dengan nominal payment, pesan jika tidak cocok
(AMOUNT_MISMATCH); catatan mutasi (≤ 40, mis. 4 digit akhir referensi); konfirmasi sebelum final (aksi tidak bisa dibatalkan);
efek berantai dalam satu kejadian (paid, stok terpakai, order masuk antrean, audit); payment sudah kedaluwarsa saat validator menekan
Valid (PAYMENT_EXPIRED → saran order walk-in; apa yang dilihat customer); klik ganda dan dua kasir menekan Valid bersamaan
(satu efek, kasir kedua melihat pesan jelas); koneksi putus tepat setelah menekan (bagaimana tahu sudah berhasil); validator
mengetik sesuai layar tanpa membuka mutasi (risiko sisa, kemungkinan mitigasi proses). Operasi: U.
S8 rinci: paymentId, decision, mutationAmount, mutationNote. 
```

**F-KAS-04 Tolak pembayaran** (U, MUST) 🔍
```
PERAN: Product Owner + Business Analyst. PRASYARAT: F-KAS-01. KELUARAN: kasir/F-KAS-04-tolak-pembayaran.md
Wajib dibahas: alasan wajib (≤ 140), daftar alasan cepat yang diusulkan [ASUMSI: nominal salah, bukti tidak terbaca, bukti sudah
dipakai, mutasi tidak ditemukan]; efek (rejected, reservasi dilepas, order dibatalkan, bill void) dan teks yang dilihat customer
beserta jalan lanjut (pesan ulang); tidak ada "tolak lalu minta unggah ulang" di demo (jelaskan konsekuensi UX, usulkan Q-xxx);
konfirmasi; klik ganda/dua kasir; menolak payment yang sudah paid/expired (ditolak sistem, pesan). Operasi: U.
```

**F-KAS-05 Perpanjang hold** (U, SHOULD)
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-KAS-01. KELUARAN: kasir/F-KAS-05-perpanjang-hold.md
Wajib dibahas: +15 menit, maksimal 2 kali (holdExtensions), tombol aktif hanya pada status yang relevan; tampilan sisa waktu dan
jumlah perpanjangan; dampak ke stok (menahan porsi lebih lama untuk customer lain - tampilkan biaya trade-off); audit; apa yang terjadi
saat batas tercapai; perpanjangan pada payment yang hampir/sudah kedaluwarsa; tunai ikut bisa diperpanjang? (→ Q-xxx).
Operasi: U.
```

**F-KAS-06 Terima tunai** (U, MUST) 🔍
```
PERAN: Product Owner + Payments Domain Expert (tunai). PRASYARAT: F-KAS-01, P5. KELUARAN: kasir/F-KAS-06-terima-tunai.md
Wajib dibahas: mencari order lewat kode pesanan; tampil total yang harus dibayar; input nominal diterima (integer Rupiah);
nominal kurang ditolak dengan pesan; kembalian DIHITUNG SERVER dan ditampilkan besar; konfirmasi sebelum final; payment sudah
kedaluwarsa (customer terlambat datang), bayar ganda, klik ganda; efek berantai sama dengan F-KAS-03 (rujuk, jangan salin);
audit cash.receive; pembulatan/uang receh (→ Q-xxx); batas nominal wajar (salah ketik nol ekstra → peringatan?). Operasi: U.
S8 rinci: paymentId, amountReceived.
```

**F-KAS-07 Antrean pesanan dan ubah status** (R·U, MUST)
```
PERAN: Product Owner + UX Lead (POS). PRASYARAT: F-KAS-03 atau F-KAS-06. KELUARAN: kasir/F-KAS-07-antrean-pesanan.md
Wajib dibahas: daftar order queued/preparing/ready (+ completed hari ini); kartu (kode, meja/takeaway, item+varian+catatan, waktu masuk,
nama); transisi sah saja (queued→preparing→ready→completed), tidak boleh loncat/mundur, TIDAK ada cancel setelah queued (pesan jika dicoba);
siapa menyiapkan (kasir juga menyiapkan; tanpa dapur) dan apa artinya "preparing"; indikator item baru dan urutan; dua kasir mengubah
status bersamaan; antrean panjang; order walk-in tampil sama; riwayat selesai hari ini. Operasi: R·U.
S8: orderId, to (preparing/ready/completed).
```

**F-KAS-08 Order walk-in** (C, MUST) 🔍
```
PERAN: Product Owner + Business Analyst. PRASYARAT: F-CUS-04 (aturan dipakai ulang), F-KAS-06. KELUARAN: kasir/F-KAS-08-order-walk-in.md
Wajib dibahas: kasir membuat pesanan atas nama pelanggan di depan kasir (source walk_in) lewat service yang SAMA dengan customer
(tidak ada aturan ganda); pemilihan menu/varian/qty/catatan; takeaway vs dine-in dan meja opsional; metode bayar yang tersedia
(tunai langsung? → Q-xxx: apakah ada pintasan "bayar sekarang" tanpa melalui awaiting_cash); sessionId/batas order belum bayar untuk walk-in;
stok ditahan sama seperti order biasa (menu habis ditolak); digunakan untuk kasus "pelanggan terlambat bayar" dari F-KAS-03; 
kode pesanan; idempotensi. Operasi: C. S8 rinci.
```

**F-KAS-09 Batalkan pesanan belum bayar** (D, SHOULD) 🔍
```
PERAN: Product Owner + Business Analyst. PRASYARAT: F-KAS-01. KELUARAN: kasir/F-KAS-09-batalkan-pesanan.md
Wajib dibahas: hanya status placed (belum bayar); alasan (wajib/opsional → Q-xxx); konfirmasi; efek berantai (payment cancelled,
reservasi dilepas, order cancelled, bill void); konflik dengan customer yang sedang membayar/mengunggah bukti (balapan);
pembatalan atas permintaan customer di meja vs pembatalan sepihak (audit); order yang sudah queued TIDAK bisa dibatalkan (pesan
yang jelas dan apa jalan keluarnya di demo); audit. Operasi: D.
```

### E.3 Logistik

**F-LOG-01 Isi stok pagi** (C, MUST) 🔍
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: L1-LOG. KELUARAN: logistik/F-LOG-01-isi-stok-pagi.md
Wajib dibahas: satu halaman, satu angka per menu (0-999); menu tanpa StockItem tidak muncul di formulir (tak terbatas) dan cara
menandainya; hari bisnis yang dituju (hari ini atau +1; tidak boleh tanggal bebas); simpan = selisih terhadap saldo hari itu menjadi
satu movement `opening` bertanda; isi pertama kali vs simpan ulang di hari sama; konfirmasi ringkasan perubahan sebelum simpan;
validasi (kosong, negatif, desimal, > 999) dengan pesan; simpan sebagian gagal (atomik: semua atau tidak); dua orang menyimpan
bersamaan; ketersediaan langsung berubah di halaman customer; pencatatan WAKTU ISI (bahan T3: mulai-membuka sampai simpan).
Operasi: C. S8 rinci: tiap menu × portions, businessDate.
```

**F-LOG-02 Salin stok kemarin** (R→C, SHOULD)
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-LOG-01. KELUARAN: logistik/F-LOG-02-salin-stok-kemarin.md
Wajib dibahas: menyalin TOTAL `opening` kemarin (bukan sisa) sebagai nilai awal formulir, tetap dapat diubah dan baru tersimpan saat
Simpan; "kemarin" mengikuti hari bisnis (cutoff 03:00, rujuk keputusan 12); kemarin tidak ada data / menu baru; menu nonaktif;
hari libur (kemarin tutup); menimpa isian yang sedang diketik (konfirmasi); hasil sebagai prefill, bukan penulisan otomatis.
Operasi: R (kemarin) → C (lewat F-LOG-01). Peristiwa: pemakaian fitur salin (metrik T3: berapa banyak waktu terhemat).
```

**F-LOG-03 Lihat sisa stok dan status menu** (R, MUST)
```
PERAN: Product Owner + UX Lead. PRASYARAT: F-LOG-01. KELUARAN: logistik/F-LOG-03-lihat-sisa-stok.md
Wajib dibahas: tabel per menu: opening, terjual (consume), tertahan (reservasi held aktif), tersedia (satu rumus, J-04), status
(Tersedia/HABIS otomatis/HABIS manual/Tanpa batas); pembaruan realtime + polling cadangan; reservasi kedaluwarsa melepas stok
otomatis di tampilan; nilai negatif ditampilkan 0/HABIS; peringatan stok menipis [ambang → Q-xxx]; peran yang boleh (logistik, pemilik;
kasir lihat saja); mobile; kosong (belum diisi hari ini) dengan ajakan mengisi stok. Operasi: R.
```

**F-LOG-04 Koreksi stok saat hari berjalan** (U, SHOULD) 🔍
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-LOG-03. KELUARAN: logistik/F-LOG-04-koreksi-stok.md
Wajib dibahas: kebutuhan nyata (porsi tambahan dimasak, rusak, salah hitung); mekanisme: ubah angka opening (selisih) vs movement
`adjust` dengan alasan → Q-xxx dengan rekomendasi; menaikkan (langsung tersedia); menurunkan di bawah yang sudah tereservasi
(diizinkan; reservasi lama dihormati; tampilan HABIS) dan pesan peringatan; alasan wajib?; ledger tidak bisa diubah (koreksi
= baris baru); konkurensi dengan pesanan masuk (porsi terakhir sedang diperebutkan); audit; konfirmasi. Operasi: U (secara
ledger: C baris baru).
```

**F-LOG-05 Toggle HABIS manual** (U, MUST)
```
PERAN: Product Owner + UX Lead. PRASYARAT: F-LOG-03. KELUARAN: logistik/F-LOG-05-toggle-habis-manual.md
Wajib dibahas: dipakai oleh logistik, kasir, pemilik lewat SATU fungsi/perilaku; menu ditandai HABIS meski stok > 0 (bahan habis di
dapur) dan dibuka kembali; efek langsung ke customer (menu tidak bisa ditambahkan; keranjang berisi item itu diperingatkan);
perbedaan visual dengan HABIS otomatis; apakah reset otomatis di hari baru (→ Q-xxx); alasan opsional; dua orang menekan bersamaan
(hasil akhir jelas); menu dengan pesanan berjalan tidak terpengaruh; audit. Operasi: U.
Catatan: fitur kasir "toggle HABIS" TIDAK dibuat terpisah; dokumen ini pemiliknya.
```

**F-LOG-06 Catat porsi terbuang** (C, COULD)
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-LOG-04. KELUARAN: logistik/F-LOG-06-catat-terbuang.md
Wajib dibahas: movement `waste` bertanda negatif + alasan (daftar singkat [ASUMSI]); beda dengan koreksi; tidak boleh melebihi
yang ada?; efek ke tersedia; kapan dicatat (akhir hari); audit; masuk rekap. Jika ternyata di luar demo, tulis PRD ringan dan beri
label "ditunda" dengan alasan, jangan memaksakan story MUST. Operasi: C.
```

**F-LOG-07 Rekap harian** (R, COULD)
```
PERAN: Product Owner + Operations Analyst. PRASYARAT: F-LOG-03. KELUARAN: logistik/F-LOG-07-rekap-harian.md
Wajib dibahas: per menu: opening, terjual (consume), terbuang (waste), sisa; pilih hari bisnis; nilai uang tidak ditampilkan (di luar
cakupan) kecuali diputuskan; akhir hari vs hari berjalan; konsistensi angka dengan F-LOG-03 (satu sumber); ekspor (tidak di demo);
bahan T3. Operasi: R.
```

**F-LOG-08 Riwayat pergerakan stok (ledger)** (R, SHOULD)
```
PERAN: Product Owner + Auditor Operasional. PRASYARAT: F-LOG-03. KELUARAN: logistik/F-LOG-08-riwayat-ledger.md
Wajib dibahas: daftar movement (waktu, menu, jenis opening/consume/adjust/waste, qty bertanda, pembuat, rujukan order/alasan);
filter hari/menu/jenis; tidak ada tombol ubah/hapus (append-only, jelaskan di UI); siapa boleh (logistik, pemilik; kasir lihat saja);
volume data besar (paginasi); membaca "kenapa stok saya berkurang" dari ledger; konsistensi dengan angka tersedia. Operasi: R.
```

---

## F. LEVEL 3: Rakit modul

**Tugas baku** (R-CUS, R-KAS, R-LOG), peran: **QA Lead + Product Owner modul**, prasyarat: semua fitur modul APPROVED.
Keluaran: `modules/<modul>/_rollup.md`. Bertahap per kelompok fitur.
```
1. Tabel ringkas: fitur | jumlah story | MoSCoW | 🔍 | status.
2. Konsistensi lintas-fitur: istilah, pesan galat, angka (TTL, batas), status; daftar ketidaksesuaian + usulan perbaikan.
3. Duplikasi/bentrok antar fitur (dua fitur mengatur hal sama; dua story bertentangan).
4. Matriks entitas × fitur (C/R/U/D) final; entitas tanpa pemilik; operasi tanpa fitur.
5. Matriks story → BR → J → jenis test; BR/J milik modul yang belum tertutup = GAP.
6. Daftar pertanyaan terbuka modul yang belum dijawab, diurut dampak.
7. Statistik: story per prioritas, % AC yang dapat diotomasi, jumlah story 🔍.
8. Verdik modul: SIAP DITURUNKAN KE TASK CARD / PERLU REVISI + daftar revisi.
Jangan mengubah berkas fitur; hanya melaporkan. Revisi dilakukan lewat prompt revisi per fitur.
```

---

## G. Opsional PASCA-DEMO (master data CRUD, di luar cakupan demo)

Berlaku untuk F-ADM-01..03. Tugas: PRD ringan (S1-S5, S7-S9, S11, S14 + story berprioritas **tidak ada MUST**), semuanya berlabel
`PASCA-DEMO`, dan wajib memuat bagian "Dampak pada skema dan jaminan DB yang sudah dibekukan" (apa yang akan berubah, risiko).

```
F-ADM-01 Kelola menu dan varian. PERAN: Product Owner + UX Lead admin. C·R·U·D menu, kategori, varian, harga, aktif/nonaktif,
urutan; sinkron dengan StockItem (membuat menu otomatis membuat StockItem?); mengubah harga saat ada order berjalan (snapshot
harga tetap); menghapus menu yang pernah dipesan (nonaktifkan, bukan hapus); gambar (imageUrl); validasi harga integer.
F-ADM-02 Kelola meja dan token QR. PERAN: Product Owner + Security Analyst. C·R·U·D meja; pembuatan token acak; rotasi token
(tokenRotated) dan dampak pada QR tercetak; cetak QR; menonaktifkan meja; hapus meja yang punya riwayat; mitigasi QR difoto.
F-ADM-03 Kelola akun staf. PERAN: Product Owner + Security Analyst. C·R·U·D akun dan peran, undangan/atur ulang kata sandi,
menonaktifkan akun (bukan hapus, audit tetap), batas satu pemilik, pindah outlet; hubungan Profile dengan Supabase Auth.
```

---

## H. Prompt revisi dan perbaikan (pakai setelah review)

```
Revisi <ID fitur> di docs/prd/modules/<modul>/<berkas> berdasarkan catatan: <catatan>.
Ubah HANYA bagian terkait; pertahankan ID story yang ada (jangan renomor); story baru memakai nomor berikutnya;
story yang dihapus ditandai DEPRECATED (alasan) bukan dihilangkan; perbarui OPEN-QUESTIONS dan PROGRESS; jalankan ulang
CEK-MANDIRI. Laporkan 5 baris: apa yang berubah, story terdampak, BR/J terdampak, Q baru, dampak ke fitur lain.
```

```
Konsistensikan istilah di seluruh docs/prd/ dengan glosarium 00-context.md. Daftar dulu semua kemunculan istilah yang menyimpang
(berkas:baris) dan TUNGGU persetujuan saya sebelum mengubah apa pun.
```
