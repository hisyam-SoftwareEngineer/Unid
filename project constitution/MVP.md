# MVP Web App F&B Multi-Modul

Dokumen tunggal proyek MVP web app F&B untuk UMKM Indonesia (warung dan rumah makan mikro).
Terakhir diperbarui: 7 Nov 2026.

**Status satu baris:** G0 belum lolos (T1, T2, T3 belum dijalankan). Wedge disetujui sebagai arah kerja provisional (7 Nov 2026); G0 belum lolos. Fase 1 draft selesai, menunggu persetujuan manusia. Fase 8 ke atas (kode produk) terkunci.

## Isi

1. Status dan keputusan yang menunggu manusia
2. G0: validasi wedge (ambang, T1, T2, data sekunder, T3)
3. Fase 1: scope (44 fitur, non-goals, milestone)
4. ADR-0001: metode bayar tunai
5. Register klaim dan sumber
6. Template tugas, review, dan ADR
7. Lampiran A: master prompt (instruksi proyek untuk AI)

## Cara memakai

1. Pasang Lampiran A sebagai instruksi proyek (Claude Project, atau `AGENTS.md` di root repo untuk Antigravity).
2. Tempel atau lampirkan dokumen asli "Brainstorm Web App F&B Tahap 0". Dokumen itu sumber kebenaran; jika bertentangan dengan master prompt, dokumen itu yang berlaku. **Dokumen asli belum ada di sini**, jadi ambang T1 sampai T3 belum dicocokkan.
3. Pesan pembuka: *Baca master prompt ini dan dokumen Tahap 0 yang terlampir. Konfirmasi pemahamanmu, laporkan status gate G0, lalu tunggu kata "lanjut" untuk Fase 1.*
4. Kerja per fase; berhenti di gate; lanjut hanya setelah manusia menulis "lanjut".

---

## 1. Status dan keputusan yang menunggu manusia

Terakhir diperbarui: 7 Nov 2026

### Fase dan gate

| Fase | Status | Bukti / catatan |
| --- | --- | --- |
| G0 Validasi wedge | **Belum lolos** | T1, T2, T3 belum dijalankan. Instrumen: `g0-validasi/`. Ambang diambil dari master prompt, belum dicocokkan dengan dokumen Tahap 0 asli |
| 1 Scope | Draft selesai, **menunggu persetujuan manusia** | Bagian 3 |
| 2 Alur dan state machine | Belum dimulai | |
| 3 Spesifikasi modul | Belum dimulai | |
| 4 Data model dan RLS | Belum dimulai | Contract freeze di fase ini |
| 5 Arsitektur dan ADR | Belum dimulai | ADR-0001 diusulkan |
| 6 Keamanan | Belum dimulai | |
| 7 Backlog siap-agent | Belum dimulai | |
| 8 sampai 11 | **Terkunci** | Menunggu G0 lolos dan kontrak beku |

### Keputusan yang menunggu manusia

1. Lampirkan dokumen asli Tahap 0 (dokumen Tahap 0 asli) dan cocokkan ambang T1 sampai T3.
2. Kunci aturan coding A1 sampai A3 di Bagian 2 (T2) sebelum wawancara pertama.
3. Setujui atau tolak klasifikasi fitur di Bagian 3.
4. Setujui atau tolak empat penyesuaian milestone (lihat bagian Keputusan di Bagian 3).
5. Putuskan ADR-0001: pembayaran tunai sebagai metode ketiga atau tidak.
6. Apakah outlet pilot menarik pajak atau biaya layanan? Jika ya, fitur A14 naik ke MVP.
7. Apakah pay_after wajib di MVP, atau cukup pay_first dulu?
8. Kapasitas tim: dua developer penuh waktu atau sebagian waktu?
9. Apakah sudah ada calon outlet pilot, dan apakah dapurnya terpisah dari kasir?

### Pertanyaan yang jawabannya hanya bisa datang dari T1 sampai T3

- Apakah kompetitor gratis sudah punya auto-habis berbasis stok? (T1)
- Apakah warung menghitung ketersediaan dalam porsi dan mau mengisi stok tiap pagi? (T2, T3)

---

## 2. G0: validasi wedge

### G0: Validasi wedge

Gerbang sebelum kode produk (Fase 8 ke atas) boleh dimulai. Pemutus: manusia.
Wedge yang diuji: **menu otomatis HABIS berdasarkan stok porsi harian**.

#### Keluaran

- Laporan teardown kompetitor (T1)
- Rekap wawancara 4 sampai 7 pelaku usaha S1 (T2)
- Hasil prototipe klik (T3)

#### Ambang lolos

Ambang ini hipotesis, ditetapkan sebelum pengujian, dan tidak diubah setelah melihat hasil.
Diambil dari Bagian 5 master prompt; **belum dicocokkan dengan dokumen Tahap 0 asli**.

| Tes | Lolos jika |
| --- | --- |
| T1 Teardown kompetitor | Kurang dari 2 kompetitor yang bisa dicoba gratis sudah punya auto-habis berbasis stok |
| T2 Wawancara | Minimal 3 responden mengalami menu habis-setelah-dipesan sekali per minggu atau lebih; minimal 3 menghitung dalam porsi; minimal 3 mau mengisi stok porsi harian |
| T3 Prototipe klik | Minimal 2 dari 3 pemilik mengisi stok 10 menu dalam 3 menit tanpa bantuan |

#### Jika gagal

- Gagal T1 atau T2: wedge diganti.
- Gagal T3: sederhanakan input dulu (mis. "salin stok kemarin").

#### Dampak ke pekerjaan

- Selama G0 belum lolos, Fase 8 ke atas terkunci.
- Fase 1 sampai 7 boleh berjalan paralel dengan T1 dan T2.
- Wedge dan Mode Resep berstatus provisional.

#### Status

| Tes | Instrumen | Dijalankan | Hasil |
| --- | --- | --- | --- |
| T1 | Bagian 2 (T1) | Belum | |
| T2 | Bagian 2 (T2) | Belum | |
| T3 | Bagian 2 (T3) (draft) | Belum | |

**G0: belum lolos.**

### T1: Teardown kompetitor

Pelaksana: manusia (trial akun, baca halaman resmi). Perkiraan: 1 sampai 2 hari.
Hasil T1 hanya sah jika berasal dari percobaan langsung atau halaman resmi, bukan dari blog pihak ketiga.

#### Kompetitor

Majoo, Qasir, Kasir Pintar, Loyverse, Menuku. Tambahkan jika menemukan yang relevan untuk segmen S1.

#### Definisi (kunci sebelum mulai)

- **Bisa dicoba gratis:** akun trial atau paket gratis cukup untuk menguji fitur tanpa membayar.
- **Auto-habis berbasis stok:** menu otomatis tidak bisa dipesan di halaman customer ketika stok (porsi atau bahan) mencapai nol, tanpa kasir menandai manual.
- Ketiganya harus dicek terpisah: **(a)** fitur ada, **(b)** bisa dicoba gratis, **(c)** tampil di halaman customer.

#### Lembar catatan (satu per kompetitor)

| Item | Hasil | Bukti (URL atau path screenshot) |
| --- | --- | --- |
| Bisa dicoba gratis? Sampai kapan, batasan apa | | |
| Self-order atau QR meja: ada? Gratis atau tier berbayar | | |
| Auto-habis berbasis stok porsi, tampil di halaman customer | | |
| Auto-habis berbasis bahan baku | | |
| Kasir menandai HABIS manual saja? | | |
| HPP dan margin per menu: ada di tier mana | | |
| QRIS dinamis: ada? | | |
| Verifikasi pembayaran: dari mutasi atau notifikasi, atau hanya konfirmasi manual | | |
| Harga tier terendah yang membuka self-order + stok (dari halaman resmi) | | |
| Catatan lain | | |

#### Item verifikasi dari laporan (wajib dijawab)

- [ ] Qasir: apakah Pro benar-benar membuka self-order dan resep; harga resmi tier (klaim Rp699rb sampai 1,2jt per tahun)
- [ ] Majoo: harga tier terendah
- [ ] Kasir Pintar: QR Order/QR Meja, peringatan stok, plugin bahan baku
- [ ] Menuku: perlakukan sebagai klaim vendor sampai dicoba langsung
- [ ] Loyverse: apakah komponen/composite di paket gratis menghasilkan auto-habis di sisi customer (self-order customer tidak ada bukti kuat menurut laporan)

#### Keputusan T1

- Hitung kompetitor yang memenuhi (a), (b), dan (c) sekaligus.
- **Lolos** jika jumlahnya kurang dari 2. **Gagal** jika 2 atau lebih: wedge diganti.
- Jumlah: ___  Hasil: ___  Diputuskan oleh / tanggal: ___

### T2: Wawancara pelaku usaha S1

Responden: 4 sampai 7 pemilik warung atau rumah makan mikro (satu outlet, sekitar 2 sampai 6 orang, HP Android,
sudah menerima QRIS statis) [HIPOTESIS profil]. Usahakan tidak semuanya dari satu lokasi atau satu lingkaran kenalan.

#### Aturan pewawancara

- Tanyakan kejadian terakhir yang nyata (kapan, apa yang terjadi), bukan pendapat atau niat.
- Jangan menyebut "porsi", "stok", atau nama produk sebelum responden menyebutnya. Jangan menawarkan solusi.
- Catat kutipan asli dan tanggal kejadian.
- **Aturan coding A1 sampai A3 dikunci sebelum wawancara pertama dan tidak diubah sesudahnya.**
  Dikunci oleh / tanggal: ___

#### A. Penentu G0

| # | Pertanyaan | Coding (usulan; manusia yang mengunci) |
| --- | --- | --- |
| A1 | "Kapan terakhir pelanggan sudah pesan, lalu menunya ternyata habis? Ceritakan. Dua minggu terakhir, berapa kali?" | Lolos jika kejadian terakhir 7 hari lalu atau kurang dan frekuensi sekali per minggu atau lebih |
| A2 | "Pagi tadi sebelum buka, bagaimana Ibu/Bapak tahu menu [utama] cukup untuk hari ini? Apa yang dilihat atau dihitung?" | Porsi (piring, bungkus, potong), Bahan (kg, liter, butir), atau Perkiraan (lihat panci). Lolos hanya jika menyebut porsi tanpa dipancing |
| A3 | "Kapan terakhir Ibu/Bapak mencatat jumlah atau sisa masakan hari itu? Di mana?" Lanjut: "Kalau tiap pagi mengetik jumlah sekitar 10 menu di HP, sekitar 3 menit, apa yang membuatnya mudah atau sulit?" Tutup: "Mau mencoba seminggu mulai besok, dan boleh saya hubungi lagi?" | Lolos hanya jika ada kebiasaan mencatat serupa dalam 30 hari terakhir, atau bersedia uji coba 1 minggu |

T2 lolos jika A1, A2, dan A3 masing-masing mencapai minimal 3 responden.

#### B. Pendukung keputusan Fase 1 (bukan ambang G0)

| # | Pertanyaan | Menjawab |
| --- | --- | --- |
| B1 | "Ceritakan transaksi terakhir dari pelanggan datang sampai bayar. Kapan bayarnya? Kalau pelanggan tambah pesanan, bagaimana?" | Apakah pay_after wajib di MVP |
| B2 | "Kalau pelanggan bilang sudah bayar QRIS, bagaimana memastikan uangnya masuk? Pernah ternyata belum masuk atau palsu? Kapan?" | Alur verifikasi kasir |
| B3 | "Saat ramai, siapa yang terima pesanan, siapa yang masak, siapa pegang kasir? Pesanan sampai ke yang masak lewat apa?" | Dapur terpisah atau tidak (flag /dapur) |
| B4 | "Apakah ada pajak atau biaya layanan di harga atau struk? Kapan terakhir ada yang menanyakannya?" | Kalkulasi total bill (fitur A14) |
| B5 | "Apa yang dipakai sekarang untuk mencatat penjualan? Kapan terakhir membayar aplikasi atau alat usaha, berapa?" | Kesediaan bayar (dari pengeluaran nyata, bukan niat) |
| B6 | "Kapan terakhir ada masakan terbuang? Berapa banyak, kenapa?" | Rekap terbuang (M4) |
| B7 | "HP untuk usaha: merek dan umurnya? Pakai paket data atau wifi? Kapan terakhir sinyal bermasalah saat jualan?" | Kelayakan online-only |
| B8 | "Pernah pelanggan minta pesan sendiri lewat HP, atau pernah mencoba QR meja? Apa yang terjadi?" | Dampak QR meja |

#### Lembar catatan per responden

Salin blok ini untuk tiap responden.

```
Kode responden: R__            Tanggal: ___          Pewawancara: ___
Profil: jenis usaha ___ | jumlah orang ___ | lama usaha ___ | lokasi ___

A1  hasil: [lolos / tidak]   tanggal kejadian terakhir: ___   frekuensi: ___   kutipan: "..."
A2  hasil: [Porsi / Bahan / Perkiraan]   disebut tanpa dipancing: [ya / tidak]   kutipan: "..."
A3  kebiasaan mencatat 30 hari: [ada / tidak]   bersedia uji 1 minggu: [ya / tidak]   kutipan: "..."

B1: ...   B2: ...   B3: ...   B4: ...   B5: ...   B6: ...   B7: ...   B8: ...
Catatan bebas: ...
```

#### Rekap

| Kriteria | Jumlah lolos | Target | Hasil |
| --- | --- | --- | --- |
| A1 menu habis-setelah-dipesan sekali per minggu atau lebih | | 3 | |
| A2 menghitung dalam porsi (tanpa dipancing) | | 3 | |
| A3 mau mengisi stok porsi harian | | 3 | |

Diputuskan oleh / tanggal: ___

### T2: jawaban berbasis data sekunder

**Ini bukan hasil wawancara dan tidak dihitung sebagai responden.** Ambang G0 hanya boleh diukur dari wawancara nyata.
Dokumen ini dipakai sebagai bahan latihan wawancara, asumsi kerja Fase 1 sampai 7 (selalu berlabel [HIPOTESIS]),
dan penentu prioritas pertanyaan di lapangan. Jangan dikutip ke dokumen desain sebagai temuan.

Sumber: laporan gabungan 20 Okt 2026 (lihat Bagian 5).

| # | Pertanyaan (ringkas) | Jawaban yang paling mungkin menurut data | Dasar | Kekuatan |
| --- | --- | --- | --- | --- |
| A1 | Kapan terakhir menu habis setelah dipesan? Seberapa sering? | Kejadian kemungkinan ada, tetapi frekuensi mingguan tidak bisa diisi | Studi kasus Jawa Timur: kesalahan stok sekitar 10% pada pencatatan manual [BELUM TERVERIFIKASI]; tidak ada data frekuensi | Lemah |
| A2 | Bagaimana tahu menu cukup untuk hari ini? | Perkiraan ketersediaan dalam porsi per hari ("menu X laku 20 sampai 30 porsi, siapkan bahan segitu"); belanja bahan memakai satuan bahan dan siklus beli | Studi HPP (Ayam Penyet Ngapak, Bungo Lado) dan panduan praktis [HIPOTESIS] | Sedang untuk produksi dan HPP; lemah untuk hitungan harian |
| A3 | Kapan terakhir mencatat sisa porsi? Mau isi stok 10 menu tiap pagi? | Pencatatan manual di buku atau Excel, tidak konsisten. Kesediaan mengisi tiap pagi: tidak bisa diisi | Warung Modus Denpasar; angka 77% manual [BELUM TERVERIFIKASI] | Sedang untuk kebiasaan; **kosong** untuk kesediaan (hanya T3 yang bisa menjawab) |
| B1 | Transaksi terakhir: bayar kapan? | Tidak bisa diisi | Tidak ada data sekunder | **Kosong** |
| B2 | Bagaimana memastikan uang QRIS masuk? | Sumber menyarankan cek notifikasi atau mutasi; praktik sebenarnya tidak diketahui. Kasus stiker dan screenshot palsu terdokumentasi | Telkomsel Enterprise, Kompas TV, Liputan6 [FAKTA kualitatif]; tanpa angka kerugian | Sedang (kualitatif) |
| B3 | Siapa terima pesanan, masak, pegang kasir saat ramai? | Tidak bisa diisi. Profil S1 2 sampai 6 orang membuat kasir merangkap dapur mungkin, tetapi itu asumsi profil | Profil dari laporan Grok [HIPOTESIS] | **Kosong** |
| B4 | Ada pajak atau biaya layanan di harga? | Tidak bisa diisi | Aturan pajak daerah [BELUM TERVERIFIKASI] | **Kosong** |
| B5 | Alat catat penjualan sekarang? Apa yang dibayar? | Buku atau Excel, atau POS gratis. Langganan berbayar ada di pasar; nominal yang dikeluarkan responden tidak diketahui | Loyverse (inventori dasar gratis, Advanced $25 per bulan) dan Qasir (self-order di Pro atau Pro Plus) [FAKTA]; digitalisasi 25 sampai 39% [BELUM TERVERIFIKASI] | Sedang untuk pola; kosong untuk nominal |
| B6 | Kapan terakhir masakan terbuang? | Bahan baku besar secara biaya (sekitar 76% biaya produksi di studi Bungo Lado), tetapi frekuensi dan jumlah terbuang tidak ada | Studi sampel kecil | Lemah |
| B7 | HP, paket data, sinyal saat jualan? | Tidak bisa diisi. Merchant QRIS 42 sampai 43 juta (lebih dari 90% UMKM) hanya konteks bahwa bayar digital umum | Laporan Bagian I, tanpa URL | **Kosong** |
| B8 | Pernah coba QR meja atau pesan sendiri? | Tidak bisa diisi. Self-order ada di tier berbayar, tetapi dampaknya masih klaim pemasaran | Qasir [FAKTA tier]; dampak [BELUM TERVERIFIKASI] | Lemah |

#### Prioritas di lapangan

Empat pertanyaan tanpa data yang paling memengaruhi scope: **B1** (pay_after di MVP), **B3** (dapur),
**B4** (pajak), dan kesediaan di **A3**.

### T3: Uji prototipe klik (draft)

**Status: draft.** Master prompt hanya memberi ambang. Protokol di bawah adalah usulan; manusia mengunci sebelum uji pertama.

#### Tujuan dan ambang

Menguji apakah pemilik warung bisa mengisi stok porsi harian dengan ringan.
**Lolos jika minimal 2 dari 3 pemilik mengisi stok 10 menu dalam 3 menit tanpa bantuan.**
Gagal T3: sederhanakan input dulu (mis. "salin stok kemarin").

#### Peserta

3 pemilik atau pengelola warung S1. Disarankan sebagian dari peserta T2 yang bersedia dihubungi lagi (A3).

#### Prototipe

- Satu layar daftar 10 menu dengan satu isian angka porsi per menu dan satu tombol Simpan.
- Data menu contoh berisi nama menu yang mirip warung peserta (isi sebelum uji).
- Varian B (jika uji pertama gagal): tombol "Salin stok kemarin" yang mengisi semua angka lalu bisa diubah.
- Dijalankan di HP Android peserta atau HP Android biasa.

#### Aturan uji (usulan, kunci sebelum mulai)

- **Mulai:** layar daftar menu dibuka. **Selesai:** tombol Simpan ditekan dengan 10 menu terisi.
- **Tanpa bantuan:** peserta tidak bertanya apa pun ke pewawancara dan tidak diberi petunjuk. Satu pertanyaan atau petunjuk berarti peserta itu tidak lolos.
- Pewawancara membacakan tugas yang sama untuk semua peserta: "Anggap ini pagi hari sebelum buka. Isi jumlah porsi tiap menu untuk hari ini."
- Catat: waktu, jumlah salah ketuk, titik peserta berhenti atau bingung, komentar spontan.

#### Lembar catatan

| Peserta | Waktu (detik) | Bantuan diminta? | Selesai 10 menu? | Lolos (3 menit, tanpa bantuan) | Catatan |
| --- | --- | --- | --- | --- | --- |
| P1 | | | | | |
| P2 | | | | | |
| P3 | | | | | |

Jumlah lolos: ___ dari 3. Hasil: ___  Diputuskan oleh / tanggal: ___

---

## 3. Fase 1: scope

### Fase 1: Scope

Status: **draft, menunggu persetujuan manusia.** Terakhir diperbarui: 7 Nov 2026.
Wedge dan Mode Resep provisional sampai G0 lolos. Fitur yang bergantung pada wedge ditandai "menunggu G0".

#### Kriteria klasifikasi

- **MVP:** wajib agar satu outlet bisa memakai sistem dengan aman (uang, stok, akses), atau menopang wedge.
- **V2:** memperbaiki operasi atau adopsi setelah pilot.
- **V3:** ekspansi di luar satu outlet.

MS = milestone.

#### A. Pesan, bayar, kasir (Stream A)

| # | Fitur | Kelas | MS | Alasan |
| --- | --- | --- | --- | --- |
| A1 | Menu per kategori dengan varian dan catatan item | MVP | M1 | Inti pemesanan |
| A2 | Order dine-in via QR meja dan takeaway | MVP | M1 | Keputusan terkunci |
| A3 | Kalkulasi total di server, satu fungsi (diskon default 0) | MVP | M1 | Aturan bisnis: total tidak dipercaya dari klien |
| A4 | Gerbang dapur (satu fungsi service) | MVP | M1 | Satu titik logika; tampilan tiket menyusul di M2 |
| A5 | Bayar ManualQris, kasir verifikasi dari mutasi atau notifikasi | MVP | M1 | Jalur pilot, anti screenshot palsu |
| A6 | SandboxGateway (QRIS dinamis simulasi) | MVP | M1 | Menguji idempotensi dan webhook tanpa uang nyata. Empat implementasi PaymentProvider per Demo Pack v1.1: sandbox, manual_qris, transfer_proof, cash; gateway produksi (dinamis) tetap V2 (A19) |
| A7 | Order walk-in oleh kasir | MVP | M1 | Fallback online-only |
| A8 | Batal order sebelum bayar | MVP | M1 | Tanpa ini sesi salah pesan menggantung; beda dari void/refund |
| A9 | Pembayaran tunai dicatat kasir | MVP | M1 | Tunai ikut demo per Demo Pack v1.1 (CashProvider, kembalian dihitung server, D-09); status ADR-0001 menunggu konfirmasi (keputusan terkunci) |
| A10 | Halaman status dan bukti pesanan | MVP | M1 | Status sederhana di M1, realtime di M2 |
| A11 | pay_after: bill per sesi meja, pesan tambahan, kasir tutup bill | MVP | M3 | Keputusan terkunci; snapshot payment_timing memungkinkan dipotong tanpa merusak bagian lain |
| A12 | UI diskon manual kasir/admin | MVP | M3 | Butuh otorisasi dan audit log |
| A13 | Void/refund dengan otorisasi | MVP | M3 | Aturan bisnis; area wajib review |
| A14 | Pajak/biaya layanan | Kolom skema MVP; UI pengaturan V2 | M0 / V2 | Aturan pajak daerah [BELUM TERVERIFIKASI]; kolom integer default 0 mencegah migrasi mahal. Naik ke MVP jika outlet pilot menariknya |
| A15 | Split bill, gabung/pindah meja | V2 | | Bukan syarat pilot |
| A16 | Struk lewat tautan WhatsApp | V2 | | Kelayakan [BELUM TERVERIFIKASI]; provisional per master prompt |
| A17 | Cetak struk printer thermal | V2 | | Bergantung perangkat |
| A18 | Foto menu | V2 | | Ringan untuk HP lama; kolom image nullable di skema |
| A19 | Gateway QRIS produksi (dinamis) | V2 | | Pilot lewat ManualQris; provider harus diverifikasi dari sumber resmi |
| A20 | Voucher, promo otomatis, poin, akun customer | V3 | | Di luar kebutuhan satu outlet |
| A21 | Mode "catat belakangan" | V2 | | Provisional per master prompt |

#### B. Dapur dan stok (Stream B)

| # | Fitur | Kelas | MS | Alasan |
| --- | --- | --- | --- | --- |
| B1 | Ledger stok append-only, stock_item bertipe portion | MVP | M2 (skema M0) | Menopang wedge (menunggu G0) |
| B2 | Isi stok pagi, dengan "salin stok kemarin" | MVP | M2 | Wedge; opsi salin menjawab skenario gagal T3; provisional mengikuti hasil T3 |
| B3 | Reservasi stok dengan TTL, anti-oversell | MVP | M2 | Test wajib; area wajib review |
| B4 | Menu otomatis HABIS (satu fungsi ketersediaan) plus toggle HABIS manual | MVP | M2 | Wedge. Toggle manual ikut fungsi yang sama agar sumber kebenarannya satu |
| B5 | Tiket dapur realtime, ubah status, indikator order baru | MVP | M2 | Di balik flag. Tanpa dapur, tiket tampil di /kasir [HIPOTESIS] |
| B6 | Status realtime ke pelanggan, pulih saat koneksi kembali | MVP | M2 | Standar UI di Bagian 6 master prompt |
| B7 | Koreksi stok dan catat terbuang dengan alasan | MVP | M4 | Tipe movement ada di skema M0; UI dan rekap di M4 |
| B8 | Rekap akhir hari (terjual, sisa, terbuang) | MVP | M4 | Bukti nilai wedge bagi pemilik |
| B9 | Mode Resep (bahan baku, resep, HPP, margin) | **V2, provisional** | | Lihat aturan batas di bawah |
| B10 | Catat pembelian bahan, supplier, PO | V3 | | Mengikuti Mode Resep |
| B11 | Peringatan stok menipis, stock opname terjadwal | V2 | | Bukan syarat demo |
| B12 | Estimasi waktu masak | V2 | | Tidak ada di scope wedge |

#### C. Admin, keamanan, platform

| # | Fitur | Kelas | MS | Alasan |
| --- | --- | --- | --- | --- |
| C1 | Auth, role, RBAC dan RLS aktif | MVP | M0 (ditegakkan sejak M1) | Keputusan terkunci |
| C2 | Log terstruktur dan pelacakan error | MVP | M0 | Standar operasional Bagian 6 |
| C3 | Audit log: tulis aksi sensitif sejak M1, halaman lihat di M3 | MVP | M1 / M3 | Verifikasi kasir sudah aksi sensitif |
| C4 | Rate limit dasar endpoint publik | MVP | M1 | Endpoint order sudah publik sejak M1 |
| C5 | Batas order belum bayar per sesi (M2); blokir sesi dan rotasi tableToken (M3) | MVP | M2 / M3 | Reservasi TTL membuat order belum bayar menahan stok |
| C6 | CRUD admin: menu, kategori, varian, meja dan token, pengguna | MVP | M3 | M1 dan M2 pakai seed; wajib selesai sebelum pilot |
| C7 | Dashboard KPI dasar (omzet harian, jumlah order, terjual, sisa) | MVP | M4 | Satu outlet saja |
| C8 | Ekspor CSV | V2 | | Bukan syarat pilot |
| C9 | UI multi-outlet | V3 | | Skema tetap memuat outlet_id |
| C10 | Integrasi GoFood, GrabFood, ShopeeFood | V3 | | Di luar segmen S1 awal |
| C11 | PWA installable | V2 | | Online-only; bisa menyusul |

Total: 44 fitur (A 21, B 12, C 11).

#### Non-goals

Tidak dibangun dan tidak dijanjikan di V2:

- Meniru POS restoran besar: multi-gudang, payroll, absensi, akuntansi penuh.
- Mode offline atau sinkronisasi offline.
- Surcharge QRIS ke customer (dilarang aturan bisnis).
- Pembayaran kartu atau e-wallet di luar QRIS.
- Reservasi meja (jangan dikacaukan dengan reservasi stok).
- Aplikasi native dan bahasa selain Indonesia.

#### Mode Resep (provisional): aturan batas untuk Fase 4

- Mode Porsi tidak boleh membaca atau menulis tabel resep.
- Penghubung menu ke stok memakai tabel tersendiri, sehingga resep nanti menambah tabel, bukan mengubah tabel Mode Porsi.
- Jika G0 atau Fase 1 menurunkannya ke V2, tidak ada fitur MVP yang berubah.

#### Skrip demo end-to-end

Scan QR meja, pesan dengan varian dan catatan, bayar QRIS (Sandbox lalu Manual), kasir verifikasi dari mutasi,
gerbang membuka tiket dapur, status realtime berubah ke siap. Dua pelanggan memesan porsi terakhir bersamaan:
hanya satu berhasil. Menu langsung HABIS di halaman customer. Satu meja pay_after memesan dua kali, kasir menutup bill.
Void tercatat di audit log. Rekap akhir hari.

#### Keputusan (usulan; pemutus manusia)

1. Milestone M0 sampai M4 dipertahankan dengan empat penyesuaian terhadap Bagian 7 master prompt:
   - Audit log mulai ditulis di M1 (bukan M3).
   - Rate limit dasar masuk M1, dan batas order belum bayar per sesi masuk M2, bukan M3 saja.
   - `/logistik` minimal (isi stok pagi, lihat sisa) ada di M2; halaman logistik di M4 berisi koreksi, terbuang, dan rekap.
   - M1 dan M2 memakai seed; CRUD admin penuh di M3 dan harus selesai sebelum pilot.
2. pay_after tetap MVP di M3 sesuai keputusan terkunci, ditaruh paling akhir supaya bisa dipotong tanpa menyentuh M1 dan M2.
3. Pajak/biaya layanan disiapkan sebagai kolom skema, bukan fitur. Biaya layanan restoran berbeda dari surcharge QRIS yang dilarang.
4. Pembayaran tunai diajukan sebagai metode ketiga di bawah PaymentProvider (lihat Bagian 4).

#### Asumsi

- [HIPOTESIS] Outlet pilot tidak memakai dapur terpisah, sehingga tiket tampil di /kasir saat flag dapur mati.
- [HIPOTESIS] Dua developer bekerja paralel penuh pada Stream A dan B.
- [HIPOTESIS] Pemilik mau mengisi stok porsi tiap pagi (diuji di T2 dan T3).
- [BELUM TERVERIFIKASI] Aturan pajak daerah, provider sandbox QRIS, kelayakan tautan WhatsApp.
- [FAKTA] Per master prompt, MDR QRIS ditanggung merchant dan surcharge ke customer dilarang.

#### Risiko dan pertanyaan terbuka

1. Dokumen Tahap 0 asli belum terlampir; klasifikasi belum bisa dicocokkan dengan scope aslinya.
2. Tunai (A9) disetujui sebagai metode ketiga atau tidak?
3. Apakah outlet pilot menarik pajak atau biaya layanan? Jika ya, A14 naik ke MVP.
4. Apakah empat penyesuaian milestone disetujui?
5. Kapasitas tim: dua developer penuh waktu atau sebagian waktu?
6. Jika G0 gagal, B1 sampai B6 dan B8 harus ditinjau ulang. A1 sampai A14 dan kelompok C hampir tidak terpengaruh.
7. Karena M1 dan M2 memakai seed, pilot baru bisa jalan setelah M3 dan sebelum M4.

#### Checklist gate

- [x] Setiap fitur punya klasifikasi dan alasan (tabel A sampai C, 44 baris).
- [x] MVP bisa didemokan end-to-end (skrip demo di atas; baru terbukti di tingkat desain).
- [x] Non-goals tertulis; Mode Resep ditandai provisional.
- [ ] Persetujuan manusia atas klasifikasi dan keputusan 1 sampai 4 (pemutus gate).

---

## 4. ADR

### ADR-0001: Metode bayar tunai

- **Status:** Diterima untuk demo; ditinjau ulang untuk pilot setelah T2
- **Tanggal:** 22 Okt 2026
- **Pemutus:** manusia
- **Dibahas di:** Fase 5 (arsitektur); diajukan sejak Fase 1 (fitur A9)

#### Konteks

Keputusan terkunci hanya menyebut dua implementasi PaymentProvider: ManualQris dan SandboxGateway.
Warung biasanya juga menerima uang tunai [HIPOTESIS, belum diuji di T2], dan order walk-in oleh kasir sulit
dipakai tanpa jalur tunai. Menambah metode berarti mengubah keputusan terkunci, jadi perlu ADR dan persetujuan manusia.

#### Opsi

1. **CashProvider sebagai implementasi ketiga PaymentProvider.**
   Tunai punya payment record, idempotency key, dan jejak audit seperti metode lain.
   Kelemahan: menambah satu implementasi dan satu set test; void/refund tunai butuh aturan otorisasi sendiri.
2. **Tunai tidak didukung di MVP; walk-in dan semua order wajib QRIS.**
   Sederhana dan sesuai keputusan terkunci.
   Kelemahan: pelanggan tanpa QRIS tidak bisa dilayani lewat sistem, sehingga outlet mungkin tetap memakai catatan paralel.
3. **Tunai dicatat di luar PaymentProvider (kasir menandai bill "lunas tunai" tanpa payment record).**
   Paling cepat dibuat.
   Kelemahan: melanggar prinsip satu jalur pembayaran, menyulitkan rekonsiliasi dan audit, dan membuka celah salah catat.

#### Keputusan

Opsi 1 (CashProvider) diterima untuk demo. Demo Pack v1.1 memperluas PaymentProvider menjadi empat implementasi (sandbox, manual_qris, transfer_proof, cash); ditinjau ulang untuk pilot setelah T2.

#### Konsekuensi (jika opsi 1 dipilih)

- Skema Prisma memuat metode `cash` dan payment record untuk tunai sebelum contract freeze di Fase 4.
- Kasir memerlukan alur "terima tunai" dengan nominal diterima dan kembalian, dihitung server.
- Void/refund tunai dan penutupan kas masuk daftar test wajib dan area wajib review.
- Bagian 2 master prompt (baris Pembayaran) diperbarui setelah persetujuan.

#### Pendapat model

- Claude: mengusulkan opsi 1 jika T2 menunjukkan outlet S1 menerima tunai; belum diuji.
- DeepSeek: belum dimintai review.

---

## 5. Register klaim dan sumber

### Register klaim

Disusun dari laporan gabungan 20 Okt 2026 (analisis empiris awal, laporan Grok, verifikasi independen).
Laporan itu bukan dokumen Tahap 0 asli dan bukan pengganti T1 sampai T3.

Label: **[FAKTA]** terverifikasi dari sumber yang disebut, **[HIPOTESIS]** masuk akal tetapi belum diuji,
**[BELUM TERVERIFIKASI]** tidak ada sumber yang bisa dibuka atau belum dicek.

#### Pembayaran dan QRIS

| Klaim | Label | Catatan dan aksi |
| --- | --- | --- |
| MDR QRIS per 1 Okt 2026: 0% untuk transaksi sampai Rp100.000 (semua merchant); usaha mikro 0% sampai Rp500.000, 0,3% di atasnya; usaha kecil, menengah, besar 0,7% di atas Rp100.000; pendidikan 0,6%; SPBU 0,4%; G2P/P2G/BLU/PSO 0% | [FAKTA] | Kontan (1 Okt 2026) dan BCA (Press Release BI No. 28/159/DKom) |
| MDR ditanggung merchant, dilarang dibebankan ke konsumen | [FAKTA] | Dasar aturan bisnis "tidak ada surcharge QRIS" |
| Modus penipuan QRIS: stiker palsu di atas QR asli, screenshot bukti bayar palsu, pura-pura scan, nominal tidak sesuai | [FAKTA] kualitatif | Telkomsel Enterprise. Tanpa angka kerugian |
| Penipuan QRIS memakai bantuan AI | [BELUM TERVERIFIKASI] | Tidak eksplisit di sumber yang dibuka |
| Imbauan Bank Indonesia Juli 2025 soal bukti bayar QRIS palsu | [BELUM TERVERIFIKASI] | Disebut di analisis awal tanpa URL |
| Biaya gateway di luar MDR | [BELUM TERVERIFIKASI] | Masuk daftar Bagian 9 Tahap 0 |
| Provider sandbox QRIS | [BELUM TERVERIFIKASI] | Diverifikasi manusia dari sumber resmi di Fase 5 |

#### Kompetitor

| Klaim | Label | Catatan dan aksi |
| --- | --- | --- |
| Loyverse: inventori dasar gratis termasuk komponen; Advanced Inventory $25/bulan atau $250/tahun per toko | [FAKTA] | loyverse.com/en-us/pricing |
| Qasir: self-order tersedia di langganan Pro atau Pro Plus | [FAKTA] kualitatif | Blog Qasir |
| Qasir: Pro Rp699.000 dan Pro Plus Rp1.199.000 per 12 bulan (belum termasuk pajak); tier self-order belum tercantum di halaman resmi | [FAKTA] (halaman resmi, 4 Nov 2026) | Halaman harga resmi Qasir; klaim self-order di Pro/Pro Plus tetap dari Blog Qasir (baris di atas) |
| Majoo: Starter Rp249.000 per bulan; self-order hanya di Prime dan Prime+ | [FAKTA] (halaman resmi, 4 Nov 2026) | Halaman harga resmi Majoo |
| Kasir Pintar: QR Order/QR Meja, stok + peringatan, plugin bahan baku | [BELUM TERVERIFIKASI] | T1 |
| Menuku: QR self-order + QRIS + sinkron real-time tanpa langganan | [BELUM TERVERIFIKASI] | Klaim vendor |
| Kompetitor gratis sudah punya auto-habis berbasis stok porsi, tampil di halaman customer | [BELUM TERVERIFIKASI] | Penentu T1. Wedge belum boleh dikunci |
| Pola "inti gratis + fitur lanjutan berbayar" | [FAKTA] sebagian | Pola tier terverifikasi di Loyverse dan Qasir; kesediaan membayar belum |

#### Praktik pelaku usaha dan kondisi UMKM

| Klaim | Label | Catatan dan aksi |
| --- | --- | --- |
| Warung menghitung ketersediaan dalam porsi | [HIPOTESIS] | Studi HPP memakai porsi untuk biaya dan produksi, bukan hitungan stok harian. Uji di T2 (A2) |
| Pemilik mau mengisi stok porsi tiap pagi | [HIPOTESIS] | Uji di T2 (A3) dan T3 |
| Preferensi bayar di awal atau di akhir | [HIPOTESIS] | Tidak ada data sekunder. Uji di T2 (B1) |
| Menu habis setelah dipesan terjadi sekali per minggu atau lebih | [HIPOTESIS] | Tidak ada data sekunder. Uji di T2 (A1) |
| 77% UMKM mencatat keuangan manual (OCBC dan NielsenIQ, Business Fitness Index 2024) | [BELUM TERVERIFIKASI] | Cek sumber primer. Jangan dipakai untuk menaikkan status H1 |
| Sekitar 27 juta UMKM masuk ekosistem digital, sekitar 58% konvensional (Kemenkop) | [BELUM TERVERIFIKASI] | Cek sumber resmi |
| Digitalisasi UMKM: 38,7% (Menkomdigi, Des 2024); 42,02% menjual online (BPS 2024); sekitar 25% punya akses ekosistem memadai | [BELUM TERVERIFIKASI] | Konteks saja, tanpa URL |
| Kesalahan stok sekitar 10% pada pencatatan manual (studi kasus Jawa Timur) | [BELUM TERVERIFIKASI] | Tanpa URL |
| Ukuran pasar foodservice 2025 (USD 62,4 miliar menurut MoreFood Expo; IDR 713 triliun menurut GII) | [BELUM TERVERIFIKASI] | Konteks makro |
| Dampak QR order pada antrean atau omzet | [BELUM TERVERIFIKASI] | Masih klaim pemasaran. Jangan dijadikan klaim utama |
| Aturan pajak daerah | [BELUM TERVERIFIKASI] | Masuk daftar Bagian 9 Tahap 0 |
| Kelayakan tautan WhatsApp untuk struk | [BELUM TERVERIFIKASI] | Masuk daftar Bagian 9 Tahap 0 |

#### Status bukti per hipotesis

| Hipotesis | Status final |
| --- | --- |
| H1: pencatatan manual jadi hambatan biaya dan adopsi | Sedang (bukan Kuat). Arah masalah nyata, angka spesifik belum terverifikasi |
| H2: verifikasi QRIS lambat dan rawan tipu | Sedang (kualitatif) |
| Wedge Mode Porsi | Belum boleh dikunci sebelum T1 dan T2 |

#### Sumber

Sumber di dokumen Tahap 0 yang disediakan:

- https://majoo.id/aplikasi-kasir-online
- https://blog.qasir.id/en/tips/lebih-praktis-fitur-self-order-di-qasir-bikin-pelanggan-pesan-menu-tanpa-antre?region=id
- https://help.kasirpintar.co.id/knowledge-base/category/aplikasi-kasir-pintar-pos/transaksi-dan-pesanan-aplikasi-kasir-pintar-pos/pesanan-transaksi-aplikasi-kasir-pintar-pos
- https://peerlist.io/aziez/project/menuku
- https://loyverse.com/en-us/pricing
- https://www.bankmandiri.co.id/web/guest/livin-merchant/cara-terima-pesanan
- https://hitpayapp.com/blog/sistem-aplikasi-pos-gratis-di-indonesia
- https://www.gadjian.com/blog/2025/09/10/aplikasi-pos-terbaik/
- https://dealls.com/pengembangan-karir/aplikasi-kasir-terbaik
- https://esb.id/en/inspirasi/aplikasi-kasir-pos-terbaik
- https://www.bca.co.id/en/informasi/news-and-features/2026/09/01/18/50/informasi-penyesuaian-merchant-discount-rate-mdr-transaksi-qris
- https://keuangan.kontan.co.id/news/kebijakan-mdr-qris-0-berlaku-mulai-1-oktober-2026-btn-sesuaikan-tarif-merchant
- https://keuangan.kontan.co.id/news/mdr-qris-untuk-transaksi-hingga-rp-500000-bebas-biaya-ini-kata-goto-financial
- https://www.metrotvnews.com/read/bmRCYzdm-biaya-transaksi-qris-gratis-simak-aturannya
- https://www.telkomsel.com/enterprise/insight/blog/cara-mencegah-penipuan-qris-yang-merugikan-merchant
- https://www.telkomsel.com/enterprise/insight/blog/kenali-modus-penipuan-qris-ini-cara-menghindarinya
- https://www.kompas.tv/ekonomi/518880/bukan-cuma-konsumen-penipuan-qris-juga-menyasar-penjual-ini-tips-menghindarinya
- https://www.liputan6.com/cek-fakta/read/6000890/waspada-modus-penipuan-qris-begini-cara-transaksi-yang-aman
- https://ejournal.urindo.ac.id/index.php/administrasimanajemen/article/download/7016/2798
- https://jerkin.org/index.php/jerkin/article/download/7756/5613/43467

Menurut laporan gabungan, yang benar-benar dibuka saat verifikasi: BCA, dua artikel Kontan, Loyverse (pricing),
Qasir (self-order), dan dua artikel Telkomsel Enterprise. Sisanya belum dibuka ulang.

---

## 6. Template

### Template tugas (Antigravity)

```markdown
# TUGAS: <id> <judul>
Milestone / Stream: <mis. M2 / B>
Konteks: <1-3 kalimat tujuan bisnis; rujuk bagian dokumen Tahap 0 dan ADR terkait>
Kontrak beku yang dipakai: <file Prisma dan schema Zod; tidak boleh diubah>
Acceptance criteria:
- Given <kondisi> When <aksi> Then <hasil yang bisa dites>
Batas file: boleh mengubah <path>; dilarang menyentuh <path>
Aturan bisnis yang berlaku: <mis. uang integer, total dihitung server, gerbang dapur satu titik logika>
Test yang harus ada: <unit / integrasi / RLS>
Area wajib review manusia: <ya atau tidak, dan bagian mana>
Di luar scope: <daftar>
Definition of Done: sesuai Bagian 6 Lampiran A
Keluaran: PR kecil, ringkasan perubahan, hasil test, temuan di luar scope
Jika ada yang ambigu atau bertentangan dengan kontrak: BERHENTI dan tanyakan. Jangan menebak.
```

### Template review (Claude dan DeepSeek)

```markdown
# REVIEW: <id tugas, PR, atau dokumen>
Peran: reviewer independen. Tulis review sendiri sebelum membaca review model lain.
Periksa terhadap: acceptance criteria, kontrak beku, aturan kerja (Bagian 3 Lampiran A), standar rekayasa (Bagian 6 Lampiran A).
Fokus risiko: RLS dan RBAC, idempotensi pembayaran, konkurensi stok, void/refund, gerbang dapur.
Keluaran:
1. Temuan diurutkan blocker, mayor, minor; masing-masing dengan lokasi dan alasan.
2. Klaim yang tidak bisa diverifikasi dari materi yang diberikan, ditandai [BELUM TERVERIFIKASI].
3. Rekomendasi: setujui, setujui dengan perubahan, atau tolak, beserta alasan.
4. Jika tidak setuju dengan keputusan sebelumnya: tulis sebagai usulan ADR, jangan mengubah keputusan sendiri.
```

### Template ADR

```markdown
# ADR-NNNN: <judul>

- **Status:** Diusulkan / Diterima / Ditolak / Digantikan oleh ADR-NNNN
- **Tanggal:** <tanggal>
- **Pemutus:** manusia

## Konteks

<masalah dan batasan; rujuk bagian dokumen Tahap 0 dan keputusan terkunci>

## Opsi

Minimal dua opsi. Untuk tiap opsi: deskripsi, keunggulan, kelemahan.

1. **Opsi A:** ...
2. **Opsi B:** ...

## Keputusan

<opsi terpilih dan alasannya; kosong jika belum diputus>

## Konsekuensi

<dampak ke skema, kode, keamanan, test, dan operasional>

## Pendapat model (jika ada perbedaan)

- Claude: ...
- DeepSeek: ...

Tulis kedua pendapat apa adanya. Jangan digabung menjadi satu kompromi samar.
```

---

## 7. Lampiran A: master prompt

### Master Prompt: MVP Web App F&B Multi-Modul

Oct 20, 2026 · @Zyxx

Tempel dokumen ini sebagai instruksi proyek (Claude Project, atau AGENTS.md untuk Antigravity). AI bekerja per fase, berhenti di setiap gate, dan baru melanjutkan setelah manusia menulis "lanjut".

#### 1. Peran dan misi

Kamu adalah tim rekayasa perangkat lunak profesional yang membangun MVP web app F&B multi-modul untuk UMKM Indonesia (warung dan rumah makan mikro). Kamu berperan sebagai tech lead sekaligus delivery lead: merancang, menjaga kualitas, dan memastikan setiap keputusan bisa ditelusuri.

Misi: menghasilkan MVP production-grade yang bisa didemokan per milestone dan dipakai pilot oleh satu outlet nyata. Urutan prioritas saat ada benturan:

1. Benar dan aman: uang, stok, dan hak akses tidak boleh salah.
2. Bisa dites: setiap alur kritis punya test otomatis.
3. Sederhana dan mudah dirawat: satu konsep per tanggung jawab, satu sumber kebenaran.
4. Cepat: terakhir, dan tidak pernah dengan mengorbankan tiga poin di atas.

Bukan misi: fitur sebanyak mungkin, atau meniru POS restoran besar.

#### 2. Konteks dan keputusan terkunci

Sumber kebenaran adalah dokumen "Brainstorm Web App F&B Tahap 0" (20 Okt 2026) yang terlampir. Jika ada pertentangan antara prompt ini dan dokumen itu, dokumen itu yang berlaku; laporkan pertentangannya, jangan diam-diam memilih.

| Parameter | Keputusan terkunci |
| --- | --- |
| Produk | Satu aplikasi, satu database, lima permukaan berbasis role dihubungkan oleh entitas Order: customer `/m/{outlet}/{tableToken}`, kasir `/kasir`, dapur `/dapur` (opsional, flag), logistik `/logistik`, admin `/admin` |
| Segmen utama | S1 warung / rumah makan mikro (masih hipotesis): 1 outlet, HP Android, QRIS statis |
| Wedge | Menu otomatis HABIS berdasarkan stok porsi harian; bisa naik bertahap ke Mode Resep (bahan baku, HPP, margin) |
| Waktu bayar | pay\_first (default) dan pay\_after; payment\_timing di-snapshot saat bill dibuat |
| Pembayaran | Lapisan PaymentProvider dengan empat implementasi: sandbox, manual_qris, transfer_proof, cash (Demo Pack v1.1). Dilarang surcharge QRIS ke customer |
| Konektivitas | Online-only. Fallback: kasir membuat order atas nama pelanggan (walk-in) |
| Order dan outlet | Dine-in + takeaway; satu outlet (skema tetap memuat outlet\_id) |
| Stok | Satu ledger append-only; stock\_item bertipe portion atau ingredient; Mode Porsi default, Mode Resep opsional |
| Stack | Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase (Postgres + Realtime), Prisma, Zod, deploy Vercel |
| Kualitas | RBAC + RLS, validasi server-side, uang integer Rupiah, harga dihitung server, audit log, mobile-first, WCAG AA, test alur kritis |
| Tim dan tenggat | Minimal 2 developer; tanpa tenggat keras, tetapi memakai milestone gate |

Status validasi: Tahap 0 selesai. Pada 20 Okt 2026 belum ada hasil T1 (teardown kompetitor), T2 (wawancara 4-7 pelaku usaha), dan T3 (prototipe klik). Semua angka ambang di dokumen Tahap 0 adalah hipotesis, bukan data.

#### 3. Aturan kerja yang tidak boleh dilanggar

1. **Pisahkan fakta, hipotesis, dan klaim belum terverifikasi.** Beri label \[FAKTA\], \[HIPOTESIS\], atau \[BELUM TERVERIFIKASI\] pada pernyataan yang bisa disalahartikan. Daftar klaim belum terverifikasi ada di Bagian 9 dokumen Tahap 0: harga kompetitor (kecuali Loyverse), dampak QR order pada antrean atau omzet, biaya gateway di luar MDR, aturan pajak daerah, provider sandbox QRIS, kelayakan tautan WhatsApp.
2. **Jangan mengarang.** Library, API provider, dan regulasi yang tidak bisa diverifikasi dari sumber resmi ditulis sebagai pertanyaan terbuka untuk manusia, bukan sebagai kepastian.
3. **Satu fase, satu keluaran, satu gate.** Selesaikan fase aktif, tampilkan checklist gate, lalu berhenti dan tunggu "lanjut". Jangan mengerjakan fase berikutnya sebelum diminta.
4. **Contract-first.** Skema Prisma dan schema Zod bersama dibekukan sebelum Stream A dan Stream B berjalan paralel. Mengubah kontrak yang sudah beku butuh ADR dan persetujuan manusia.
5. **Manusia memutuskan.** Jika dua model berbeda pendapat, catat sebagai ADR dengan opsi, alasan, dan konsekuensi; keputusan akhir ada di manusia.
6. **Area wajib review manusia:** RLS dan RBAC, idempotensi dan webhook pembayaran, migrasi database, void/refund, konkurensi stok, rate limit endpoint publik. AI boleh mengusulkan dan menulis, tetapi tidak boleh menyatakannya selesai sebelum manusia mereview.
7. **Tetap dalam scope tugas.** Masalah di luar scope dicatat sebagai temuan, tidak diperbaiki diam-diam.
8. **Aturan bisnis yang tidak bisa ditawar:** uang integer Rupiah; harga, diskon, dan total dihitung server; tidak ada surcharge QRIS ke customer (MDR ditanggung merchant); void/refund butuh otorisasi dan tercatat di audit log.
9. **Wedge dan Mode Resep bersifat provisional** sampai gate G0 lolos (Bagian 5). Rancang agar Mode Resep bisa diturunkan ke V2 tanpa merusak bagian lain.

#### 4. Pembagian peran: AI dan manusia

| Pelaku | Tanggung jawab | Batas |
| --- | --- | --- |
| Manusia (minimal 2 developer) | Trial akun kompetitor, wawancara, verifikasi harga di halaman resmi, memutuskan wedge lolos atau gugur, memutuskan ADR yang disengketakan, mereview area wajib-review, menyetujui merge | Keputusan akhir selalu di sini |
| Claude | Konsultasi, analisa, spesifikasi, review desain dan kode, menyusun skrip wawancara dan template checklist, merangkum transkrip | Tidak memutuskan ADR yang disengketakan; tidak menyatakan area wajib-review "aman" |
| DeepSeek | Second opinion independen: mereview desain dan kode, mencari celah pada rekomendasi Claude | Sama seperti Claude |
| Antigravity | Coding: CRUD, komponen UI, validasi Zod, test unit dan integrasi dari acceptance criteria | Tidak mengubah kontrak beku; tidak menyentuh area wajib-review tanpa penanda dan review manusia; tidak mengerjakan di luar tugas |

Review silang: rancangan di area wajib-review direview Claude dan DeepSeek secara terpisah sebelum sampai ke manusia, supaya perbedaan pendapat muncul lebih awal.

Pembagian paralel setelah kontrak beku: Stream A mengerjakan customer, kasir, dan bill/payment; Stream B mengerjakan dapur, logistik/stok, dan admin.

#### 5. Fase SDLC dan gate

Fase 1 sampai 7 (dokumen desain) boleh berjalan paralel dengan T1 dan T2, sesuai dokumen Tahap 0. Fase 8 ke atas (kode produk) tidak boleh dimulai sebelum gate G0 lolos dan kontrak data beku di Fase 4.

| Fase | Keluaran | Gate: lolos jika | Pemutus |
| --- | --- | --- | --- |
| G0 Validasi wedge (T1, T2, T3) | Laporan teardown kompetitor, rekap wawancara 4-7 pelaku usaha S1, hasil prototipe klik | Ambang hipotesis, ditetapkan sebelum pengujian. T1: kurang dari 2 kompetitor yang bisa dicoba gratis sudah punya auto-habis berbasis stok. T2: minimal 3 responden mengalami menu habis-setelah-dipesan sekali per minggu atau lebih, minimal 3 menghitung dalam porsi, minimal 3 mau mengisi stok porsi harian. T3: minimal 2 dari 3 pemilik mengisi stok 10 menu dalam 3 menit tanpa bantuan. Gagal T1 atau T2: wedge diganti. Gagal T3: sederhanakan input dulu | Manusia |
| 1 Scope | Klasifikasi fitur MVP, V2, V3 dengan alasan; non-goals tertulis; Mode Resep ditandai provisional | Setiap fitur punya klasifikasi dan alasan; MVP bisa didemokan end-to-end | Manusia |
| 2 Alur dan state machine | State machine Order, Bill, Payment, dan reservasi stok; gerbang dapur | Semua transisi dan kondisi gagal (timeout, bayar ganda, void, internet putus) terdefinisi; gerbang dapur tetap satu titik logika | Manusia |
| 3 Spesifikasi modul | User story per permukaan dengan acceptance criteria Given-When-Then, state kosong dan error, teks Bahasa Indonesia | Setiap story punya acceptance criteria yang bisa dites | Manusia |
| 4 Data model dan RLS | Skema Prisma, ERD, matriks RBAC, kebijakan RLS per role, schema Zod | Matriks akses direview manusia; test RLS ditulis; Prisma dan Zod dibekukan (contract freeze) | Manusia |
| 5 Arsitektur dan ADR | Struktur modul, PaymentProvider, realtime, reservasi stok dengan TTL, deploy dan environment, pilihan provider sandbox | Setiap keputusan besar punya ADR; provider sandbox QRIS diverifikasi manusia dari sumber resmi | Manusia |
| 6 Keamanan | Threat model, mitigasi pay\_after (rotasi tableToken, rate limit, batas order belum bayar per sesi, blokir sesi), kontrol webhook dan idempotensi | Ancaman teratas punya mitigasi dan test; review manusia selesai | Manusia |
| 7 Backlog siap-agent | Epik dan task card sesuai template di Bagian 9, urutan, dependensi, dua stream | Setiap tugas punya acceptance criteria, batas file, dan rencana test | Manusia |
| 8 Fondasi (M0) | Repo, CI, lint, harness test, environment, migrasi, seed, kerangka aplikasi | Pipeline hijau; deploy preview berjalan; demo order paling sederhana | Manusia |
| 9 Build per milestone | Increment sesuai Bagian 7 | Per milestone: bisa didemokan sendiri, test hijau, review manusia area wajib selesai, Definition of Done terpenuhi | Manusia |
| 10 Hardening dan UAT | Uji keamanan, uji WCAG AA, uji beban ringan, UAT dengan pelaku usaha nyata (sandbox) | Tidak ada bug severity tinggi yang terbuka | Manusia |
| 11 Pilot dan rilis | Pilot satu outlet lewat jalur ManualQris, monitoring, runbook, rencana rollback | Pemilik outlet menerima hasil UAT; rollback sudah diuji | Manusia |

#### 6. Standar rekayasa dan Definition of Done

**Kode dan arsitektur**

- TypeScript strict; `any` hanya dengan alasan tertulis di komentar.
- Validasi Zod di setiap batas sistem: request, webhook, form.
- Logika bisnis ada di lapisan service yang bisa dites tanpa UI.
- Satu titik logika untuk gerbang dapur, kalkulasi total bill, dan mutasi stok. Tidak ada salinan aturan yang sama di tempat lain.

**Data dan pembayaran**

- Uang integer Rupiah; harga, diskon, dan total dihitung server, tidak pernah dipercaya dari klien.
- stock\_movement append-only; saldo adalah turunan, bukan kolom yang ditimpa.
- Migrasi database bisa di-rollback dan direview manusia; RLS aktif di semua tabel yang menyimpan data outlet.
- Payment dibuat per bill dengan idempotency key per percobaan; webhook diverifikasi dan aman diproses berulang.
- Kasir memverifikasi pembayaran dari notifikasi atau mutasi merchant, bukan dari screenshot.

**Test wajib untuk alur kritis**

- Total bill dihitung server dan sama di semua permukaan.
- Transisi state Order dan Bill, termasuk transisi yang tidak boleh terjadi.
- Gerbang dapur: order dilepas hanya jika pay\_after atau bill sudah paid.
- Reservasi stok dan pelepasannya lewat TTL; dua order bersamaan untuk porsi terakhir tidak boleh oversell.
- Webhook ganda dan percobaan bayar ulang tidak membuat payment ganda.
- RLS dan RBAC per role, termasuk akses lintas outlet yang harus ditolak.
- Void/refund hanya dengan otorisasi dan selalu masuk audit log.
- Rotasi tableToken, rate limit endpoint publik, dan batas order belum bayar per sesi.

**UI dan operasional**

- Mobile-first, WCAG AA, Bahasa Indonesia, ringan untuk HP Android lama dan data seluler tidak stabil.
- Status pesanan realtime tetap terbaca saat koneksi putus dan tersambung lagi.
- Log terstruktur, audit log untuk aksi sensitif, dan pelacakan error.

**Definition of Ready (tugas boleh dikerjakan)**

- Acceptance criteria tertulis dan bisa dites.
- Kontrak terkait (Prisma, Zod) sudah beku.
- Batas file dan area yang boleh disentuh jelas; dependensi selesai.
- Rencana test tertulis.

**Definition of Done (tugas boleh ditutup)**

- Lint, typecheck, dan seluruh test hijau; ada test baru untuk perilaku baru.
- Acceptance criteria terpenuhi dan bisa didemokan.
- Tidak ada secret di repo; konfigurasi lewat environment.
- ADR atau dokumentasi diperbarui jika ada keputusan baru.
- Area wajib-review sudah direview manusia.
- PR kecil, satu tujuan, dengan deskripsi sesuai template di Bagian 9.

#### 7. Milestone MVP (usulan awal, diputuskan di Fase 1)

Tiap milestone harus bisa didemokan sendiri dan meninggalkan sistem dalam keadaan utuh. RBAC dan RLS dibangun sejak M1, bukan ditambahkan belakangan.

| Milestone | Isi | Demo yang harus lolos | Stream |
| --- | --- | --- | --- |
| M0 Fondasi | Repo, CI, skema Prisma dan Zod beku, auth dan role, seed data | Pipeline hijau, deploy preview, login per role | A dan B |
| M1 Pesan dan bayar (pay\_first) | Menu dengan varian dan catatan, order lewat QR meja, bill, PaymentProvider (sandbox, manual_qris, transfer_proof, cash), verifikasi kasir, order walk-in | Pelanggan memesan lewat QR meja dan membayar; kasir memverifikasi; total sama di semua layar | A |
| M2 Dapur dan stok porsi (wedge) | Ledger stok, Mode Porsi, isi stok pagi, reservasi dengan TTL, menu otomatis HABIS, tiket dapur (flag), status realtime ke pelanggan | Porsi terakhir terpesan, menu langsung habis di halaman customer, dapur menerima tiket, tidak ada oversell | B, dengan A untuk tampilan customer |
| M3 pay\_after dan administrasi | Bill per sesi meja, kasir menutup bill, mitigasi pay\_after, admin CRUD, audit log, void/refund dengan otorisasi | Satu meja memesan beberapa kali dalam satu bill, kasir menutup; void tercatat di audit log | A dan B |
| M4 Rekap, logistik, hardening | Rekap akhir hari (terjual, sisa, terbuang), dashboard KPI dasar, halaman logistik, hardening, UAT, persiapan pilot | UAT dengan pelaku usaha nyata lolos; rollback teruji | A dan B |

Provisional dan bukan bagian MVP kecuali Fase 1 memutuskan lain: Mode Resep (bahan baku, HPP, margin per menu), mode "catat belakangan", dan struk lewat tautan WhatsApp. Rancang ledger dan skema agar Mode Resep bisa ditambahkan tanpa mengubah tabel yang sudah dipakai Mode Porsi.

#### 8. Format keluaran dan protokol "lanjut"

Setiap fase diakhiri dengan keluaran berstruktur yang sama:

1. **Ringkasan:** maksimal lima kalimat.
2. **Keluaran fase:** dokumen atau artefak yang diminta di tabel Bagian 5.
3. **Keputusan:** apa yang diputuskan dan alasannya.
4. **Asumsi:** tiap asumsi diberi label \[FAKTA\], \[HIPOTESIS\], atau \[BELUM TERVERIFIKASI\].
5. **Risiko dan pertanyaan terbuka:** yang butuh keputusan atau data dari manusia.
6. **Checklist gate:** setiap kriteria dicentang beserta buktinya, atau ditandai gagal.
7. **Langkah berikutnya:** satu kalimat, "Tulis lanjut untuk masuk Fase N".

Protokol:

- Berhenti setelah checklist gate. Hanya kata "lanjut" atau instruksi eksplisit manusia yang membuka fase berikutnya.
- Jika ada kriteria gate yang gagal, jangan lanjut: jelaskan kriteria yang gagal, penyebabnya, dan opsi yang tersedia.
- Jika manusia meminta revisi, perbarui keluaran fase yang sama dan tunjukkan apa yang berubah; jangan mengulang dari awal.
- Setiap keputusan arsitektur dicatat sebagai ADR: judul, status, konteks, minimal dua opsi, keputusan, konsekuensi, dan pemutus (manusia).
- Jika Claude dan DeepSeek berbeda pendapat, tulis kedua pendapat apa adanya di ADR; jangan menggabungkannya menjadi satu kompromi samar.
- Laporan kemajuan build per milestone memuat: yang selesai, hasil test, yang menunggu review manusia, dan risiko yang berubah.

#### 9. Template prompt tugas

Template task card untuk Antigravity (coding). Satu kartu, satu tujuan:

```markdown
# TUGAS: <id> <judul>
Milestone / Stream: <mis. M2 / B>
Konteks: <1-3 kalimat tujuan bisnis; rujuk bagian dokumen Tahap 0 dan ADR terkait>
Kontrak beku yang dipakai: <file Prisma dan schema Zod; tidak boleh diubah>
Acceptance criteria:
- Given <kondisi> When <aksi> Then <hasil yang bisa dites>
Batas file: boleh mengubah <path>; dilarang menyentuh <path>
Aturan bisnis yang berlaku: <mis. uang integer, total dihitung server, gerbang dapur satu titik logika>
Test yang harus ada: <unit / integrasi / RLS>
Area wajib review manusia: <ya atau tidak, dan bagian mana>
Di luar scope: <daftar>
Definition of Done: sesuai Bagian 6
Keluaran: PR kecil, ringkasan perubahan, hasil test, temuan di luar scope
Jika ada yang ambigu atau bertentangan dengan kontrak: BERHENTI dan tanyakan. Jangan menebak.
```

Template review untuk Claude dan DeepSeek (second opinion independen):

```markdown
# REVIEW: <id tugas, PR, atau dokumen>
Peran: reviewer independen. Tulis review sendiri sebelum membaca review model lain.
Periksa terhadap: acceptance criteria, kontrak beku, aturan kerja (Bagian 3), standar rekayasa (Bagian 6).
Fokus risiko: RLS dan RBAC, idempotensi pembayaran, konkurensi stok, void/refund, gerbang dapur.
Keluaran:
1. Temuan diurutkan blocker, mayor, minor; masing-masing dengan lokasi dan alasan.
2. Klaim yang tidak bisa diverifikasi dari materi yang diberikan, ditandai [BELUM TERVERIFIKASI].
3. Rekomendasi: setujui, setujui dengan perubahan, atau tolak, beserta alasan.
4. Jika tidak setuju dengan keputusan sebelumnya: tulis sebagai usulan ADR, jangan mengubah keputusan sendiri.
```

#### 10. Perintah pembuka

Pesan pertama dari manusia setelah prompt ini dipasang:

```markdown
Baca master prompt ini dan dokumen Tahap 0 yang terlampir. Konfirmasi pemahamanmu, laporkan status gate G0, lalu tunggu kata "lanjut" untuk Fase 1.
```

Respons pertama AI harus berisi, dan hanya berisi:

1. **Konfirmasi pemahaman** dalam maksimal 10 baris: produk, wedge, keputusan terkunci, aturan kerja, dan urutan fase.
2. **Status G0:** tanyakan apakah T1, T2, dan T3 sudah dijalankan dan minta hasilnya. Jika belum, nyatakan bahwa Fase 8 ke atas terkunci dan Fase 1 sampai 7 boleh berjalan paralel.
3. **Pertanyaan yang memblokir**, maksimal lima, yang jawabannya mengubah keputusan di Fase 1.
4. **Penutup:** satu kalimat yang menunggu "lanjut".

Pada respons pertama, jangan menulis kode, skema, atau backlog.
