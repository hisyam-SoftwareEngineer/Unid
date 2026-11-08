# 02 Aktor, Perjalanan, dan Matriks Izin

Status: DONE-MENUNGGU-REVIEW · Disusun: 6 Nov 2026 · Prompt: P2 · Prasyarat: P1 (menunggu persetujuan manusia; dikerjakan berurutan atas instruksi "lanjut")
Label: [FAKTA] ada di sumber · [HIPOTESIS] belum diuji · [ASUMSI] perlu konfirmasi · 🔍 area wajib review manusia.
Sumber utama: Demo Pack v1 (bagian 2, 5, 6), Amandemen v1.1 (bagian 5, 7), Jaminan DB v1.1 (J-02, J-11), brainstorm Tahap 0 (bagian 3.2, 4, 6). Istilah baku: `00-context.md` bagian 4.

---

## 1. Persona

Tidak ada data primer (wawancara T2 belum dijalankan). Semua detail perilaku selain yang tercantum di sumber berlabel [ASUMSI] dan divalidasi di T1/T2/T3 (Q-008).

Profil outlet: rumah makan, satu outlet [dinyatakan pemilik proyek, 6 Nov 2026]; 2-6 orang, HP Android, QRIS statis, tanpa printer dan layar dapur [HIPOTESIS, brainstorm 3.2 segmen S1].

### 1.1 Customer

| Aspek | Isi | Label |
|---|---|---|
| Konteks | Duduk di meja rumah makan atau memesan bawa pulang; memindai QR statis di meja; tanpa akun, tanpa memasang aplikasi | [FAKTA] keputusan terkunci (brainstorm bagian 4) |
| Tujuan | Memesan, tahu menu yang masih ada, membayar dengan cara yang dikenal, tahu kapan pesanan siap | [HIPOTESIS] |
| Titik sakit | Menu habis setelah dipesan; tidak yakin pembayaran sudah diterima; data seluler tidak stabil | menu habis [HIPOTESIS, diuji T2]; data tidak stabil [FAKTA] brainstorm bagian 4 |
| Perangkat | HP sendiri, sering Android lama | [HIPOTESIS] |
| Literasi digital | Bervariasi; QRIS umum dikenal. Tingkat tidak diketahui | [ASUMSI] Q-008 |
| Kebiasaan bayar | Rumah makan umumnya bayar setelah makan; demo memaksa bayar di awal | [HIPOTESIS] (Q-004) |

### 1.2 Kasir

| Aspek | Isi | Label |
|---|---|---|
| Konteks | Menjaga meja kasir; menerima tunai; memeriksa mutasi QRIS atau transfer; mengurus antrean | [HIPOTESIS] |
| Tujuan | Memastikan uang masuk sebelum pesanan diproses; tidak tertipu bukti palsu | [FAKTA] kualitatif (brainstorm H2) |
| Titik sakit | Verifikasi dari screenshot rawan penipuan; jadi hambatan saat ramai; pelanggan mengetik nominal sendiri | [FAKTA] kualitatif (H2, 3.4b) |
| Perangkat | HP atau tablet Android | [HIPOTESIS] |
| Literasi digital | Menengah; sudah terbiasa membuka aplikasi bank atau merchant | [ASUMSI] |

### 1.3 Pemilik

| Aspek | Isi | Label |
|---|---|---|
| Konteks | Mengambil keputusan, bisa mengerjakan semua peran; juga validator | [FAKTA] keputusan 7 |
| Tujuan | Menghindari porsi terjual melebihi yang ada; melihat jejak audit | [HIPOTESIS] |
| Titik sakit | Hambatan biaya langganan; pencatatan manual | [FAKTA] lemah (H1) |
| Kesediaan mengisi stok pagi | Belum diketahui | [HIPOTESIS] diuji T3 |
| Literasi digital | Tidak diketahui | [ASUMSI] |

### 1.4 Logistik

| Aspek | Isi | Label |
|---|---|---|
| Konteks | Mengisi stok porsi tiap pagi; melihat sisa; mengecek ledger. Di rumah makan kecil bisa pemilik atau juru masak | [ASUMSI] |
| Tujuan | Satu angka per menu per hari, secepat mungkin | [FAKTA] prinsip desain (brainstorm bagian 5) |
| Titik sakit | Beban input resep bahan baku (dihindari di demo) | [FAKTA] argumentasi desain |
| Perangkat | HP Android | [ASUMSI] |
| Literasi digital | Tidak diketahui | [ASUMSI] |

### 1.5 Pemilik merangkap kasir (varian umum)

| Aspek | Isi | Label |
|---|---|---|
| Konteks | Satu orang memegang semua peran selain customer; satu akun role `pemilik`; kemungkinan tidak ada logistik terpisah | [HIPOTESIS] brainstorm 3.2 |
| Konsekuensi | Matriks izin pemilik harus mencakup kasir dan logistik; tidak ada pemisahan tugas antara pembuat dan validator pembayaran | [FAKTA] matriks Demo Pack v1 bagian 6 |
| Risiko | Pemisahan peran tidak berlaku, sehingga kontrol anti-penipuan bergantung pada disiplin dan log audit | analisis penulis |

---

## 2. Perjalanan end-to-end

Kolom: langkah | aktor | sistem | catatan | risiko. Nomor transisi dan angka mengikuti Amandemen 5 dan Demo Pack v1 5. Tidak ada perjalanan yang bertentangan dengan keputusan 1-16.

### 2.1 Pesan dan bayar, metode `sandbox`

Pemicu: customer memindai QR meja. Hasil: pesanan `queued`, pembayaran `paid`. Titik gagal: porsi habis, batas waktu 10 menit, batas pesanan.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1 | customer memindai QR statis (`/m/{outlet}/{tableToken}`) | middleware menerbitkan cookie `sid` bertanda tangan; token meja divalidasi | Customer anonim; `tableToken` 22 karakter acak | QR difoto pihak lain; dibatasi batas per meja |
| 2 | customer melihat menu, varian, catatan | `getAvailability` memakai rumus tunggal J-04; menu tersedia ≤ 0 tampil HABIS | Rate limit `GET menu` 120/mnt per IP | Menu salah tampil bila ada salinan rumus 🔍 |
| 3 | customer mengisi keranjang | keranjang di klien; total hanya estimasi | qty baris 1-10, ≤ 30 porsi total, catatan ≤ 140 karakter | Total klien berbeda dari server |
| 4 | customer memilih jenis (dine_in/takeaway), nama opsional, metode `sandbox`, menekan Pesan | `createOrder` satu transaksi: idempotensi, kunci meja, `calculateBill`, `reserveStock`, bill+order+payment `pending`, `nextPickupCode` | TTL 10 menit; kode pesanan A-nnn (dine-in) atau B-nnn (takeaway) langsung ditampilkan | Klik ganda (idempotensi); stok kurang (`OUT_OF_STOCK`); batas 3 order belum bayar per meja |
| 5 | customer menekan tombol simulasi bayar | `confirmPayment`: payment `paid`, bill `paid`, reservasi `confirmed`, movement `consume`, `releaseToQueue` ke `queued` | Banner SIMULASI; endpoint hanya aktif bila `PAYMENT_SANDBOX_ENABLED` | Sandbox aktif di produksi (ditolak `env.ts`) |
| 6 | customer memantau status | polling adaptif 3 detik lalu 5, lalu 10; berhenti di status final | `If-None-Match`; banner "Menyambung ulang…" pada 429/5xx | Data seluler tidak stabil |
| 7 | kasir memajukan status: preparing → ready → completed | `AdvanceOrderInput`; hanya maju | Tidak boleh loncat | Kasir salah pencet; tidak ada undo di demo |

### 2.2 Pesan dan bayar, metode `manual_qris`

Pemicu: customer memilih QRIS statis. Hasil: `paid` setelah validator mencocokkan mutasi.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1-3 | customer: sama seperti 2.1 langkah 1-3 | sama | | |
| 4 | customer memilih `manual_qris`, menekan Pesan | `createOrder`: payment `pending`, TTL 10 menit, `allocateUniqueCode` (potongan 1-99 Rupiah bila total ≥ 1.000 dan fitur aktif) | Teks UI: "Bayar tepat Rp… (potongan kode unik Rp…). Nominal harus persis agar dikenali." Gambar QRIS statis dari seed/env | 99 slot nominal habis → `SYSTEM_BUSY` 503; customer salah ketik nominal |
| 5 | customer membayar di aplikasi bank/e-wallet sendiri lalu menekan "Sudah bayar" | payment `awaiting_verification`; `expiresAt = max(expiresAt, sekarang+15 mnt)` sekali | Klaim, bukan bukti | Klaim palsu; klaim di menit ke-9 hanya menyisakan 1 menit (ditutup perpanjangan) |
| 6 | kasir membuka tab Verifikasi dan mencocokkan dengan mutasi/notifikasi di aplikasi merchant | daftar payment `awaiting_verification` via refetch dipicu Realtime; cadangan polling 10 detik | Customer tidak ikut | Kasir tidak membuka mutasi |
| 7 | kasir mengisi `mutationAmount`, mencentang "Sudah cocok dengan mutasi", menekan Valid | `confirmPayment`; nominal harus sama dengan `payment.amount` atau `AMOUNT_MISMATCH` 422 | Aksi dicatat di log audit | Salah menyetujui 🔍 (risiko sisa tidak bisa dihapus software) |
| 8 | customer melihat status `queued`, lalu lanjut seperti 2.1 langkah 6-7 | sama | | |

### 2.3 Pesan dan bayar, metode `transfer_proof` (transfer + bukti)

Pemicu: customer memilih transfer bank. Hasil: `paid` setelah validator mencocokkan bukti dan mutasi. Titik gagal: unggahan, bukti duplikat, penolakan.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1-3 | customer: sama seperti 2.1 | sama | | |
| 4 | customer memilih `transfer_proof`, menekan Pesan | `createOrder`: payment `pending`, TTL 15 menit, kode unik | Menampilkan rekening tujuan (seed/env) dan nominal tepat | Rekening salah di seed |
| 5 | customer mentransfer, lalu memilih foto bukti | klien mengompres (sisi maks 1600 px, JPEG kualitas 0,8) | Menghindari foto HP > 2 MB | Kompresi gagal di perangkat lama |
| 6 | klien memanggil `proof/init` lalu mengunggah ke Storage | server memeriksa payment, status, kepemilikan (`orderId` + cookie); membuat path `{outletId}/{paymentId}/{uuid}.jpg` dan signed upload URL | Rate limit `proof/*` 10/10 menit per sid | Unggah ke payment orang lain (dicegah cookie) 🔍 |
| 7 | klien memanggil `proof/finalize` | server mengunduh objek, cek ukuran dan magic bytes (JPEG/PNG), hitung SHA-256, simpan `PaymentProof`, payment `awaiting_verification`, `expiresAt = sekarang + 30 mnt` sekali | Gagal atau duplikat → objek dihapus, `PROOF_INVALID` atau `PROOF_DUPLICATE` | Ubah satu piksel mengalahkan hash; dibantu mutasi dan nominal unik 🔍 |
| 8 | kasir membuka item verifikasi | server membuat signed URL bukti berumur 60 detik saat item dibuka | Hanya kasir dan pemilik | URL bocor (umur pendek) 🔍 |
| 9 | kasir mencocokkan bukti dengan mutasi, mengisi `mutationAmount`, mencentang, Valid | `confirmPayment` | Bukti = klaim (ADR-0004) | Salah menyetujui |
| 10 | customer memantau sampai `queued` | polling | | |

### 2.4 Pesan dan bayar, metode `cash` (tunai)

Pemicu: customer memilih bayar di kasir. Hasil: `paid` setelah kasir menerima tunai.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1-3 | customer: sama seperti 2.1 | sama | | |
| 4 | customer memilih `cash`, menekan Pesan | `createOrder`: payment `awaiting_cash`, TTL 20 menit; maks 1 order tunai aktif per meja | Kode pesanan ditampilkan besar di layar customer | Customer lupa ke kasir; kedaluwarsa 20 menit |
| 5 | customer ke kasir menunjukkan kode pesanan | | Tidak ada langkah sistem | Salah menyebut kode |
| 6 | kasir mencari pesanan menurut kode, menerima uang, mengisi `amountReceived` ≥ `payment.amount` | `confirmPayment` dengan bukti nominal diterima; kembalian dihitung server | Tunai tidak memakai kode unik 🔍 area alur tunai | Salah hitung kembalian ditutup server; pesanan palsu (batas 1 tunai aktif per meja) |
| 7 | customer melihat `queued` | polling | | |

### 2.5 Kasir: verifikasi, tolak, terima tunai (ringkasan peran)

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| a | kasir menekan Valid pada payment non-tunai | lihat 2.2 langkah 7 | wajib centang dan `mutationAmount` | |
| b | kasir menekan Tolak dan mengisi alasan (wajib, ≤ 140 karakter) | payment `rejected`; reservasi `released`; order `cancelled`; bill `void` (satu transaksi); customer diberi alasan | Lihat 2.7 | Alasan kosong ditolak validasi |
| c | kasir menerima tunai | lihat 2.4 langkah 6 | | |
| d | kasir menekan Perpanjang +15 menit | `holdExtensions` +1 (maks 2×), diaudit | Mengatasi validator lambat | Perpanjangan tak menyentuh reservasi → Q-001 🔍 |
| e | kasir membatalkan order `placed` | payment `cancelled`; reservasi `released`; order `cancelled`; bill `void` | Order `queued` tidak boleh dibatalkan di demo | Batal saat `awaiting_verification` ambigu (Q-003) |

### 2.6 Logistik isi stok pagi

Pemicu: pagi hari sebelum buka. Hasil: movement `opening` tertulis; menu otomatis HABIS saat tersedia ≤ 0.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1 | logistik login (Supabase Auth) ke `/logistik` | peran dan outlet diturunkan dari `profiles` | Tidak ada jalur lain | RBAC bocor 🔍 |
| 2 | logistik (opsional) menekan "Salin stok kemarin" | formulir diisi dari total `opening` kemarin (bukan sisa); dapat diubah | Satu halaman, satu angka per menu | Menyalin angka lama tanpa memeriksa |
| 3 | logistik mengisi porsi per menu (0-999) | | Target T3: 10 menu ≤ 3 menit | Salah ketik 999 |
| 4 | logistik menekan Simpan | server menghitung selisih terhadap saldo hari itu dan menulis satu movement `opening` bertanda (naik atau turun); hanya `businessDate` hari ini atau +1 | Menurunkan `opening` mengunci baris stok yang sama seperti `reserveStock` 🔍 | Menurunkan di bawah reservasi berjalan → ketersediaan negatif; ditampilkan 0 (Q-019) |
| 5 | logistik melihat sisa per menu dan ledger | `available_portions` | Ketersediaan negatif ditampilkan 0 | |
| 6 | logistik menandai HABIS manual pada menu tertentu | `manualSoldOut` | Berlaku sampai ditandai kembali | Lupa dibuka kembali (Q-019) |

### 2.7 Dua customer berebut porsi terakhir

Pemicu: stok tersisa 1 porsi (K = 1) dan dua customer menekan Pesan bersamaan. Hasil: tepat satu pesanan berhasil.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1 | customer A dan B menekan Pesan hampir bersamaan, masing-masing 1 porsi | dua transaksi `createOrder` | Kunci `FOR UPDATE` pada baris `stock_items` berurutan id | Deadlock jika urutan kunci salah 🔍 |
| 2 | sistem melayani A lebih dulu | `reserveStock` memeriksa `available_portions` ≥ kebutuhan, membuat reservasi `held` | | |
| 3 | sistem melayani B | `available_portions` = 0 → `OUT_OF_STOCK` dengan sisa yang tersedia (0) | B melihat menu HABIS dan pesan yang jelas | Pesan error tidak ramah |
| 4a | A membayar | `consume` ditulis saat `confirmPayment`; sisa tetap 0 | | |
| 4b | A tidak membayar (kedaluwarsa atau ditolak) | reservasi `released`; ketersediaan kembali 1 | B dapat memesan ulang | Dalam jendela 10-15 menit menu HABIS padahal belum terjual (konsekuensi desain reservasi) |

### 2.8 Pembayaran kedaluwarsa

Pemicu: `expiresAt` terlewat tanpa `paid`. Hasil: payment `expired`, reservasi `released`, order `expired`, bill `void`.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1 | tidak ada aktor | `available_portions` mengabaikan reservasi `held` yang `expires_at`-nya lewat (lapis 1) | Kebenaran stok tanpa job latar | Perpanjangan payment tidak menyentuh `reservation.expires_at` (Q-001) 🔍 |
| 2 | customer membuka status | server menghitung `effectiveStatus` = `expired`; jalur baca tidak menulis (lapis 2) | | |
| 3 | sweeper | `POST /api/cron/expire` memproses ≤ 50 baris `FOR UPDATE SKIP LOCKED`: payment `expired`, reservasi `released`, order `expired`, bill `void`, audit (lapis 3) | Penjadwal eksternal 1-5 menit + oportunistik | Sweeper tidak berjalan; hanya tampilan terlambat |
| 4 | kasir menekan Valid pada payment yang sudah lewat | `PAYMENT_EXPIRED`; UI menyarankan membuat pesanan walk-in; audit `payment.expired_with_proof` | Kasus validator lambat | Customer sudah membayar tetapi tidak dilayani |
| 5 | customer memesan ulang | `createOrder` baru dengan idempotency key baru | Keranjang tersimpan di klien | |

### 2.9 Bukti ditolak, lalu customer memesan ulang

Pemicu: validator menolak bukti. Hasil: pesanan `cancelled`; customer memesan ulang.

| # | Aktor | Sistem | Catatan | Risiko |
|---|---|---|---|---|
| 1 | kasir memilih Tolak, mengisi alasan | payment `rejected`; reservasi `released`; order `cancelled`; bill `void`; audit | Alasan bisa dibaca customer | Alasan tidak sopan atau terlalu teknis |
| 2 | customer melihat status `rejected` dengan alasan | polling | Tombol Pesan ulang | |
| 3 | customer menekan Pesan ulang | keranjang dari klien; `createOrder` baru dengan idempotency key baru | Metode bisa diganti pada pesanan baru; tidak ada ganti metode pada pesanan lama (keputusan 14) | Customer memakai bukti yang sama: `PROOF_DUPLICATE` karena hash unik per outlet (Q-016) |
| 4 | customer membayar dan mengunggah bukti baru | seperti 2.3 | | Stok mungkin sudah habis saat pesan ulang |

---

## 3. Matriks izin per peran × kemampuan

Sumber: Demo Pack v1 bagian 6, Amandemen 5.7 dan bagian 6 (endpoint), J-01, J-02, J-11. Y = boleh, T = tidak boleh, "?" = ambigu (Q-xxx). Seluruh matriks ada di area 🔍 RBAC/RLS.

| Kemampuan | customer anonim | kasir | pemilik | logistik |
|---|---|---|---|---|
| Melihat menu dan ketersediaan | Y | Y | Y | Y |
| Membuat pesanan (via `tableToken`) | Y | Y (walk-in) | Y (walk-in) | T |
| Melihat status pesanan sendiri | Y (`orderId` + cookie) | Y | Y | T |
| Mengunggah bukti, menekan "Sudah bayar" untuk pesanan sendiri | Y (`orderId` + cookie) | T | T | T |
| Membatalkan pesanan `placed` sendiri | Y, kecuali saat `awaiting_verification` (Q-003) | Y | Y | T |
| Menggunakan tombol simulasi sandbox | Y (hanya bila sandbox aktif) | T | T | T |
| Melihat antrean dan semua pesanan | T | Y | Y | T |
| Mengubah status pesanan (maju saja) | T | Y | Y | T |
| Verifikasi pembayaran (Valid/Tolak) | T | Y | Y | T |
| Terima tunai | T | Y | Y | T |
| Perpanjang batas waktu bayar (+15 menit, maks 2×) | T | Y | Y | T |
| Melihat bukti transfer (signed URL 60 detik) | T | Y | Y | T |
| Mengisi stok pagi | T | T | Y | Y |
| Melihat sisa stok | T | Y | Y | Y |
| Melihat ledger pergerakan stok | T | Y (lihat; Q-018) | Y | Y |
| Menandai HABIS manual | T | Y | Y | Y |
| Melihat log audit | T | T | Y | T |
| Melihat payment dan order di jalur Realtime | T | Y (outlet sendiri) | Y (outlet sendiri) | T |
| Melihat reservasi stok | T | Y | Y | Y |

### Yang TIDAK boleh dilakukan customer anonim

- Mengakses tabel database atau Realtime secara langsung (J-01, J-03).
- Membaca pesanan atau status orang lain; hanya `orderId` (UUID v4) miliknya yang bisa dibaca, menurut capability URL, dan menulis hanya dengan `orderId` + cookie `sid`.
- Menghitung atau mengirim harga, total, atau nominal; server menghitung semuanya (`calculateBill`).
- Memverifikasi pembayarannya sendiri kecuali metode `sandbox` di lingkungan demo.
- Melihat bukti transfer yang diunggah (bucket privat, J-11), termasuk miliknya sendiri setelah diunggah (tidak ada kebutuhan di sumber).
- Mengubah status pesanan, membatalkan setelah `queued`, atau mengganti metode bayar pada pesanan yang sudah dibuat.
- Membuat lebih dari 3 pesanan belum bayar per meja atau per sesi, lebih dari 1 pesanan tunai aktif per meja, lebih dari 30 porsi per pesanan, atau qty baris di luar 1-10.
- Melihat angka stok mentah atau reservasi; hanya status tersedia/HABIS (Q-017).

### Sel ambigu

| Sel | Pertanyaan | Q |
|---|---|---|
| Customer membatalkan saat `awaiting_verification` | Boleh atau tidak | Q-003 |
| Customer melihat jumlah sisa porsi (mis. "sisa 3") atau hanya HABIS/tersedia | Sumber hanya menyebut "HABIS" dan sisa di pesan `OUT_OF_STOCK` | Q-017 |
| Kasir melihat ledger: lewat permukaan apa | Matriks Demo Pack v1 hanya menulis "lihat"; kasir tidak boleh isi stok | Q-018 |
| Metode bayar pesanan walk-in | Sumber hanya menyebut "service yang sama dengan D-06 (source walk_in)" | Q-018 |

---

## 4. Peta skenario kesalahan lintas aktor

| Kegagalan | Customer | Kasir/pemilik | Logistik | Catatan sistem |
|---|---|---|---|---|
| Porsi habis saat memesan | Pesanan ditolak `OUT_OF_STOCK`; menu tampil HABIS | Tidak terdampak | Dapat menambah `opening` | Ketersediaan dari rumus tunggal |
| Pembayaran kedaluwarsa | Status `expired`; memesan ulang | Item hilang dari daftar verifikasi; Valid → `PAYMENT_EXPIRED` | Porsi kembali tersedia | Lapis 1-3 |
| Bukti duplikat | `PROOF_DUPLICATE`; unggah foto lain | Tidak melihat item | Tidak terdampak | Hash unik per outlet |
| Bukti tidak valid (ukuran, magic bytes) | `PROOF_INVALID`; unggah ulang | Tidak melihat item | Tidak terdampak | Objek dihapus |
| Nominal tidak cocok | Menunggu; mungkin ditolak | `AMOUNT_MISMATCH` 422 pada Valid; Tolak | Tidak terdampak | |
| Validator lambat | Payment bisa `expired` walau sudah membayar | Menyarankan pesanan walk-in; audit `payment.expired_with_proof` | Tidak terdampak | Dicegah perpanjangan 5.6 |
| Salah menyetujui bukti palsu | Pesanan masuk antrean tanpa uang | Kerugian; terekam di audit | Tidak terdampak | Risiko sisa 🔍 |
| Internet customer putus | Banner "Menyambung ulang…"; idempotensi mencegah pesanan ganda | Tidak terdampak | Tidak terdampak | Polling backoff 15 detik |
| Internet outlet putus | Tidak bisa memesan | Tidak bisa verifikasi | Tidak bisa mengisi stok | Online-only; fallback walk-in tidak berfungsi tanpa internet |
| Sweeper tidak berjalan | Status efektif benar; baris DB masih lama | Daftar bisa menampilkan baris lama | Tidak terdampak | Kebenaran dari lapis 1-2 |
| Terlalu banyak pesanan belum bayar | Pesan "melewati batas" | Antrean bisa terpenuhi pesanan iseng | Tidak terdampak | 3 per meja, 3 per sesi |
| QR meja disalahgunakan | Tidak terdampak langsung | Bisa menerima pesanan palsu hingga batas | Stok tertahan sampai kedaluwarsa | Batas per meja; rotasi token di pasca-demo |
| Rate limit tercapai | Pesan Bahasa Indonesia "terlalu sering"; coba lagi | Tidak terdampak | Tidak terdampak | WiFi bersama/CGNAT |
| Sandbox aktif di produksi | Pesanan "dibayar" tanpa uang | Kerugian | Tidak terdampak | `env.ts` menolak boot |
| Ledger salah ketik (opening) | Menu tampil tersedia padahal tidak ada | Pesanan tak bisa dipenuhi | Pelaku koreksi lewat `adjust`/`opening` baru | Append-only; tidak ada hapus |
| Reservasi lebih lama dari perpanjangan payment | Customer sah membayar setelah porsi dijual ke orang lain | Menerima pembayaran yang tak bisa dipenuhi | Tidak terdampak | Q-001 🔍 |

---

## 5. Pertanyaan terbuka baru dari P2

Ditambahkan ke `OPEN-QUESTIONS.md`: Q-016 (hash bukti yang ditolak vs pesan ulang), Q-017 (tampilan sisa porsi ke customer), Q-018 (akses kasir ke ledger dan metode bayar walk-in), Q-019 (menurunkan `opening` di bawah reservasi berjalan, dan masa berlaku HABIS manual).
