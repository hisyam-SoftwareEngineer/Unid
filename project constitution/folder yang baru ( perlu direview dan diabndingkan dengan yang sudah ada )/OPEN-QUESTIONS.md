# OPEN-QUESTIONS

Dibuat: 6 Nov 2026 (P0). Direvisi 7 Nov 2026: Q-016 diubah ke opsi B; Q-026..Q-029 ditambahkan. Aturan: ambil nomor Q tertinggi lalu lanjutkan. Status: TERBUKA / DIJAWAB / DITOLAK.
Pertanyaan yang jawabannya hanya bisa datang dari T1-T3 ditandai [T1], [T2], [T3].

## Templat

```
Q-xxx  Judul
Status: TERBUKA
Pertanyaan:
Opsi A:
Opsi B:
Rekomendasi:
Dampak bila salah:
Keputusan manusia: (diisi manusia, tanggal)
```

---

## Pertanyaan P0

**Q-001 Perpanjangan batas waktu payment vs reservasi stok** 🔍
Status: DIJAWAB
Pertanyaan: `available_portions()` mengabaikan reservasi `held` yang `expires_at`-nya lewat (Jaminan J-04, Amandemen 3.4). Amandemen 5.6 memperpanjang `payment.expiresAt` (klaim, bukti, validator), tetapi tidak menyebut `reservation.expires_at`. Apakah reservasi ikut diperpanjang?
Opsi A: Setiap perpanjangan payment memperbarui `expires_at` semua reservasi `held` milik bill itu, atomik, lewat satu fungsi.
Opsi B: Reservasi tidak punya batas waktu sendiri dan mengikuti batas waktu payment (rumus J-04 berubah, perlu amandemen Jaminan).
Rekomendasi: A. Tidak mengubah Jaminan dan tidak mengubah keputusan terkunci; hanya melengkapi 5.6.
Dampak bila salah: porsi dijual ganda, ketersediaan negatif setelah customer sah membayar, dan stok oleh validator yang lambat.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-002 TRUNCATE pada tabel append-only**
Status: DIJAWAB
Pertanyaan: J-06 dan T-06 mewajibkan TRUNCATE ditolak. SQL 3.5 hanya menutup UPDATE dan DELETE; Amandemen Bagian 6 mengklaim TRUNCATE diblokir.
Opsi A: Tambah pemblokir TRUNCATE di migrasi J-06; reset test lewat template database.
Opsi B: Cabut hak TRUNCATE dari role aplikasi saja, tanpa trigger.
Rekomendasi: A (J-06 menyebut "termasuk service role", pencabutan hak tidak cukup).
Dampak bila salah: T-06 gagal atau jaminan ledger bolong.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-003 Pembatalan saat `awaiting_verification`** 🔍
Status: DIJAWAB
Pertanyaan: Demo Pack v1 5.2 mengizinkan batal pada payment non-final, sedangkan Amandemen hanya mengizinkan batal pesanan `placed`; order tetap `placed` selama menunggu verifikasi. Boleh batal?
Opsi A: Customer tidak boleh batal sampai validator memutuskan atau payment kedaluwarsa; kasir menolak lewat Tolak.
Opsi B: Boleh batal dengan kunci payment, siapa lebih dulu menang.
Rekomendasi: A (mencegah balapan dengan validator dan customer yang sudah transfer).
Dampak bila salah: payment valid dibatalkan saat uang masuk, atau balapan dua aksi.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-004 Profil rumah makan vs cakupan demo**
Status: DIJAWAB
Pertanyaan: Outlet sasaran adalah rumah makan [dinyatakan pemilik, 6 Nov 2026]. Rumah makan umumnya makan dulu, bayar kemudian, dan sering punya dapur terpisah [HIPOTESIS, belum ada data Malang]. Demo hanya pay_first tanpa dapur.
Opsi A: Demo tetap pay_first tanpa dapur; narasi demo jujur bahwa alur bayar di akhir ada di jalur produk (M3 MVP.md).
Opsi B: Naikkan pay_after dan dapur ke demo (mengubah keputusan 4 dan scope).
Rekomendasi: A. B memperbesar area 🔍 dan mengubah keputusan terkunci.
Dampak bila salah: demo terasa tidak cocok bagi rumah makan; wedge bisa dinilai di luar konteks.
Pertanyaan T2 yang memengaruhi: B1 (kapan bayar), B3 (dapur terpisah) [T2].
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-005 Persetujuan keputusan 12 (cutoff hari bisnis 03:00) dan 14**
Status: DIJAWAB
Pertanyaan: Keduanya berstatus "perlu persetujuan manusia". Rumah makan di Malang yang tutup malam? Jam tutup belum diketahui [ASUMSI].
Opsi A: Setujui 12 dan 14 apa adanya.
Opsi B: Setujui 14, ubah cutoff sesuai jam tutup outlet pilot.
Rekomendasi: A untuk demo (cutoff adalah kolom outlet, mudah diubah).
Dampak bila salah: stok dan kode pesanan memakai hari yang salah di sekitar tengah malam.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-006 Kode unik untuk `manual_qris`**
Status: DIJAWAB
Pertanyaan: Keputusan 13 memperluas kode unik ke `manual_qris` (usulan, [HIPOTESIS]). Disetujui?
Opsi A: Berlaku untuk keduanya, dengan flag `TRANSFER_UNIQUE_CODE`.
Opsi B: Hanya `transfer_proof` (Demo Pack v1).
Rekomendasi: A.
Dampak bila salah: nominal tidak persis bagi customer QRIS; bisa dimatikan lewat flag.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-007 Arsitektur: Vercel + Supabase vs Node/VPS**
Status: DIJAWAB
Pertanyaan: rekomendasi_arsitektur.md dan keputusan 23 Okt memilih hybrid Node/VPS; Demo Pack v1 (#2) dan ADR-0003 menunda sampai pilot. Batas durasi Vercel Hobby sudah terverifikasi 300 detik (4 Nov 2026, lihat rekomendasi_arsitektur.md); larangan komersial/ToS belum dicek dari halaman resmi.
Opsi A: Demo di Vercel + Supabase; ADR-0003 ditulis saat pilot direncanakan.
Opsi B: Mulai dengan Node di VPS sekarang.
Rekomendasi: A. Demo non-komersial, dan lapisan `server/services` memudahkan pindah.
Dampak bila salah: pilot terlambat pindah; tidak berdampak pada demo.
Tindakan manusia: cek batas dan ToS dari halaman resmi sebelum D-01.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-008 Kekosongan data riset**
Status: DIJAWAB
Pertanyaan: R1 Gelombang 3 belum ada; data Malang untuk pola bayar, frekuensi menu habis, perangkat dan sinyal kosong; R1 Gelombang 1 terlampir dua salinan; ambang PBJT Kota Malang sudah dipastikan Rp15 juta (Perda 1/2025, 7 Nov 2026).
Opsi A: Lanjutkan P1-P3 dengan semua kekosongan berlabel [HIPOTESIS] dan jadikan bahan T2.
Opsi B: Tunggu Gelombang 3.
Rekomendasi: A.
Dampak bila salah: persona dan metrik terlalu optimistis; dimitigasi label dan T2.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-009 Pembaruan MVP.md dan penulisan ADR-0003**
Status: DIJAWAB
Pertanyaan: Amandemen 8.4 meminta MVP.md diperbarui (empat PaymentProvider, ADR-0001 diterima untuk demo) dan ADR-0003 ditulis. P0 tidak mengubah sumber.
Opsi A: Manusia memperbarui; saya menyiapkan usulan perubahan.
Opsi B: Biarkan sampai pilot.
Rekomendasi: A, setelah P3 selesai.
Dampak bila salah: dokumen produk dan demo bertentangan.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-010 Data seed rumah makan**
Status: DIJAWAB
Pertanyaan: Nama rumah makan, menu, varian, jumlah meja, dan rekening/QRIS tujuan untuk demo.
Opsi A: Menu rumah makan generik (nasi, lauk, minuman) berlabel [ASUMSI]; rekening dan QRIS dummy lewat env.
Opsi B: Data nyata dari outlet pilot.
Rekomendasi: A sampai outlet pilot dikonfirmasi.
Dampak bila salah: demo kurang meyakinkan; tidak mengubah kode.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-011 Penjadwal sweeper**
Status: DIJAWAB [BELUM TERVERIFIKASI]
Pertanyaan: Cron Vercel Hobby dan pg_cron di tier gratis belum dicek.
Opsi A: Penjadwal eksternal 1-5 menit + oportunistik saat staf memuat antrean (Amandemen 5.8).
Opsi B: Hanya oportunistik.
Rekomendasi: A; kebenaran ketersediaan tidak bergantung sweeper.
Dampak bila salah: status kedaluwarsa tampil terlambat, bukan stok salah.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-012 Pemilik membuka /logistik**
Status: DIJAWAB (dari sumber)
Pertanyaan: Demo Pack v1 pertanyaan 3. Matriks Bagian 6 mengizinkan pemilik mengisi stok dan melihat ledger; P8 menyebut "pemilik boleh keduanya".
Rekomendasi: ya. Konfirmasi manusia diminta saat P2.

**Q-013 Batas 2 MB bukti dan kompresi**
Status: DIJAWAB (dari sumber)
Jawaban: Amandemen 5.9 mengompres di klien (sisi maks 1600 px, kualitas 0,8).
Dampak: tidak ada tindakan; tetap uji di F-CUS-06.

**Q-014 Pembagian P5 (US-PAY), DL-PAY, dan fitur pembayaran**
Status: DIJAWAB
Pertanyaan: Pack 2 menyatakan aturan domain payment ada di P5, v2.1 memindahkan logika ke DL-PAY, dan story ada di fitur CUS-05..07, KAS-03..06. Risiko story ganda.
Opsi A: P5 = PRD produk pembayaran (tujuan, risiko, cakupan, aturan tingkat produk) dengan story minimal lintas-fitur; logika di DL-PAY; story rinci hanya di fitur.
Opsi B: P5 berisi semua story pembayaran, fitur hanya merujuk.
Rekomendasi: A.
Dampak bila salah: duplikasi dan kontradiksi (diperiksa di R-modul dan P13).
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-015 Cakupan penulisan P8 (akses) lebih awal**
Status: DIJAWAB
Pertanyaan: P8 hanya butuh P2, sehingga bisa dikerjakan sebelum P5. Urutan yang disarankan di PROGRESS.md memanfaatkan itu agar dimulai dari sistem yang pertama digunakan (akses dan sesi).
Opsi A: Ikuti urutan bagian di PROGRESS.md.
Opsi B: Ikuti urutan Pack apa adanya (P0-P3, P5, DL, L1...).
Rekomendasi: A; tidak melanggar prasyarat.
Dampak bila salah: tidak ada, hanya urutan.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

## Pertanyaan dari P2 dan P3 (6 Nov 2026)

**Q-016 Bukti yang ditolak dan pesan ulang**
Status: DIJAWAB 🔍
Pertanyaan: `payment_proofs` unik per (outlet, sha256), sehingga file yang ditolak tidak bisa diunggah lagi pada pesanan baru (`PROOF_DUPLICATE`). Customer yang sah tetapi ditolak karena kesalahan validator tidak bisa memakai foto yang sama.
Opsi A: Biarkan; customer harus memotret ulang (mutasi tetap dasar verifikasi).
Opsi B: Keunikan hanya berlaku untuk bukti pada payment yang belum final atau yang `paid`.
Rekomendasi: B, karena bukti yang ditolak tidak menjadi dasar uang; tetapi mengubah indeks Skema (perlu persetujuan manusia).
Dampak bila salah: A menghambat customer sah; B melemahkan anti-pakai-ulang bila indeks salah dirancang.
Keputusan manusia: **Opsi B** — diubah dari A ke B oleh manusia, 7 Nov 2026. Aturan: hash SHA-256 bukti hanya harus unik di antara bukti milik payment non-final atau `paid`; bukti pada payment `rejected`, `expired`, `cancelled` tidak memblokir unggahan baru. Konsekuensi pada Skema dan Jaminan DB: lihat Q-028.

**Q-017 Tampilan sisa porsi ke customer**
Status: DIJAWAB
Pertanyaan: Customer hanya melihat tersedia atau HABIS, atau juga jumlah sisa (mis. "sisa 3")? Sumber hanya menyebut HABIS dan sisa di respons `OUT_OF_STOCK`.
Opsi A: Hanya tersedia atau HABIS.
Opsi B: Tampilkan sisa bila ≤ 5.
Rekomendasi: A untuk demo (angka bisa menyesatkan karena reservasi `held`).
Dampak bila salah: customer menduga sisa pasti; tidak ada dampak data.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-018 Akses kasir ke ledger dan metode bayar walk-in**
Status: DIJAWAB
Pertanyaan: (1) Matriks Demo Pack v1 menulis kasir "lihat" ledger tetapi tidak menyebut permukaannya. (2) Pesanan walk-in memakai "service yang sama" tetapi metode bayarnya tidak disebut.
Opsi A: Kasir melihat ledger di /kasir (hanya baca); walk-in boleh semua metode kecuali sandbox.
Opsi B: Kasir tidak melihat ledger; walk-in hanya tunai dan manual_qris.
Rekomendasi: A untuk ledger; walk-in: tunai dan manual_qris.
Dampak bila salah: kasir tidak tahu sisa stok, atau jalur sandbox bocor.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-019 Menurunkan `opening` di bawah reservasi berjalan; masa HABIS manual**
Status: DIJAWAB 🔍
Pertanyaan: (1) Bila `opening` diturunkan sehingga ketersediaan negatif karena reservasi `held`, apa yang terjadi pada reservasi yang sudah ada? (2) `manualSoldOut` berlaku sampai kapan (reset harian atau manual)?
Opsi A: (1) Penurunan ditolak bila di bawah jumlah reservasi `held` + terjual; (2) manual sampai dibuka kembali.
Opsi B: (1) Diizinkan, ketersediaan negatif ditampilkan 0; (2) reset otomatis tiap hari bisnis.
Rekomendasi: A untuk (1); B untuk (2).
Dampak bila salah: pesanan sah tak terpenuhi; atau menu tetap HABIS keesokan harinya.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-020 Perpanjangan validator pada status tertentu**
Status: DIJAWAB
Pertanyaan: Perpanjangan +15 menit (maks 2×) berlaku untuk payment berstatus apa saja? Sumber tidak menyebut.
Opsi A: Hanya `awaiting_verification` dan `awaiting_cash`.
Opsi B: Semua status non-final.
Rekomendasi: A.
Dampak bila salah: payment `pending` diperpanjang tanpa klaim customer.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-021 Takeaway tanpa token meja**
Status: DIJAWAB 🔍
Pertanyaan: `tableToken` opsional pada `CreateOrderInput`. Pesanan takeaway tanpa meja tidak punya batas per meja (kontrol keamanan utama).
Opsi A: Takeaway wajib lewat QR outlet khusus yang menjadi "meja" takeaway.
Opsi B: Batas dihitung per sesi dan per IP saja.
Rekomendasi: A.
Dampak bila salah: pesanan takeaway iseng menahan porsi tanpa batas meja.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-022 Kode kesalahan tunai kurang**
Status: DIJAWAB
Pertanyaan: Kode dan pesan error bila `amountReceived` < `payment.amount` belum ditentukan.
Opsi A: `AMOUNT_INSUFFICIENT` 422 dengan pesan "Uang diterima kurang dari tagihan".
Opsi B: Memakai `AMOUNT_MISMATCH`.
Rekomendasi: A.
Dampak bila salah: pesan membingungkan kasir.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-023 Daftar aksi audit**
Status: DIJAWAB
Pertanyaan: Sumber hanya menyebut sebagian aksi audit. Daftar lengkap diperlukan agar bisa diuji.
Opsi A: Semua aksi sensitif: verifikasi, tolak, tunai, perpanjang, expired_with_proof, isi stok, HABIS manual, pembatalan oleh staf, walk-in.
Opsi B: Hanya yang disebut sumber.
Rekomendasi: A.
Dampak bila salah: jejak tidak lengkap saat sengketa.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-024 Retensi file bukti transfer**
Status: DIJAWAB 🔍
Pertanyaan: Berapa lama file bukti disimpan, dan siapa yang menghapus setelah selesai? Bukti bisa memuat data pribadi.
Opsi A: Simpan sampai akhir demo; hapus manual.
Opsi B: Hapus otomatis setelah N hari (angka perlu keputusan).
Rekomendasi: A untuk demo; tentukan N sebelum pilot.
Dampak bila salah: data pribadi tersimpan lama.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

**Q-025 Penghitung kode pesanan: satu atau per jenis**
Status: DIJAWAB
Pertanyaan: JD J-10 menyebut penghitung per (outlet, hari bisnis, jenis); AM 5.5 memakai satu kunci `pickup` untuk awalan A dan B. A-001 dan B-001 bisa ada bersamaan atau tidak?
Opsi A: Dua penghitung terpisah (A dan B masing-masing mulai 001).
Opsi B: Satu penghitung bersama (A-001, B-002, A-003).
Rekomendasi: A (mengikuti JD, yang berprioritas lebih tinggi); AM 5.5 disesuaikan.
Dampak bila salah: nomor melompat bagi customer.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026

## Pertanyaan baru dari revisi 7 Nov 2026

**Q-026 Metode bayar pesanan walk-in (teks Opsi A vs rekomendasi Q-018)**
Status: DIJAWAB
Pertanyaan: Keputusan Q-018 "Opsi A". Teks Opsi A berbunyi "walk-in boleh semua metode kecuali sandbox", sedangkan baris Rekomendasi menulis "walk-in: tunai dan manual_qris". Keduanya tidak sama. Dokumen P2 dan P3 memakai teks Opsi A secara harfiah sampai dikonfirmasi.
Opsi A: Tunai, manual_qris, dan transfer_proof (semua kecuali sandbox).
Opsi B: Hanya tunai dan manual_qris.
Rekomendasi: B (walk-in terjadi di depan kasir; transfer dengan bukti foto tidak diperlukan).
Dampak bila salah: jalur bukti transfer terbuka untuk walk-in tanpa kebutuhan; atau kasir tidak bisa menerima transfer.
Keputusan manusia: Opsi B — disetujui 7 Nov 2026. Walk-in hanya tunai dan manual_qris; transfer_proof tidak diizinkan untuk walk-in.

**Q-027 Kode kesalahan penurunan `opening` dan pengingat HABIS manual**
Status: DIJAWAB
Pertanyaan: Q-019 opsi A menolak penurunan `opening` di bawah jumlah reservasi `held` ditambah terjual, tetapi kode dan pesan error belum ditentukan. Opsi A juga membuat `manualSoldOut` berlaku sampai dibuka kembali (tanpa reset harian), sedangkan rekomendasi awal untuk bagian ini adalah reset harian; risiko menu HABIS keesokan hari karena lupa dibuka.
Opsi A: Kode `STOCK_BELOW_COMMITTED` 422 dengan pesan yang menyebut jumlah minimum; layar isi stok pagi menampilkan daftar menu yang masih HABIS manual (usulan).
Opsi B: Hanya kode error; tanpa daftar pengingat.
Rekomendasi: A.
Dampak bila salah: pesan membingungkan; atau menu tetap HABIS tanpa disadari.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026. Kode `STOCK_BELOW_COMMITTED` 422; pesan menyebut jumlah minimum yang diizinkan (reservasi held + terjual hari itu). Layar isi stok menampilkan daftar menu yang masih HABIS manual sebagai pengingat tiap pagi.

**Q-028 Mekanisme keunikan hash bukti setelah Q-016 opsi B** 🔍
Status: DIJAWAB (mengubah kontrak beku: Skema dan Jaminan DB; perlu persetujuan manusia)
Pertanyaan: Q-016 opsi B membuat keunikan hash bergantung pada status payment yang berada di tabel lain. Indeks unik biasa tidak bisa melakukannya.
Opsi A: Tabel bukti memuat penanda "aktif" yang dimatikan oleh transisi final payment (rejected, expired, cancelled) di transaksi yang sama, dan keunikan berlaku hanya pada baris aktif (dijamin di database; masuk jaminan baru dan manifest T-00).
Opsi B: Pemeriksaan hanya di kode aplikasi.
Rekomendasi: A (keputusan terkunci: aturan uang dijamin database, bukan hanya aplikasi; B rawan balapan unggah paralel).
Dampak bila salah: B membuka pemakaian ulang bukti saat paralel; A menambah satu kolom dan satu jaminan (migrasi).
Keputusan manusia: Opsi A — disetujui 7 Nov 2026. Kolom is_active (default true) + partial unique index ON (outlet_id, sha256) WHERE is_active=true; transisi final payment (rejected/expired/cancelled) mematikan is_active dalam transaksi yang sama; dijamin DB + entri Jaminan baru + manifest T-00. Mengubah kontrak beku (Skema, Jaminan DB) → implementasi via task D-xx terpisah dengan persetujuan, bukan otomatis.

**Q-029 Dampak takeaway lewat QR khusus pada batas per meja** 🔍
Status: DIJAWAB
Pertanyaan: Q-021 opsi A membuat takeaway memakai satu QR outlet sebagai "meja" takeaway. Batas per meja (maks 3 order belum bayar, maks 1 order tunai aktif) akan berlaku untuk seluruh pelanggan takeaway sekaligus, sehingga bisa terlalu ketat. Selain itu `tableToken` di `CreateOrderInput` kini wajib untuk semua pesanan customer (perubahan kontrak beku).
Opsi A: Meja takeaway diberi batas sendiri yang lebih longgar (angka perlu keputusan; mis. berdasarkan `sid`), kontrak diubah menjadi `tableToken` wajib.
Opsi B: Beberapa QR takeaway (satu per loket atau per area) dengan batas yang sama.
Rekomendasi: A.
Dampak bila salah: pelanggan takeaway sah ditolak karena batas bersama; atau batas dilonggarkan tanpa kontrol.
Keputusan manusia: Opsi A — disetujui 7 Nov 2026. Takeaway: satu QR outlet, batas per (tableToken, sid) (angka dipakai ulang: 3 belum-bayar / 1 tunai); dine-in tetap per tableToken. tableToken wajib hanya untuk pesanan customer; walk-in (source=walk_in) tableToken diisi service dari pilihan kasir (meja/takeaway), kasir tidak pegang token. Mengubah kontrak beku (CreateOrderInput) → implementasi via task D-xx terpisah dengan persetujuan, bukan otomatis.

## Pertanyaan yang hanya bisa dijawab T1-T3

| Pertanyaan | Tes |
|---|---|
| Apakah kompetitor gratis sudah punya auto-habis berbasis stok di halaman customer? | T1 |
| Apakah rumah makan menghitung ketersediaan dalam porsi dan mau mengisi stok tiap pagi? | T2, T3 |
| Seberapa sering menu habis setelah dipesan, dan kapan rumah makan bayar? | T2 (A1, B1) |

## Usulan perubahan keputusan terkunci

Tidak ada yang diterapkan otomatis. Q-001 melengkapi, bukan mengubah, keputusan terkunci. Q-028 dan Q-029 kini DIJAWAB (Opsi A, disetujui 7 Nov 2026); perubahan kontrak beku (Skema/Jaminan DB/CreateOrderInput) menunggu task implementasi terpisah, tidak diterapkan otomatis.
