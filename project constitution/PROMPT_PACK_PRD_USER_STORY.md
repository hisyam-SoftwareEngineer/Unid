# PROMPT PACK: PRD dan User Story Bertahap (Web App F&B)

Untuk: AI pendamping development (Antigravity atau sejenisnya) · Status: draft
Hasil akhir: paket dokumen produk di `docs/prd/` yang eksplisit, bisa ditelusuri, dan siap diturunkan menjadi task card.

---

## A. Cara memakai (baca sekali)

**1. Siapkan repo/folder kerja**
```
docs/
  source/        ← salin ke sini: Demo Pack v1, Amandemen v1.1, Jaminan Database v1.1, AGENTS.md,
                   MVP.md, rekomendasi_arsitektur.md, Executive Summary, dokumen riset lain
  prd/           ← hasil (dibuat AI)
  prompts/       ← simpan berkas ini di sini
  prd/PROGRESS.md        ← dibuat di P0, papan kemajuan (kunci anti-kehabisan-token)
  prd/OPEN-QUESTIONS.md  ← pertanyaan yang perlu keputusan manusia
```

**2. Jalankan satu prompt per sesi, berurutan.** Cara paling ringkas (bila AI bisa membaca berkas):
> `Eksekusi Prompt P4 dari docs/prompts/PROMPT_PACK_PRD_USER_STORY.md. Ikuti Pembuka Wajib dan Standar di bagian B.`

Bila AI tidak bisa membaca berkas, tempel **Bagian B (Pembuka Wajib) + prompt yang dipilih**.

**3. Bila token habis / sesi terputus:** buka sesi baru dan kirim:
> `Lanjutkan pekerjaan. Baca docs/prd/PROGRESS.md, temukan prompt berstatus PARTIAL atau IN-PROGRESS, dan lanjutkan dari penanda "LANJUTKAN DARI". Jangan mengulang bagian yang sudah ditandai DONE.`

**4. Setelah tiap prompt:** Anda meninjau hasil (±10 menit), jawab `OPEN-QUESTIONS.md`, lalu ubah status di PROGRESS.md menjadi `APPROVED` (atau minta revisi). Prompt berikutnya hanya jalan bila prasyaratnya `APPROVED`.

**Urutan dan ketergantungan**

| Prompt | Peran | Keluaran | Prasyarat |
|---|---|---|---|
| P0 | Product Operations Lead | konteks, glosarium, PROGRESS | — |
| P1 | Senior Product Manager | `01-prd-master.md` | P0 |
| P2 | Business Analyst + UX Researcher | `02-actors-journeys-permissions.md` | P1 |
| P3 | Business Analyst | `03-business-rules.md` | P1 |
| P4 | Product Owner + UX Lead | `10-module-customer-ordering.md` | P2, P3 |
| P5 | Product Owner + Payments Domain Expert | `11-module-payment.md` | P2, P3 |
| P6 | Product Owner + UX Lead | `12-module-kasir.md` | P5 |
| P7 | Product Owner + Operations Analyst | `13-module-logistik-stock.md` | P3 |
| P8 | Product Owner + Security Analyst | `14-module-access-auth.md` | P2 |
| P9 | Product Owner + Solution Architect | `15-module-platform.md` | P4–P8 |
| P10 | Product Owner + QA Lead | `16-demo-scenario-acceptance.md` | P4–P9 |
| P11 | Solution Architect + QA Lead | `20-nfr.md` | P9 |
| P12 | QA Lead | `21-traceability-matrix.md` | P4–P11 |
| P13 | Independent Reviewer | `22-consistency-review.md` | P12 |
| P14 | Tech Lead | `30-task-cards-v2.md` | P13 APPROVED |

P4–P8 saling tak bergantung kuat dan boleh dikerjakan di sesi terpisah (urutan fleksibel selama prasyarat terpenuhi).

---

## B. PEMBUKA WAJIB (berlaku untuk semua prompt)

```
KONTEKS PROYEK
Web app F&B untuk UMKM Indonesia: customer memesan lewat QR meja, kasir/pemilik memverifikasi pembayaran
dan mengelola antrean, logistik mengisi stok porsi. Stack: Next.js + Supabase + Prisma. Jalur: DEMO
(bukan produk/pilot). Wedge utama: stok porsi → menu otomatis HABIS, dan anti-oversell.
Bahasa dokumen: Indonesia. Bahasa identifier/ID: Inggris.

SUMBER KEBENARAN (urutan prioritas jika bertentangan)
1. docs/source/Spesifikasi Jaminan Database v1.1
2. docs/source/Demo Pack v1.1 Amandemen
3. docs/source/Demo Pack v1
4. docs/source/AGENTS.md
5. dokumen riset lain di docs/source/
Keputusan 1-16 pada Demo Pack tidak boleh diubah. Bila menurut Anda perlu diubah: JANGAN terapkan,
catat sebagai "Usulan perubahan" di OPEN-QUESTIONS.md dengan alasan dan dampak.

ATURAN MUTLAK
- TIDAK menulis kode, SQL, atau skema. Ini pekerjaan dokumen produk.
- TIDAK mengarang fakta, angka pasar, atau perilaku pengguna. Setiap klaim diberi label:
  [FAKTA] (ada di sumber, sebutkan berkasnya), [HIPOTESIS] (belum diuji), [ASUMSI] (kebutuhan agar bisa lanjut,
  perlu konfirmasi). Wedge tetap belum tervalidasi (Low confidence); jangan menyebutnya "terbukti".
- Setiap ketidakjelasan → catat di docs/prd/OPEN-QUESTIONS.md (ID Q-xxx, pertanyaan, 2 opsi, rekomendasi,
  dampak bila salah). Jangan menebak lalu membangun di atasnya, kecuali diberi label [ASUMSI] dan tidak
  menyangkut area review manusia.
- Area wajib review manusia (jangan dinyatakan "aman"): RLS/RBAC, migrasi, idempotensi dan transisi payment,
  upload/storage bukti, alur tunai, konkurensi stok, rate limit. Tandai 🔍.
- Pakai istilah baku dari docs/prd/00-context.md (glosarium). Satu konsep = satu istilah.
- Ruang lingkup demo: Dapur, pay_after, void/refund, CRUD admin, Mode Resep, struk WhatsApp, QRIS dinamis,
  offline, multi-outlet UI, pajak/biaya layanan = DI LUAR cakupan.

PROTOKOL ANTI-KEHABISAN-TOKEN (wajib)
1. Awal sesi: baca docs/prd/PROGRESS.md. Cocokkan dengan prompt yang diminta; cek prasyaratnya APPROVED.
2. Tulis keluaran BERTAHAP: satu bagian/satu bundel story per langkah, langsung simpan ke berkas.
   Maksimal 8 user story per langkah penulisan.
3. Setelah tiap bagian tersimpan, perbarui PROGRESS.md: status IN-PROGRESS dan baris
   "LANJUTKAN DARI: <bagian/ID story berikutnya>".
4. Bila merasa konteks/token hampir habis: BERHENTI di batas bagian yang utuh, simpan, status PARTIAL,
   isi "LANJUTKAN DARI". Jangan memotong bagian di tengah kalimat atau di tengah story.
5. Akhir: cek-mandiri (checklist di prompt), status DONE-MENUNGGU-REVIEW, dan tulis ringkasan 10 baris maks
   di chat: apa yang dihasilkan, jumlah story, pertanyaan terbuka, hal yang perlu keputusan manusia.

FORMAT USER STORY BAKU (dipakai semua modul)
ID: US-<MOD>-<nn>  (MOD: ORD, PAY, KAS, STK, ACC, PLT; nn dua digit berurutan, tidak dipakai ulang)
Judul: kata kerja + objek
Cerita: Sebagai <peran>, saya ingin <kemampuan>, agar <manfaat terukur>.
Prioritas: MUST / SHOULD / COULD (MoSCoW untuk demo) · Estimasi relatif: S / M / L
Aturan terkait: BR-xx (dari 03-business-rules.md), J-xx (jaminan database), Keputusan #
Prasyarat/Dependensi: US-xxx
Kriteria penerimaan (Given-When-Then), minimal 3, mencakup: jalur normal, validasi/kesalahan, batas/kasus tepi
Kasus tepi dan paralelisme: daftar singkat (mis. dua pengguna bersamaan, koneksi putus, kedaluwarsa)
Pesan/teks UI (Bahasa Indonesia) yang spesifik untuk keadaan penting
Di luar cakupan story ini: daftar
Data yang dibaca/ditulis: entitas tingkat konsep (bukan kolom/SQL)
Cara uji: hint jenis test (unit/integrasi/E2E/konkurensi) + 🔍 bila area review manusia
Label bukti: [FAKTA]/[HIPOTESIS]/[ASUMSI] untuk klaim yang tidak berasal dari spesifikasi

SYARAT STORY BAIK (INVEST + eksplisit)
Independen sejauh mungkin, bernilai bagi pengguna, dapat diuji, cukup kecil (≤ 1 PR, selesai ≤ 2 hari AI+review).
Setiap AC harus bisa dijadikan satu test otomatis tanpa interpretasi tambahan. Tidak ada kata samar
("cepat", "mudah", "sesuai") tanpa angka atau definisi. Bila ada, ganti dengan ukuran atau catat sebagai Q-xxx.
```

---

## P0: Konteks, glosarium, papan kemajuan
**Peran:** Product Operations Lead yang merapikan dokumen sumber.

```
PERAN: Product Operations Lead berpengalaman 10+ tahun pada produk SaaS restoran/POS.

TUGAS
1. Baca SEMUA berkas di docs/source/. Buat inventaris: nama berkas, tujuan, status, tanggal.
2. Tulis docs/prd/00-context.md berisi:
   a. Ringkasan produk (maks 15 baris) dan status validasi (apa yang [FAKTA], apa [HIPOTESIS]).
   b. Daftar 16 keputusan terkunci beserta statusnya (ringkas).
   c. Glosarium baku (istilah Indonesia ↔ identifier Inggris): outlet, meja, tableToken, bill, order,
      payment, reservasi, movement, hari bisnis, pickupCode, validator, gerbang antrean, kode unik, dst.
      Sertakan istilah yang DILARANG/dihindari beserta pengganti (mis. satu kata untuk "pesanan").
   d. Peta dokumen sumber: topik → berkas → bagian.
   e. Daftar konflik/ketidaksesuaian antar dokumen sumber yang Anda temukan (jika ada), dengan rekomendasi.
3. Buat docs/prd/PROGRESS.md dengan tabel P0-P14: prompt, status (NOT-STARTED/IN-PROGRESS/PARTIAL/
   DONE-MENUNGGU-REVIEW/APPROVED), berkas keluaran, prasyarat, "LANJUTKAN DARI", catatan.
4. Buat docs/prd/OPEN-QUESTIONS.md (kosong dengan templat: ID, pertanyaan, opsi A/B, rekomendasi, dampak,
   status, keputusan manusia).

CEK-MANDIRI: semua berkas sumber terbaca · glosarium tidak punya sinonim ganda · konflik dokumen tercatat ·
PROGRESS memuat 15 baris prompt · tidak ada kode.
```

## P1: PRD induk
**Peran:** Senior Product Manager.

```
PERAN: Senior Product Manager berpengalaman meluncurkan produk operasional UMKM (F&B/retail) di Indonesia,
terbiasa menulis PRD ringkas yang bisa dieksekusi tim kecil.
PRASYARAT: P0 APPROVED.

TUGAS: tulis docs/prd/01-prd-master.md, bertahap per bagian (simpan tiap bagian):
1. Ringkasan eksekutif (apa, untuk siapa, kenapa sekarang) - maks 10 baris.
2. Masalah dan peluang: hanya yang bersumber dari dokumen riset; beri label bukti dan sebutkan sumbernya.
3. Tujuan demo (maks 5) dan BUKAN tujuan (non-goals), eksplisit.
4. Metrik keberhasilan demo: definisikan 5-8 metrik yang BISA diukur dari demo (mis. waktu isi stok pagi untuk
   T3, jumlah oversell = 0 pada uji paralel, waktu verifikasi pembayaran, kecepatan pemesanan). Tiap metrik:
   definisi, cara ukur, target [HIPOTESIS], sumber data. Jangan mengarang target dari pasar.
5. Pengguna dan peran (ringkas; detail di P2).
6. Cakupan: tabel modul → kemampuan inti → prioritas MoSCoW; daftar "di luar cakupan" eksplisit.
7. Prinsip produk (maks 7) yang memandu trade-off (mis. server-authoritative, satu pintu per aturan,
   kebenaran stok di atas kecepatan).
8. Asumsi, batasan, dan ketergantungan (Vercel/Supabase tier gratis, QRIS statis, dst.), berlabel.
9. Risiko produk dan mitigasi (dari Bagian 12 Demo Pack + yang Anda temukan), dengan pemilik tindakan.
10. Peta modul dan urutan rilis demo (M0-M2) tanpa tanggal; hanya urutan dan ketergantungan.
11. Kriteria "demo siap" (Definition of Demo Done) berupa daftar yang dapat dicentang.
12. Pertanyaan terbuka yang memblokir PRD (rujuk OPEN-QUESTIONS).

CEK-MANDIRI: tiap metrik punya cara ukur · non-goals eksplisit · tidak ada klaim pasar tanpa sumber ·
tiap risiko punya mitigasi · tidak menyebut wedge "tervalidasi" · tidak ada kode.
```

## P2: Aktor, perjalanan, matriks izin
**Peran:** Business Analyst + UX Researcher.

```
PERAN: Business Analyst senior dan UX Researcher yang paham operasional warung/kafe kecil di Indonesia.
PRASYARAT: P1 APPROVED.

TUGAS: tulis docs/prd/02-actors-journeys-permissions.md:
1. Persona (customer, kasir, pemilik, logistik, + "pemilik merangkap kasir" sebagai varian umum UMKM):
   konteks kerja, tujuan, titik sakit, perangkat, tingkat literasi digital. Bersumber dari dokumen riset;
   bila tidak ada sumber → [ASUMSI] dan masukkan Q-xxx untuk divalidasi di T1/T2/T3.
2. Perjalanan (journey) end-to-end, tiap satu: pemicu, langkah, titik keputusan, hasil, titik gagal.
   Wajib: (a) customer pesan+bayar tiap metode (sandbox, manual_qris, transfer+bukti, tunai),
   (b) kasir verifikasi/tolak/terima tunai, (c) logistik isi stok pagi, (d) dua customer rebut porsi terakhir,
   (e) pembayaran kedaluwarsa, (f) bukti ditolak lalu customer pesan ulang.
   Format: tabel langkah | aktor | sistem | catatan | risiko.
3. Matriks izin per peran × kemampuan (diturunkan dari Demo Pack Bagian 6 + Amandemen); tandai sel yang
   ambigu sebagai Q-xxx. Sertakan apa yang TIDAK boleh dilakukan customer anonim.
4. Peta skenario kesalahan lintas aktor (siapa terdampak apa saat sesuatu gagal).

CEK-MANDIRI: semua perjalanan wajib ada · matriks izin cocok dengan sumber · tiap persona berlabel bukti ·
tidak ada perjalanan yang bertentangan dengan keputusan terkunci.
```

## P3: Katalog aturan bisnis
**Peran:** Business Analyst.

```
PERAN: Business Analyst senior spesialis pemodelan aturan bisnis (rule catalog) untuk sistem transaksi.
PRASYARAT: P1 APPROVED.

TUGAS: tulis docs/prd/03-business-rules.md - katalog aturan bernomor BR-001 dst., dikelompokkan:
Harga & tagihan · Pesanan & antrean · Pembayaran & TTL · Kode unik · Bukti transfer · Tunai · Stok & reservasi ·
Hari bisnis & kode pesanan · Batas & anti-penyalahgunaan · Akses & audit.
Tiap aturan: ID, pernyataan satu kalimat yang dapat diuji (harus/tidak boleh), alasan bisnis, sumber
(berkas+bagian), jaminan DB terkait (J-xx), modul pemilik (ORD/PAY/KAS/STK/ACC/PLT), contoh angka konkret.
Tambahkan:
- Tabel transisi status (payment, order, bill, reservasi) dalam bentuk dari-ke-pemicu-aktor, disalin setia
  dari sumber (jangan menambah transisi baru; usulan masuk OPEN-QUESTIONS).
- Tabel TTL dan perpanjangan, batas (3 order belum bayar, 30 porsi, dll.), rate limit [HIPOTESIS].
- Daftar "aturan yang saling bergantung" (mis. rejected → order cancelled → reservasi released).
- Daftar celah: aturan yang dibutuhkan tetapi belum ada di sumber → Q-xxx.

CEK-MANDIRI: tiap BR dapat diuji · tidak ada dua BR yang bertentangan · tiap BR punya sumber · transisi sama
persis dengan sumber · tidak ada BR tanpa modul pemilik.
```

---

## Templat prompt modul (P4-P9 memakai struktur yang sama)

Setiap prompt modul berisi: **peran, prasyarat, berkas masukan, tugas, parameter modul, cek-mandiri**.
Bagian "TUGAS BAKU MODUL" di bawah berlaku untuk P4-P9 dan tidak diulang di tiap prompt.

```
TUGAS BAKU MODUL (untuk P4-P9)
Tulis berkas PRD modul secara bertahap (simpan per bagian) dengan struktur:
1. Tujuan modul dan nilai bagi pengguna; kaitan ke metrik di 01-prd-master.
2. Cakupan dan di luar cakupan modul.
3. Aktor dan izin yang relevan (rujuk 02).
4. Aturan bisnis yang berlaku (daftar BR-xx, rujuk 03; jangan menyalin ulang isinya).
5. Alur utama dan alur alternatif/kesalahan (diagram teks atau tabel langkah).
6. Inventaris layar dan state: untuk tiap layar: tujuan, elemen utama, state wajib (memuat, kosong, galat,
   sukses, offline/terputus, habis/kedaluwarsa), teks Bahasa Indonesia untuk state penting, perilaku mobile.
   Tanpa mockup visual; deskripsi struktur dan perilaku saja.
7. Kebutuhan data tingkat konsep (entitas dibaca/ditulis, bukan kolom).
8. Kebutuhan non-fungsional khusus modul (angka konkret, rujuk NFR bila sudah ada).
9. USER STORY lengkap sesuai Format Baku (Bagian B), dikelompokkan per kemampuan. Tiap kemampuan
   di bagian 2 harus punya minimal satu story; tiap BR yang dimiliki modul harus tertutup oleh minimal satu AC.
10. Matriks kecil: story → BR → J → jenis test.
11. Risiko modul, pertanyaan terbuka (Q-xxx baru ke OPEN-QUESTIONS), dan hal yang perlu review manusia 🔍.
Tulis story dalam bundel ≤ 8 per langkah penyimpanan (lihat Protokol).
```

## P4: Modul Customer Ordering (ORD)
```
PERAN: Product Owner senior e-commerce/F&B mobile-first + UX Lead dengan pengalaman antarmuka pesan-di-meja
untuk pengguna ponsel kelas menengah-bawah dan koneksi seluler tidak stabil.
PRASYARAT: P2 dan P3 APPROVED. KELUARAN: docs/prd/10-module-customer-ordering.md

PARAMETER MODUL
Kemampuan wajib tercakup: buka tautan/QR meja (token valid/tidak valid/diputar) · lihat menu per kategori ·
varian dan catatan · status HABIS (otomatis dan manual) dengan alasan yang tampil · keranjang (batas qty,
ketersediaan berubah saat di keranjang) · pilih jenis pesanan (dine-in/takeaway) dan nama · pilih metode bayar ·
checkout dan penanganan "menu habis saat checkout" (pesan jelas, bagian mana yang habis) · idempotensi tombol
kirim ganda · tampilan kode pesanan · batas order belum bayar (pesan Indonesia) · pesan ulang dari keranjang tersimpan.
Perhatikan: mobile-first, koneksi lambat/putus, layar kecil, tangan satu, literasi digital rendah.
Story prefix: US-ORD-nn. Tandai 🔍 untuk apa pun yang menyentuh rate limit/idempotensi.
CEK-MANDIRI: semua kemampuan punya story · tiap story ≥3 AC · state layar lengkap · tidak ada harga dari klien.
```

## P5: Modul Payment (PAY)
```
PERAN: Product Owner senior produk pembayaran + Payments Domain Expert (QRIS statis, transfer manual,
rekonsiliasi mutasi, tunai di kasir) dengan kesadaran risiko penipuan bukti transfer.
PRASYARAT: P2 dan P3 APPROVED. KELUARAN: docs/prd/11-module-payment.md

PARAMETER MODUL
Empat metode: sandbox (simulasi), manual_qris (klaim "sudah bayar"), transfer_proof (unggah bukti, kode unik,
kompres di klien, perpanjangan TTL), cash (kode pesanan, bayar di kasir). Wajib tercakup: pembuatan payment
dan TTL per metode · perpanjangan (klaim, bukti, perpanjang oleh validator maks 2×) · kode unik (alokasi,
tampilan nominal persis, salah nominal) · unggah bukti (init/finalize, tipe/ukuran, duplikat) · pembatalan
sebelum bayar · penolakan dan alasan yang tampil ke customer · kedaluwarsa dan bayar terlambat (validator lambat)
· sandbox hanya di lingkungan demo (banner SIMULASI, mati di produksi) · satu bill satu payment non-final.
Setiap alur pembayaran: sertakan skenario paralel (klik ganda, dua tab, validator dan sweeper bersamaan).
Story prefix: US-PAY-nn. Hampir seluruh modul ini 🔍; nyatakan eksplisit pada tiap story.
Risiko yang HARUS dibahas: validator mengetik nominal tanpa membuka mutasi; QR meja difoto; hash dikalahkan
ubah-satu-piksel; kode unik tidak terbukti membantu [HIPOTESIS].
CEK-MANDIRI: semua transisi 5.2 tertutup AC · tiap alur kegagalan punya pesan Indonesia · tidak ada kemampuan
yang melanggar aturan "paid hanya lewat satu pintu".
```

## P6: Modul Kasir (KAS)
```
PERAN: Product Owner senior sistem POS + UX Lead untuk alur kerja kasir yang sibuk (multitasking, layar
tablet/ponsel, interupsi tinggi, banyak notifikasi).
PRASYARAT: P5 APPROVED. KELUARAN: docs/prd/12-module-kasir.md

PARAMETER MODUL
Tab Verifikasi (daftar menunggu, bukti via signed URL, nominal diketik wajib, catatan mutasi, tolak+alasan,
perpanjang hold), daftar menunggu bayar tunai (cari lewat kode pesanan, terima tunai, kembalian dari server),
antrean pesanan (transisi sah saja, indikator item baru, status realtime + polling cadangan), order walk-in
(lewat service yang sama dengan customer), toggle HABIS manual, tampilan dan beban kerja saat banyak
antrean, kasir ganda membuka item yang sama (konflik), koneksi terputus/kembali.
Pertimbangkan: urutan prioritas daftar (yang hampir kedaluwarsa di atas), peringatan sisa waktu, pencegahan
salah tekan (konfirmasi untuk aksi tidak bisa dibatalkan), aksesibilitas (target sentuh, kontras, suara/getar
opsional [ASUMSI]).
Story prefix: US-KAS-nn. 🔍 untuk verifikasi pembayaran dan tunai.
CEK-MANDIRI: setiap kemampuan di matriks izin kasir/pemilik punya story · tidak ada aksi yang melewati
tabel transisi · konflik dua kasir tercakup.
```

## P7: Modul Logistik / Stok (STK)
```
PERAN: Product Owner senior manajemen stok F&B + Operations Analyst yang paham persiapan pagi dapur warung.
PRASYARAT: P3 APPROVED. KELUARAN: docs/prd/13-module-logistik-stock.md

PARAMETER MODUL
Isi stok porsi pagi (satu angka per menu, satu halaman, target waktu isi sebagai bahan T3) · salin stok
kemarin (menyalin total opening kemarin, bisa diubah) · lihat sisa realtime · koreksi turun/naik saat hari
berjalan (konsekuensi terhadap reservasi yang sudah ada) · menu tanpa StockItem = tak terbatas · toggle HABIS
manual · otomatis HABIS saat tersedia ≤ 0 (siapa melihat apa, alasan tampil) · hari bisnis dan pergantian hari
(cutoff) · tahap rekap opsional (terjual/sisa/terbuang).
Wajib dibahas: anti-oversell untuk porsi terakhir (dua pemesan bersamaan), reservasi kedaluwarsa melepas stok,
perilaku ketika logistik menurunkan stok di bawah jumlah yang sudah tereservasi, ketersediaan negatif ditampilkan
HABIS. Dokumen ini sumber utama bahan uji T3: definisikan data yang harus dicatat (waktu isi, jumlah koreksi).
Story prefix: US-STK-nn. 🔍 untuk konkurensi stok dan koreksi saat berjalan.
CEK-MANDIRI: tiap angka (batas 0-999 dst.) berasal dari sumber · tidak ada reservasi yang berubah tanpa
transisi sah · definisi "tersedia" konsisten dengan J-04.
```

## P8: Modul Akses dan Autentikasi Staf (ACC)
```
PERAN: Product Owner + Security Analyst aplikasi web (OWASP, RBAC, sesi, penyalahgunaan endpoint publik).
PRASYARAT: P2 APPROVED. KELUARAN: docs/prd/14-module-access-auth.md

PARAMETER MODUL
Login staf (email+password Supabase), pengarahan per peran (/kasir, /logistik; pemilik boleh keduanya),
penolakan lintas outlet, sesi dan logout, pemulihan kata sandi [tentukan masuk/tidak ke demo → Q-xxx],
akun dibuat lewat seed, sesi customer anonim (cookie sid bertanda tangan), token meja (entropi, rotasi),
perlindungan endpoint publik (rate limit, batas per meja), penanganan kebocoran token/QR, audit log
siapa melakukan apa (pemilik melihat), pemisahan database demo dan pilot.
Pikirkan penyalahgunaan: bot membanjiri order, tahan stok massal lewat QR yang difoto, peniruan sesi.
Story prefix: US-ACC-nn. Seluruh modul 🔍.
CEK-MANDIRI: setiap sel matriks izin punya story atau alasan mengapa tidak · tidak ada asumsi "kepercayaan
pada klien" · risiko sisa (QR statis) dinyatakan eksplisit.
```

## P9: Modul Platform (PLT)
```
PERAN: Product Owner teknis + Solution Architect yang menerjemahkan kebutuhan lintas-modul menjadi kemampuan
produk yang jelas.
PRASYARAT: P4-P8 APPROVED. KELUARAN: docs/prd/15-module-platform.md

PARAMETER MODUL
Status realtime staf (Realtime + polling cadangan) dan customer (polling adaptif, ETag, backoff, banner
menyambung ulang) · kedaluwarsa tiga lapis (ketersediaan benar tanpa job, status efektif, sweeper) ·
konvensi error dan pesan Indonesia terpusat · flag lingkungan (APP_ENV, sandbox, kode unik) · konfigurasi
tujuan pembayaran (rekening, QRIS statis) · seed data demo · pemantauan dasar dan log (requestId) ·
pencatatan metrik demo (untuk metrik di PRD induk) · perilaku saat database/Storage lambat atau tidak tersedia.
Story prefix: US-PLT-nn. Tulis story dari sudut pengguna/operator ("Sebagai pemilik, saya ingin pesanan tetap
akurat walau koneksi saya putus, agar..."), bukan sudut teknis, dan tautkan ke NFR yang akan datang.
CEK-MANDIRI: tidak ada story yang hanya "mengimplementasikan X" tanpa nilai pengguna · semua BR milik PLT
tertutup · angka polling/TTL sesuai sumber.
```

## P10: Skenario demo dan penerimaan
```
PERAN: Product Owner + QA Lead yang merancang skenario penerimaan (UAT) dan naskah demo.
PRASYARAT: P4-P9 APPROVED. KELUARAN: docs/prd/16-demo-scenario-acceptance.md

TUGAS
1. Naskah demo 15-20 menit langkah demi langkah (siapa memegang perangkat apa, apa yang diucapkan, hasil
   yang diharapkan), menonjolkan wedge: porsi terakhir diperebutkan dua customer, menu otomatis HABIS.
2. Skenario UAT end-to-end (≥ 12) mencakup 4 metode bayar, penolakan, kedaluwarsa, tunai, koreksi stok, dua
   kasir, koneksi putus. Tiap skenario: prasyarat data seed, langkah, hasil, story yang dibuktikan (US-xxx).
3. Data seed yang dibutuhkan demo (menu, varian, stok, meja, akun) dalam bentuk tabel kebutuhan (bukan skrip).
4. Rencana pengukuran metrik demo (siapa mencatat apa, kapan) dan bahan T3.
5. Daftar "yang tidak boleh diklaim dari demo" (mis. wedge tervalidasi).
6. Kriteria lulus/gagal demo dan rencana cadangan (apa yang dilakukan bila sesuatu rusak saat demo).

CEK-MANDIRI: tiap story MUST dibuktikan minimal satu skenario · tiap metrik punya pencatat · skenario dapat
dijalankan dari data seed saja.
```

## P11: Kebutuhan non-fungsional
```
PERAN: Solution Architect + QA Lead spesialis non-functional requirements untuk aplikasi web transaksional
kecil.
PRASYARAT: P9 APPROVED. KELUARAN: docs/prd/20-nfr.md

TUGAS: NFR bernomor NFR-xxx, tiap butir: kategori, pernyataan terukur, cara verifikasi, target [HIPOTESIS]
bila tanpa sumber, modul terkait, 🔍 bila area review manusia. Kategori: performa (waktu muat menu di 4G
lambat, waktu respons pembuatan order), ketersediaan demo, konkurensi (jumlah permintaan paralel yang harus
benar), keamanan (rujuk J-01..J-12 dan OWASP relevan), privasi (data customer minimal, retensi bukti),
aksesibilitas (kontras, target sentuh, bahasa), kompatibilitas (peramban/ponsel target), observabilitas,
pemulihan (apa yang terjadi saat restart/cron mati), kapasitas tier gratis (batas yang perlu diverifikasi
[BELUM TERVERIFIKASI]), kemudahan pemeliharaan (rujuk AGENTS.md).
Jangan mengarang angka: tulis rentang usulan, label [HIPOTESIS], dan cara menetapkannya dari uji demo.
CEK-MANDIRI: tiap NFR bisa diverifikasi dengan cara yang disebut · tidak ada kata samar tanpa angka.
```

## P12: Matriks ketertelusuran
```
PERAN: QA Lead berpengalaman membangun traceability matrix untuk sistem transaksional.
PRASYARAT: P4-P11 APPROVED. KELUARAN: docs/prd/21-traceability-matrix.md

TUGAS: tabel dan daftar pemeriksaan:
1. BR → story → AC → jenis test (satu baris per BR; tandai BR tanpa story = GAP).
2. J-xx → story/AC yang membuktikannya → T-xx dari Spesifikasi Jaminan (tandai GAP).
3. Metrik PRD → modul → story → cara ukur.
4. Keputusan terkunci 1-16 → story yang menegakkannya.
5. Daftar GAP dan duplikasi (dua story berbeda menyatakan hal sama / saling bertentangan).
6. Statistik: jumlah story per modul/prioritas, % BR tertutup, % J tertutup, jumlah story tanpa AC lengkap.
Bekerja bertahap per kelompok BR (maks ±25 baris per langkah simpan).
CEK-MANDIRI: tidak ada BR/J/Keputusan yang hilang dari matriks · statistik cocok dengan isi berkas.
```

## P13: Tinjauan konsistensi independen
```
PERAN: Independent Reviewer (principal product + principal engineer) yang TIDAK menulis dokumen sebelumnya.
Tugas Anda mencari kelemahan, bukan membenarkan. PRASYARAT: P12 DONE.
Jangan mengubah dokumen sumber; hanya melaporkan. KELUARAN: docs/prd/22-consistency-review.md

TUGAS: tinjau seluruh docs/prd/ terhadap docs/source/:
1. Kontradiksi antar dokumen (aturan, angka, istilah, transisi) - kutip dua lokasi, usulkan perbaikan.
2. Story yang tidak bisa diuji (AC samar), terlalu besar, atau melanggar keputusan terkunci/jaminan DB.
3. Aturan bisnis yang hilang di story, atau story yang membuat aturan baru tanpa BR.
4. Celah alur: situasi yang terjadi di dunia nyata warung yang belum tercakup (bayar tapi kedaluwarsa,
   tamu pindah meja, kasir salah verifikasi, kehabisan setelah bayar, dll.).
5. Risiko demo yang meremehkan atau melebih-lebihkan kemampuan.
6. Klaim tanpa label bukti; label bukti yang salah.
7. Peringkat temuan: BLOCKER / MAYOR / MINOR, dengan lokasi, dampak, dan usulan perbaikan konkret.
8. Verdik per modul: SIAP / PERLU REVISI + alasan.
Bekerja bertahap per modul; simpan temuan setelah tiap modul.
CEK-MANDIRI: setiap temuan punya lokasi dan usulan · tidak ada pujian tanpa bukti · tidak ada "tampak baik" tanpa
daftar yang diperiksa.
```

## P14: Task card versi 2 (dari story)
```
PERAN: Tech Lead / Engineering Manager yang memecah story menjadi tugas AI-ready.
PRASYARAT: P13 APPROVED dan semua temuan BLOCKER/MAYOR ditutup. KELUARAN: docs/prd/30-task-cards-v2.md

TUGAS: turunkan task card D-xx dari story MUST/SHOULD, memakai urutan dan ketergantungan dari Amandemen v1.1
Bagian 7 sebagai titik awal (boleh dipecah/digabung dengan alasan). Tiap kartu:
ID · judul · story yang dicakup (US-xxx) · BR dan J terkait · AC (disalin dari story, tidak diubah makna) ·
Kontrak beku · Batas file (path) · Di luar scope · Test wajib · Ukuran S/M/L (≤ 1 PR) · Ketergantungan ·
🔍 bila review manusia · prompt eksekusi (templat Bagian 13 AGENTS.md terisi).
Aturan: satu kartu ≤ 1 PR; tidak ada story tanpa kartu; tidak ada kartu tanpa story (kecuali fondasi D-00-D-04,
beri alasan). Simpan bertahap per milestone (M0, M1, M2).
CEK-MANDIRI: matriks story → kartu lengkap dua arah · batas file tidak saling tumpang tindih antar Stream A/B ·
urutan tidak melanggar ketergantungan.
```

---

## C. Penanda status dan serah-terima (ringkas)

| Status | Arti | Siapa yang mengubah |
|---|---|---|
| NOT-STARTED | belum | — |
| IN-PROGRESS | sedang ditulis, ada "LANJUTKAN DARI" | AI |
| PARTIAL | berhenti karena token/waktu di batas utuh | AI |
| DONE-MENUNGGU-REVIEW | lulus cek-mandiri | AI |
| APPROVED | ditinjau dan disetujui | **Manusia** |

Perintah singkat siap pakai:
- Mulai: `Eksekusi Prompt P<n> dari docs/prompts/PROMPT_PACK_PRD_USER_STORY.md.`
- Lanjut: `Lanjutkan dari docs/prd/PROGRESS.md.`
- Revisi: `Revisi docs/prd/<berkas> berdasarkan catatan ini: <catatan>. Ubah hanya bagian terkait, perbarui PROGRESS.`
- Penyegaran konteks (sesi panjang): `Baca ulang Pembuka Wajib (Bagian B), PROGRESS.md, dan berkas keluaran terakhir; ringkas status dalam 5 baris sebelum melanjutkan.`
