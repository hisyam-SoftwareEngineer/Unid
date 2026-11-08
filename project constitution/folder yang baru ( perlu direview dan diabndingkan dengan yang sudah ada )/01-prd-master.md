# 01 PRD Induk: Web App F&B (Jalur Demo)

Status: DONE-MENUNGGU-REVIEW · Disusun: 6 Nov 2026 · Direvisi: 7 Nov 2026 (keputusan Q-001..Q-025; Q-016 opsi B) · Prompt: P1 · Prasyarat: P0 (disetujui pengguna, 6 Nov 2026)
Label: [FAKTA] ada di sumber (berkas disebut) · [HIPOTESIS] belum diuji · [ASUMSI] dibutuhkan agar bisa lanjut, perlu konfirmasi · 🔍 area wajib review manusia.
Istilah baku mengikuti `00-context.md` bagian 4.

---

## 1. Ringkasan eksekutif

- **Apa:** web app untuk rumah makan dan warung mikro. Customer memesan lewat QR meja tanpa akun. Kasir atau pemilik memverifikasi pembayaran dan mengelola antrean. Logistik mengisi stok porsi harian.
- **Untuk siapa:** outlet sasaran demo adalah rumah makan, satu outlet, 2-6 orang, HP Android, QRIS statis, tanpa printer atau layar dapur [brainstorm Tahap 0 bagian 3.2: segmen S1 sebagai hipotesis; profil rumah makan dinyatakan pemilik proyek, 6 Nov 2026, detail ukuran masih [ASUMSI]].
- **Kenapa sekarang:** pemilik proyek memerlukan web asli yang berfungsi untuk dipakai sebagai prototipe tes T3 dan bahan wawancara T2 [Demo Pack v1, ADR-0002]. Demo bukan fondasi produk dan bukan pilot.
- **Wedge:** stok porsi harian membuat menu otomatis HABIS, ditambah anti-oversell. Status: **disetujui manusia sebagai arah kerja provisional (7 Nov 2026), belum divalidasi** (Low confidence; G0 belum lolos). Dokumen ini tidak menyebutnya terbukti.
- **Hasil yang diharapkan dari demo:** bukti perilaku nyata (waktu isi stok, nol oversell pada uji paralel, waktu verifikasi pembayaran) untuk mengisi keputusan G0, bukan klaim pasar.

---

## 2. Masalah dan peluang

Hanya yang bersumber dari dokumen riset. Angka tidak digabung antar sumber.

| # | Pernyataan | Label | Sumber | Catatan |
|---|---|---|---|---|
| M-1 | Pencatatan transaksi, stok, dan HPP di UMKM kuliner masih banyak manual (survei 25 UMKM pedesaan: 72% manual; kelompok mitra Pangkalpinang: sekitar 65% tidak rutin mencatat stok bahan baku) | [FAKTA] arah; kekuatan bukti LEMAH | brainstorm-fnb-tahap0-bersih.txt 3.1 H1 | Sampel kecil, bukan representatif nasional. Angka 77% (OCBC/NielsenIQ 2024) hanya berlaku bagi yang sudah mencatat dan sumber primernya belum dibuka (MVP.md) |
| M-2 | Verifikasi pembayaran QRIS di kasir rawan penipuan (screenshot lama atau diedit, stiker QRIS palsu) | [FAKTA] kualitatif; kekuatan SEDANG | brainstorm 3.1 H2 | Tanpa angka kerugian; sumber dari penyedia solusi dan media |
| M-3 | Order lewat QR meja mengurangi antrean dan salah catat | [HIPOTESIS] tidak terverifikasi | brainstorm 3.1 H3 | Hanya klaim vendor dan karya mahasiswa. Tidak dipakai sebagai dasar tujuan |
| M-4 | Kompetitor sudah menyediakan lima permukaan terhubung; sebagian gratis. Bukan pembeda | [FAKTA] | brainstorm 3.3 | Harga kompetitor (kecuali Loyverse) belum diverifikasi |
| M-5 | Rumah makan umumnya bayar setelah makan | [HIPOTESIS] | brainstorm 3.4a; R1 Gelombang 2 | Data publik hanya Banda Aceh dan Yogyakarta, tidak ada Malang |
| M-6 | Warung menghitung ketersediaan dalam porsi per hari | [HIPOTESIS] | brainstorm bagian 4 | Diuji di T2 |
| M-7 | Pemilik mau mengisi stok porsi tiap pagi | [HIPOTESIS] | brainstorm bagian 5 | Diuji di T3 |
| M-9 | PBJT makanan dan minuman Kota Malang: tarif 10% untuk usaha beromzet ≥ Rp15 juta per bulan; berlaku sejak 18 Jun 2025 (Perda 1/2025). Angka Rp5 juta adalah ambang lama dan Rp10 juta hanya usulan pembahasan; tidak dirata-rata | [FAKTA] sumber sekunder kuat (database BPK, DDTC News, Pemkot Malang via Metro TV, Jatim TIMES); bunyi pasal belum dicek ke JDIH | R1 Gelombang 2; verifikasi 7 Nov 2026 | Demo memakai pajak 0 (BR-007); relevan untuk outlet pilot (fitur pajak) |
| M-8 | Biaya QRIS (MDR) tidak boleh dibebankan ke customer; 0% sampai Rp100 ribu per transaksi, usaha mikro 0% sampai Rp500 ribu | [FAKTA] | brainstorm 3.4c (BCA, Kontan) | Karena itu tidak ada surcharge |

**Peluang (hipotesis):** hambatan biaya langganan nyata (M-1) dan stok porsi hanya satu angka per menu per hari, jauh lebih ringan daripada resep bahan baku. Apakah ini cukup membedakan dari kompetitor belum diketahui (T1).

**Kekosongan data:** data Malang untuk pola bayar, frekuensi menu habis, perangkat, dan sinyal belum ada; R1 Gelombang 3 sudah tersedia (data harga dan tier kompetitor per 4 Nov 2026), tetapi data Malang untuk topik ini tetap kosong (Q-008). Semua kekosongan dipakai sebagai bahan T2, bukan diisi dengan tebakan.

---

## 3. Tujuan demo dan bukan tujuan

### Tujuan (maks 5)

| # | Tujuan |
|---|---|
| G-1 | Menunjukkan alur lengkap customer: buka QR meja, pilih menu, pesan, bayar dengan salah satu dari empat metode, dan pantau status |
| G-2 | Menunjukkan bahwa kasir atau pemilik dapat memverifikasi, menolak, atau menerima tunai, lalu mengelola antrean dengan aturan yang ditegakkan server |
| G-3 | Menunjukkan wedge: porsi habis membuat menu otomatis HABIS, dan dua customer yang berebut porsi terakhir menghasilkan tepat satu pesanan berhasil |
| G-4 | Menjadi prototipe nyata untuk tes T3 (pemilik mengisi stok porsi) dan bahan konkret untuk wawancara T2 |
| G-5 | Membuktikan jaminan database J-01..J-12 lewat tes pada Postgres nyata (bukan menyatakannya "aman") |

### Bukan tujuan (non-goals)

- Bukan produk, bukan pilot, dan bukan fondasi kode produk (ADR-0002). Kode dirapikan atau dibuang sebelum Fase 8.
- Tidak memvalidasi wedge, kesediaan membayar, dampak QR order pada antrean atau omzet.
- Tidak melayani uang nyata. QRIS dinamis asli, void/refund, pajak, biaya layanan di luar cakupan.
- Tidak mengelola bahan baku, resep, HPP, atau margin (Mode Resep).
- Tidak mendukung pay_after, dapur, offline, multi-outlet UI, CRUD admin, struk WhatsApp.
- Tidak menjadi pembeda pasar terhadap kompetitor secara keseluruhan.

---

## 4. Metrik keberhasilan demo

Semua target adalah [HIPOTESIS] yang ditetapkan sebelum diukur. Tidak ada target yang berasal dari data pasar. Metrik diukur di lingkungan demo, bukan di outlet nyata kecuali dinyatakan.

| # | Metrik | Definisi | Cara ukur | Target [HIPOTESIS] | Sumber data |
|---|---|---|---|---|---|
| MT-1 | Jumlah oversell pada uji paralel | Porsi terjual (movement `consume`) dikurangi stok pagi (`opening`) pada hari bisnis uji; positif berarti oversell | Uji konkurensi: N permintaan `createOrder` paralel untuk stok K porsi, ulangi 20 kali; hitung `available_portions` dan jumlah pesanan berhasil | 0 pada semua 20 pengulangan; pesanan berhasil ≤ K | Ledger `stock_movements`, hasil tes T-04 dan tes konkurensi D-14 🔍 |
| MT-2 | Waktu isi stok pagi (T3) | Detik dari membuka layar isi stok sampai tombol simpan berhasil untuk 10 menu | Prototipe diuji dengan 3 pemilik, stopwatch, tanpa bantuan | ≤ 180 detik untuk ≥ 2 dari 3 pemilik (ambang dari brainstorm bagian 8 T3) | Catatan sesi T3 |
| MT-3 | Waktu verifikasi pembayaran | Detik dari payment masuk `awaiting_verification` sampai validator memutuskan Valid atau Tolak | Selisih `verifiedAt` dan waktu masuk `awaiting_verification` pada 10 skenario uji oleh 2 validator | Median ≤ 60 detik [HIPOTESIS, belum ada data pembanding] | Tabel `payments`, `audit_logs` |
| MT-4 | Waktu pemesanan customer | Detik dari membuka link meja sampai pesanan dibuat (respons `createOrder` sukses) untuk 3 menu | 5 penguji non-teknis, HP Android, koneksi seluler | Median ≤ 120 detik; ≥ 4 dari 5 selesai tanpa bantuan | Catatan sesi uji, log waktu klien |
| MT-5 | Konsistensi total tagihan | Persentase layar yang menampilkan total sama dengan `bill.total` hasil server | Uji otomatis pada 50 kombinasi item, varian, dan jumlah; bandingkan layar customer, kasir, dan data | 100% sama | Tes `calculateBill` dan E2E |
| MT-6 | Jaminan DB lulus | Jumlah tes J-01..J-12 dan T-00 yang hijau pada Postgres nyata dan Supabase lokal | Eksekusi CI penuh | 13 dari 13 hijau | Laporan CI |
| MT-7 | Penolakan transisi terlarang | Persentase percobaan transisi terlarang (mis. `paid` → `rejected`, bayar ganda) yang ditolak | Tes integrasi, daftar transisi tidak sah dari BR | 100% ditolak, tanpa perubahan data | Tes integrasi 🔍 |
| MT-8 | Kebenaran kedaluwarsa tanpa sweeper | Setelah sweeper dimatikan, ketersediaan dan status efektif tetap benar | Matikan sweeper, biarkan reservasi melewati `expires_at`, baca ketersediaan dan status | 100% benar pada 10 skenario | Tes T-04 dan tes status efektif |

Metrik yang sengaja tidak dipakai: konversi, pertumbuhan pesanan, kepuasan, dan penghematan waktu dibanding manual, karena demo tidak punya data pembanding.

---

## 5. Pengguna dan peran (ringkas; detail di P2)

| Peran | Akses | Dasar |
|---|---|---|
| customer | Anonim, tanpa akun, lewat QR meja; tidak punya jalur DB langsung | Keputusan 10 |
| kasir | Login; order, antrean, verifikasi pembayaran, terima tunai, bukti transfer (signed URL), toggle HABIS manual | Demo Pack v1 bagian 6 |
| pemilik | Login; semua kemampuan kasir, isi stok, lihat ledger, lihat log audit; juga validator | Keputusan 7; Q-012 |
| logistik | Login; isi stok, lihat ledger dan sisa, toggle HABIS manual; tidak melihat order atau payment | Demo Pack v1 bagian 6; J-02 |
| pemilik merangkap kasir | Varian umum di UMKM; satu akun berrole `pemilik` | brainstorm 3.2 [HIPOTESIS] |

---

## 6. Cakupan

### Modul dan kemampuan inti

| Modul | Kemampuan inti | MoSCoW |
|---|---|---|
| Customer (CUS) | Buka link meja; lihat menu, varian, catatan; keranjang; pilih metode bayar; buat pesanan; lihat status dan kode pesanan; unggah bukti transfer; batalkan pesanan `placed` | MUST |
| Pembayaran (PAY) | Empat metode (sandbox, manual_qris, transfer_proof, tunai); batas waktu bayar dan perpanjangan; kode unik; satu pintu `confirmPayment` | MUST 🔍 |
| Kasir (KAS) | Login; tab verifikasi; validasi atau tolak; terima tunai; antrean dan ubah status; pesanan walk-in | MUST |
| Logistik / stok (STK) | Isi stok porsi pagi; salin stok kemarin; lihat sisa dan ledger; toggle HABIS manual; menu otomatis HABIS | MUST 🔍 |
| Akses dan autentikasi (ACC) | Login staf, RBAC dan RLS, sesi anonim customer, token meja | MUST 🔍 |
| Platform (PLT) | Hari bisnis, kode pesanan, kedaluwarsa tiga lapis, rate limit, sandbox aman, log audit | MUST 🔍 |
| Penerimaan dan tes | Skenario demo, tes jaminan DB, tes konkurensi | MUST |
| Kemampuan tambahan | Perpanjang +15 menit oleh validator (hanya `awaiting_verification` atau `awaiting_cash`); kode unik pada manual_qris; polling adaptif; takeaway lewat QR outlet khusus | SHOULD |
| Lainnya | Banner SIMULASI; salin stok kemarin | SHOULD |
| Halaman audit untuk pemilik | Ditunda; tabel audit tetap ditulis | WON'T (pasca-demo) |

### Di luar cakupan (eksplisit)

Dapur · pay_after · void dan refund · CRUD admin (menu dan meja lewat seed) · Mode Resep · struk WhatsApp · QRIS dinamis asli · offline · multi-outlet UI · pajak dan biaya layanan (kolom ada, default 0) · pembatalan setelah `queued` · ganti metode bayar (batal lalu pesan ulang) · pembatalan oleh customer saat `awaiting_verification` (tidak diizinkan; Q-003 A).

---

## 7. Prinsip produk (maks 7)

1. **Server-authoritative.** Harga, total, ketersediaan, dan status dihitung dan ditegakkan server. Klien hanya menampilkan.
2. **Satu pintu per aturan.** `confirmPayment`, `reserveStock`, `nextPickupCode`, `releaseToQueue`, `getAvailability`, `calculateBill` masing-masing satu tempat.
3. **Kebenaran stok di atas kecepatan.** Lebih baik menolak pesanan daripada menjual porsi yang tidak ada.
4. **Kebenaran tidak bergantung job latar.** Ketersediaan dan status efektif benar walau sweeper mati.
5. **Aman secara default.** Klien browser tidak punya jalur tulis ke DB; akses diberikan eksplisit, bukan dicabut belakangan.
6. **Jujur kepada customer.** Nominal bayar tepat dan dijelaskan; tidak ada surcharge; bukti transfer diperlakukan sebagai klaim, bukan bukti.
7. **Ringan untuk HP Android lama dan data tidak stabil.** Tanpa instalasi aplikasi bagi customer; polling hemat.

---

## 8. Asumsi, batasan, dan ketergantungan

| # | Butir | Label | Sumber |
|---|---|---|---|
| A-1 | Hosting demo di Vercel Hobby dan Supabase tier gratis; Hobby khusus non-komersial (cukup untuk demo, bukan pilot); durasi fungsi 300 detik; Supabase gratis di-pause setelah 1 minggu tanpa aktivitas dan tanpa backup | Keputusan Q-007 (A, 7 Nov 2026); [TERVERIFIKASI 4 Nov 2026 di Spesifikasi Tech Stack]; konfirmasi manusia dari halaman resmi sebelum D-01 tetap diperlukan | Spek Tech Stack; Q-007 |
| A-2 | Pembayaran memakai QRIS statis dan konfirmasi manual; kasir memverifikasi dari mutasi, bukan screenshot | [FAKTA] aturan terkunci Tahap 0 | brainstorm 3.4b |
| A-3 | Outlet sasaran rumah makan; ukuran, jumlah staf, jam buka belum diketahui | [ASUMSI] | pemilik proyek 6 Nov 2026; Q-004, Q-010 |
| A-4 | Demo pay_first saja; rumah makan sering bayar belakangan | Keputusan 4; kesenjangan Q-004 | |
| A-5 | Online-only; internet putus = sistem berhenti; fallback walk-in oleh kasir | [FAKTA] keputusan terkunci | brainstorm 6.7 |
| A-6 | Cutoff hari bisnis 03:00 zona outlet; jam tutup outlet pilot belum diketahui | Keputusan 12 dan 14 disetujui 7 Nov 2026 (Q-005 A); jam tutup [ASUMSI]; cutoff adalah kolom outlet | Q-005 |
| A-7 | Kode unik berlaku untuk transfer_proof dan manual_qris | Disetujui 7 Nov 2026 (Q-006 A); tetap [HIPOTESIS] soal efektivitas; dapat dimatikan lewat `TRANSFER_UNIQUE_CODE=off` | Keputusan 13; Q-006 |
| A-8 | Sweeper memakai penjadwal eksternal 1-5 menit ditambah oportunistik (Q-011 A, 7 Nov 2026); ketersediaan cron/penjadwal belum diverifikasi | [BELUM TERVERIFIKASI] | Amandemen 5.8; Q-011 |
| A-9 | Ketergantungan pada Supabase Auth, Realtime, Storage, dan pooler transaksi | Teknis | Amandemen 0, 5.13 |
| A-10 | Pemilik proyek memegang peran review manusia untuk semua area 🔍 | Keputusan | AGENTS.md; Demo Pack v1 bagian 9 |
| A-11 | Data pasar lokal (Malang) tidak dipakai sebagai target; hanya konteks berlabel | [FAKTA] ketidakkonsistenan angka | Q-008 |

---

## 9. Risiko produk dan mitigasi

| # | Risiko | Mitigasi | Pemilik tindakan |
|---|---|---|---|
| R-1 | Wedge ternyata tidak laku (kompetitor gratis sudah punya auto-habis, atau pemilik enggan mengisi stok) | Jalankan T1, T2, T3; demo tidak menyebut wedge tervalidasi; keputusan lanjut atau ganti wedge ada di G0 | Pemilik proyek (manusia) |
| R-2 | Bukti transfer menambah permukaan penipuan; validator bisa salah menyetujui | Bukti diperlakukan klaim (ADR-0004); wajib centang "Sudah cocok dengan mutasi"; wajib `mutationAmount` = nominal; aksi diaudit 🔍 | Pemilik proyek; AI developer menerapkan |
| R-3 | Risiko sisa tidak bisa dihapus software: validator mengetik nominal tanpa membuka mutasi; QR meja difoto pihak lain; hash bukti dikalahkan perubahan satu piksel | Dibatasi, bukan dihilangkan: batas per meja, nominal unik, jendela waktu; didokumentasikan jujur di demo | Pemilik proyek |
| R-4 | Kebocoran service role atau kunci di environment memberi akses penuh | Simpan hanya di environment Vercel; J-01 membatasi anon; env demo dan pilot di project Supabase terpisah | Pemilik proyek |
| R-5 | Reservasi dan batas waktu bayar tidak sinkron setelah perpanjangan: porsi bisa dijual ganda (K1) | Q-001 A: perpanjangan payment dan reservasi atomik dalam satu fungsi (BR-120) | Diputuskan 7 Nov 2026 (Q-001 A, BR-120); AI developer menerapkan; uji wajib 🔍 |
| R-6 | Ledger append-only bolong karena TRUNCATE belum diblokir (K2) | Q-002 A: tambah pemblokir TRUNCATE (BR-121); T-06 membuktikan | AI developer; pemilik proyek meninjau 🔍 |
| R-7 | Migrasi berikutnya menghapus indeks parsial, trigger, atau fungsi hasil J-xx | T-00 penjaga migrasi di CI; manifest objek ikut direview | AI developer; pemilik proyek |
| R-8 | Demo terasa tidak cocok bagi rumah makan (bayar di akhir, dapur terpisah) | Q-004: narasi jujur; pay_after dan dapur ke jalur produk; tanyakan di T2 | Pemilik proyek |
| R-9 | Batas dan ToS Vercel Hobby tidak mendukung demo (batas durasi, penggunaan komersial) | Verifikasi dari halaman resmi sebelum D-01; lapisan `server/services` memudahkan pindah | Pemilik proyek |
| R-10 | Kedaluwarsa terlambat tampil karena sweeper tidak berjalan | Lapis 1 dan 2 menjamin kebenaran; sweeper hanya merapikan; penjadwal eksternal + oportunistik | AI developer |
| R-11 | Customer tidak bisa menyelesaikan pesanan karena data tidak stabil | Polling adaptif dengan banner "Menyambung ulang…"; idempotensi mencegah pesanan ganda | AI developer |
| R-12 | Angka riset tidak konsisten membuat persona dan metrik terlalu optimistis | Label [HIPOTESIS], tidak ada target dari pasar, bahan T2 | Penulis PRD |

---

## 10. Peta modul dan urutan rilis demo

Tanpa tanggal; hanya urutan dan ketergantungan (Demo Pack v1 bagian 7, Amandemen bagian 7).

| Tahap | Isi | Bergantung pada |
|---|---|---|
| M0 Fondasi | Skema Prisma v1.1 dibekukan; migrasi dan jaminan DB (J-08, J-09, J-04, J-10, lalu J-05, J-06, J-07, lalu J-01, J-02, J-03, J-11, lalu J-12 dan T-00); seed; env; akses dan sesi | Persetujuan manusia atas skema dan Zod |
| M1 Pesan dan bayar (Stream A) | Customer: menu, keranjang, pesanan; pembayaran empat metode; kasir: verifikasi, tunai, antrean, walk-in | M0 |
| M2 Stok porsi (Stream B) | Logistik: isi stok, salin kemarin, sisa, ledger; menu otomatis HABIS; tes konkurensi | M0; sebagian bergantung `reserveStock` dari M1 |

Stream A dan B dapat paralel setelah skema dan Zod dibekukan (brainstorm bagian 7).

---

## 11. Kriteria "demo siap" (Definition of Demo Done)

- [ ] Pemilik proyek menyetujui skema Prisma v1.1 dan Zod v1.1
- [x] Keputusan 12 dan 14 disetujui; Q-001, Q-002, Q-003 dijawab (7 Nov 2026)
- [ ] Customer menyelesaikan pesanan dengan keempat metode bayar dari HP Android
- [ ] Customer melihat total yang sama dengan hasil server di semua layar (MT-5 = 100%)
- [ ] Kasir atau pemilik memverifikasi, menolak, dan menerima tunai; semua lewat `confirmPayment`
- [ ] Dua customer yang berebut porsi terakhir menghasilkan tepat satu pesanan berhasil (MT-1 = 0 oversell)
- [ ] Menu otomatis HABIS saat tersedia ≤ 0 dan kembali tersedia saat reservasi dilepas
- [ ] Pembayaran kedaluwarsa benar walau sweeper dimatikan (MT-8)
- [ ] Penolakan bukti membatalkan pesanan dan customer dapat memesan ulang, termasuk dengan foto yang sama (Q-016 B; mekanisme database: Q-028 A disetujui — implementasi via task D-xx)
- [ ] J-01..J-12 dan T-00 hijau pada Postgres nyata dan Supabase lokal (MT-6); tidak ada yang dinyatakan "aman"
- [ ] Review manusia atas area 🔍 selesai dan dicatat: RLS/RBAC, migrasi, idempotensi dan transisi payment, upload bukti, alur tunai, konkurensi stok, rate limit
- [ ] Banner SIMULASI tampil dan `env.ts` menolak boot bila `APP_ENV=production` dengan sandbox aktif
- [ ] Narasi demo tidak menyebut wedge "tervalidasi" dan menyatakan batas demo (pay_first, tanpa dapur)
- [ ] Batas dan ToS Vercel Hobby sudah diverifikasi manusia dari halaman resmi

---

## 12. Pertanyaan terbuka

Seluruh Q-001 sampai Q-029 sudah dijawab manusia per 7 Nov 2026. Tidak ada pertanyaan yang memblokir PRD ini.

Catatan implementasi untuk keputusan yang mengubah kontrak beku (menunggu task D-xx terpisah):

| Q | Keputusan | Kontrak yang berubah |
|---|---|---|
| Q-027 (A) | `STOCK_BELOW_COMMITTED` 422 + pengingat HABIS manual di layar logistik | Kode error baru (non-kontrak-beku) |
| Q-028 (A) | Kolom `is_active` + partial unique index; dijamin DB | Skema, Jaminan DB, manifest T-00 |
| Q-029 (A) | Batas per (`tableToken`, `sid`) untuk takeaway; `tableToken` wajib untuk pesanan customer | `CreateOrderInput` |

Daftar lengkap: `OPEN-QUESTIONS.md`.
