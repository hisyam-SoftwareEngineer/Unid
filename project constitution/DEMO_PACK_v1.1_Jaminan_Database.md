# DEMO PACK v1.1: Spesifikasi Jaminan Database (pengganti blok SQL di Bagian 3 Amandemen)

Status: draft, menunggu review manusia · Tidak berisi sintaks migrasi. Implementasi ditulis AI developer (Antigravity) dan **dibuktikan oleh test**. Review manusia: ✔ pada semua jaminan.

## Cara memakai dokumen ini
- Setiap **Jaminan (J-xx)** adalah kontrak: *apa yang harus selalu benar*, bukan *bagaimana menulisnya*.
- AI developer memilih sintaks, tetapi **tidak boleh melemahkan** jaminan, menambah pengecualian, atau menggantinya dengan pemeriksaan di kode aplikasi saja.
- Jaminan baru dianggap selesai bila **tes pembuktiannya** hijau pada Postgres nyata.
- Bila ada keraguan, ambigu, atau konflik dengan skema/Zod: **BERHENTI dan tanyakan**.

## Aturan migrasi (berlaku untuk semua J)
1. Prisma Migrate adalah satu-satunya sistem migrasi. Hal yang tidak bisa dimodelkan Prisma (indeks parsial, trigger, fungsi, RLS, GRANT, publikasi Realtime) ditulis sebagai berkas migrasi kustom yang **dibuat lewat mekanisme migrasi kosong Prisma**, satu berkas per jaminan, bernama sesuai ID jaminan.
2. Migrasi berikutnya tidak boleh menghapus atau mengubah objek hasil J-xx tanpa persetujuan manusia. Setelah setiap `migrate dev`, ada pemeriksaan otomatis bahwa semua objek J-xx masih ada (lihat T-00).
3. Supabase CLI hanya untuk stack lokal; tidak ada folder migrasi Supabase.
4. Migrasi pertama harus bisa jalan di Postgres biasa (CI/shadow database) **dan** di Supabase asli. Objek bawaan Supabase yang tidak ada di Postgres biasa (skema auth, role anon/authenticated, publikasi Realtime) dibuat hanya bila belum ada, dan tidak berefek di Supabase asli.
5. Penamaan: tabel snake_case plural, kolom snake_case (sesuai `@@map`/`@map` di skema). Semua jaminan merujuk nama basis data, bukan nama model Prisma.

---

## J-01 Default tertutup untuk klien browser
- **Tujuan:** customer anonim dan akun staf tidak punya jalur tulis ke database mana pun; kebocoran anon key tidak berarti kebocoran data.
- **Perilaku:**
  - Role `anon` tidak bisa membaca atau menulis tabel apa pun di skema publik.
  - Role `authenticated` tidak pernah bisa INSERT/UPDATE/DELETE di tabel mana pun.
  - `authenticated` hanya boleh SELECT pada: orders, payments, stock_movements, stock_reservations, audit_logs (sesuai J-02).
  - Tabel baru di masa depan otomatis tidak memberi hak apa pun ke kedua role (default privilege dicabut).
  - RLS aktif di **semua** tabel; tabel tanpa policy = tolak semua.
- **Jebakan:** Supabase memberi hak penuh ke anon/authenticated secara default; mengaktifkan RLS saja tidak cukup, hak (GRANT) harus dicabut juga. Dua lapis harus sama-sama ada.
- **Bukti (T-01):** sebagai `anon` dan `authenticated`, setiap operasi tulis di setiap tabel ditolak; `anon` SELECT ke setiap tabel ditolak; menambah tabel uji baru tidak memberi hak ke role mana pun.

## J-02 Akses baca staf dibatasi outlet dan role
- **Perilaku:** staf hanya melihat baris dengan `outlet_id` sama dengan outlet profilnya.
  - kasir, pemilik: orders, payments.
  - kasir, pemilik, logistik: stock_movements, stock_reservations.
  - pemilik saja: audit_logs.
  - logistik: tidak boleh melihat payments maupun orders.
- Outlet dan role diturunkan dari tabel `profiles` berdasarkan identitas login, **tidak pernah dari klaim yang bisa diubah klien**.
- **Jebakan:** fungsi pembantu yang membaca `profiles` harus berjalan dengan hak pemilik fungsi dan jalur pencarian dikunci, kalau tidak terjadi rekursi RLS atau pembajakan jalur. Pemanggilan identitas dibungkus agar dievaluasi sekali per query (performa).
- **Bukti (T-02):** staf outlet B tidak melihat baris outlet A; logistik tidak melihat payments/orders; kasir tidak melihat audit_logs; pemilik melihat.

## J-03 Realtime hanya sebagai pemicu
- **Perilaku:** tabel orders, payments, stock_movements, stock_reservations dipublikasikan ke Realtime. Karena J-01 dan J-02, event hanya sampai ke staf yang berhak. Aplikasi memperlakukan event sebagai sinyal refetch, tidak pernah sumber data.
- Customer anonim **tidak** memakai Realtime (polling, lihat Amandemen 5.11).
- **Bukti (T-03):** staf outlet A menerima event outlet A dan tidak menerima event outlet B; klien anon tidak bisa subscribe data.

## J-04 Satu rumus ketersediaan stok
- **Perilaku:** tersedia(item, hari) = jumlah movement item pada hari bisnis itu dikurangi jumlah reservasi berstatus `held` **dan** belum kedaluwarsa (`expires_at` masih di masa depan) pada hari bisnis itu.
  - Rumus ini ada di **satu tempat** di database dan dipakai semua jalur (customer, kasir, logistik, reserveStock). Tidak boleh ada salinan rumus di kode aplikasi.
  - Hasilnya benar walau tidak ada job latar yang membersihkan status.
  - Reservasi hari lain tidak mengurangi stok hari ini.
- **Bukti (T-04):** reservasi `held` yang sudah lewat `expires_at` tidak mengurangi ketersediaan walau statusnya belum diubah; reservasi hari lain tidak berpengaruh; hasil sama di semua jalur pemanggil.

## J-05 Nominal pembayaran aktif unik (kode unik)
- **Perilaku:** dalam satu outlet, tidak boleh ada dua payment **aktif** (`pending` atau `awaiting_verification`) dengan `amount` sama **bila keduanya memakai kode unik** (`unique_code_discount > 0`).
  - Payment dengan kode unik 0 (total kecil atau fitur dimatikan), `awaiting_cash`, dan payment berstatus final tidak membatasi.
  - Dijamin oleh batasan di database, bukan hanya pemeriksaan aplikasi, sehingga permintaan paralel tidak bisa lolos.
  - Pelanggaran dilaporkan sebagai kesalahan unik yang bisa ditangkap aplikasi untuk mengulang pemilihan kode.
- **Jebakan:** unik biasa pada (outlet, amount) **salah** karena memblokir order lama yang sah. Prisma tidak memodelkan indeks parsial dan bisa menghapusnya pada migrasi berikutnya (lihat T-00).
- **Bukti (T-05):** 100 pembuatan payment paralel dengan total sama menghasilkan nominal berbeda semua; dua insert langsung dengan nominal sama ditolak; setelah payment pertama final, nominal itu boleh dipakai lagi.

## J-06 Ledger dan audit append-only
- **Perilaku:** baris di stock_movements dan audit_logs tidak bisa diubah atau dihapus oleh siapa pun yang tersambung lewat aplikasi, **termasuk service role dan koneksi Prisma** (jaminan harus berlaku walau RLS dilewati).
  - Koreksi dilakukan dengan menambah baris baru (adjust/waste), bukan mengubah.
  - Mengosongkan tabel (truncate) ikut diblokir; reset test memakai template database.
  - Setiap reservasi menghasilkan paling banyak satu movement `consume` (satu movement per reservasi), dijamin di database.
- **Bukti (T-06):** UPDATE, DELETE, TRUNCATE ditolak sebagai role aplikasi; dua `consume` untuk reservasi sama ditolak.

## J-07 Status final tidak bisa dibuka lagi
- **Perilaku:** sebagai jaring pengaman (bukan sumber aturan transisi):
  - payments dengan status `paid, rejected, expired, cancelled` tidak bisa berubah status.
  - orders dengan status `completed, cancelled, expired` tidak bisa berubah status.
  - stock_reservations dengan status `confirmed, released` tidak bisa berubah status.
  - Pembaruan kolom lain pada baris final (mis. `updated_at`) tidak dipermasalahkan.
- Graf transisi lengkap tetap **satu sumber** di kode TypeScript. Jaminan ini tidak menggandakannya. V2 akan melonggarkan `paid → refunded` lewat migrasi tersendiri.
- **Bukti (T-07):** mencoba mengubah status baris final lewat SQL langsung ditolak untuk setiap tabel dan setiap status final.

## J-08 Konsistensi outlet pada jalur uang dan pesanan
- **Perilaku:** `outlet_id` ada di semua tabel tenant. Hubungan bill↔order, bill↔payment, order↔order_item harus mengikat **id dan outlet_id bersama**, sehingga baris anak tidak bisa menunjuk induk di outlet lain.
- **Bukti (T-08):** insert payment dengan outlet berbeda dari bill-nya ditolak; invarian "tidak ada anak dengan outlet berbeda dari induknya" bernilai nol baris.

## J-09 Hari bisnis berasal dari satu sumber
- **Perilaku:** hari bisnis = (waktu sekarang di zona waktu outlet) dikurangi cutoff menit outlet, diambil tanggalnya. Dihitung di database dari kolom `timezone` dan `day_cutoff_minutes` outlet; aplikasi tidak menghitung sendiri dan tidak memakai zona waktu server.
- **Bukti (T-09):** outlet WIB dengan cutoff 180 pada 01:30 lokal menghasilkan tanggal kemarin, pada 03:30 menghasilkan hari ini; outlet zona lain (WITA/WIT) menghasilkan tanggal benar pada saat yang sama.

## J-10 Nomor pesanan atomik tanpa lubang
- **Perilaku:** `pickup_code` dihasilkan dari penghitung per (outlet, hari bisnis, jenis) yang naik atomik pada permintaan paralel; nomor tidak pernah ganda; bila transaksi dibatalkan, kenaikan ikut dibatalkan (tidak ada lubang). Unik per (outlet, hari bisnis, kode) sebagai jaring pengaman.
- **Bukti (T-10):** 50 pembuatan order paralel menghasilkan 50 kode berurutan unik; satu order gagal di tengah tidak meninggalkan lubang.

## J-11 Bucket bukti transfer privat
- **Perilaku:** bucket `payment-proofs` privat, batas 2 MB, hanya JPEG/PNG, **tanpa** policy akses untuk anon maupun authenticated. Akses hanya lewat service role di server (upload bertanda tangan dan signed URL lihat 60 detik).
- **Bukti (T-11):** unduh langsung oleh anon dan oleh staf (tanpa signed URL) ditolak; unggahan di atas 2 MB atau tipe lain ditolak oleh bucket itu sendiri.

## J-12 Rate limit dan idempotensi tahan paralel
- **Perilaku:** penghitung rate limit naik atomik per kunci dan jendela waktu; kunci idempotensi unik per outlet dan payload yang berbeda dengan kunci sama dikenali.
- **Bukti (T-12):** 100 permintaan paralel pada batas 6 meloloskan tepat 6; dua permintaan identik bersamaan menghasilkan satu order.

---

## T-00 Penjaga migrasi (wajib, otomatis di CI)
Test yang berjalan setelah **semua** migrasi diterapkan dari nol dan memastikan:
- setiap objek hasil J-01 sampai J-12 masih ada (daftar objek dikelola di satu berkas manifest yang ikut direview manusia);
- tidak ada perubahan skema tertunda (`migrate dev` tidak menghasilkan migrasi baru dari kondisi bersih);
- migrasi berjalan di Postgres biasa **dan** di stack Supabase lokal.
Bila manifest dan database berbeda, CI gagal.

## Urutan pengerjaan dan kepemilikan
| Langkah | Isi | Penulis | Peninjau |
|---|---|---|---|
| 1 | Skema Prisma v1.1 + migrasi awal | AI developer | manusia ✔ |
| 2 | J-08, J-09, J-04, J-10 (struktur dan fungsi inti) | AI developer | manusia ✔ |
| 3 | J-05, J-06, J-07 (batasan dan trigger) | AI developer | manusia ✔ |
| 4 | J-01, J-02, J-03, J-11 (akses dan Storage) | AI developer | manusia ✔ |
| 5 | J-12 dan T-00 | AI developer | manusia ✔ |

## Yang tetap diputuskan manusia
1. Apakah daftar jaminan ini lengkap untuk demo (ada yang perlu ditambah/dikurangi).
2. Cutoff hari bisnis default 03:00.
3. Hasil review atas implementasi setiap jaminan **sebelum** dinyatakan selesai. AI tidak menyatakan jaminan "aman"; hanya "tes lulus".
