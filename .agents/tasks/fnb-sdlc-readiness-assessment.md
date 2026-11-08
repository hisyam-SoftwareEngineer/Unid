# Penilaian Kesiapan SDLC: Proyek GTNIC-WEB (Web App F&B UMKM)

Tipe: investigasi READ-ONLY · Tanggal: 7 Nov 2026 · Lingkup: dokumentasi (belum ada kode)
Penanya: "bagaimana kesiapan project ini untuk menyusun requirement untuk SDLC"

---

## Ringkasan eksekutif (jawaban langsung)

**Verdikt: HAMPIR SIAP.** Dokumentasi produk proyek ini jauh di atas rata-rata proyek awal: ada PRD induk, persona, 9 perjalanan end-to-end, matriks izin, ~97 aturan bisnis yang dapat diuji, jaminan database, skema Prisma v1.1, kontrak Zod, spesifikasi logika kritis, keputusan stack, dan metrik keberhasilan demo. Yang menahan naik ke "SIAP" adalah tiga hal konkret: (1) **NFR belum ada dokumen terpisah** (`P11 20-nfr.md` NOT-STARTED di `PROGRESS.md`); (2) **acceptance criteria per-fitur belum ditulis** (`P10`, `L1-*`, `F-*`, `SL-*` semua NOT-STARTED) — saat ini AC hanya hidup di tingkat demo (MT-1..MT-8) dan di templat prompt, bukan per-fitur; (3) **empat pertanyaan terbuka baru (Q-026..Q-029)** belum dijawab manusia, dua di antaranya menyentuh kontrak beku (Skema, Jaminan DB, `CreateOrderInput`) dan harus diselesaikan sebelum skema dibekukan di M0. Selain itu ada satu kontradiksi dokumen yang harus dituntaskan: versi root dan "folder yang baru" bertentangan pada Q-016 (Opsi A vs B).

Dengan kata lain: fondasi kebutuhan (apa, untuk siapa, aturan apa) sudah lengkap dan ketat. Yang tersisa adalah lapisan kebutuhan tingkat fitur (AC, NFR terkuantifikasi) dan penuntasan keputusan terbuka pada kontrak beku. Keduanya sudah punya rencana dan templat di `PROGRESS.md`/prompt pack — bukan lubang yang tak terpikirkan, melainkan langkah berikutnya yang terjadwal.

Catatan metode: dokumen inti (PRD, aktor, BR, OPEN-QUESTIONS, PROGRESS, AGENTS, Jaminan DB, Spek Tech Stack, arsitektur) dibaca penuh. `DEMO_PACK_v1.1_Amandemen.md` (39 KB) dan `MVP.md` (52 KB) dibaca selektif (struktur, skema, Zod, logika kritis, bagian scope/G0/ADR); isi penuhnya tidak dihabiskan baris-demi-baris. Dokumen riset (Analisis_Kompetitor, Audit_Bukti, Evidence_Audit, Desain_Validasi, Executive_Summary, Technical-Feasibility-Study, R1_Paket_Bukti) hanya disampling perananya; tidak dibaca penuh karena `MVP.md` bagian 5 (register klaim dan sumber) dan `01-prd-master.md` bagian 2 sudah merangkum peran dan label kekuatan buktinya. Sudah ada review lintas-versi sebelumnya di `.agents/tasks/review-folder-baru-2026-11-07/review.md`; temuan-temuannya saya konfirmasi ulang dari pembacaan langsung.

---

## 1. Inventaris artefak dokumentasi

Dikelompokkan menurut peran. "Root" = `d:\Coding\Project\GTNIC-WEB\`; "Baru" = subfolder `folder yang baru (...)`.

### A. Spesifikasi produk (apa & untuk siapa)

| Berkas | Peran | Isi inti |
|---|---|---|
| `01-prd-master.md` (root & Baru) | PRD induk | Ringkasan eksekutif, masalah/peluang (M-1..M-9), tujuan demo (G-1..G-5) + non-goals, metrik (MT-1..MT-8), peran ringkas, cakupan MoSCoW, prinsip produk (7), asumsi (A-1..A-11), risiko (R-1..R-12), peta modul (M0-M2), Definition of Demo Done, pertanyaan terbuka |
| `02-actors-journeys-permissions.md` (root & Baru) | Aktor, perjalanan, izin | 5 persona, 9 perjalanan end-to-end (sandbox/manual_qris/transfer_proof/cash/kasir-ringkas/logistik/konkurensi/kedaluwarsa/bukti-ditolak), matriks izin peran×kemampuan, daftar larangan customer, peta skenario kesalahan lintas aktor |
| `03-business-rules.md` (root & Baru) | Katalog aturan bisnis | ~87 BR (BR-001..BR-119) + 10 baru (BR-120..BR-129 di Baru) dikelompokkan 11 domain, tabel transisi status (payment/order/bill/reservasi), tabel TTL & perpanjangan, tabel batas, tabel rate limit [HIPOTESIS], rantai aturan bergantung, katalog celah |
| `MVP.md` | Scope MVP + gate validasi | Status fase/gate, **G0 validasi wedge** (ambang T1/T2/T3), instrumen T1 (teardown kompetitor), T2 (wawancara A1-A3/B1-B8), T3 (prototipe klik), Fase 1 scope (44 fitur A/B/C), ADR-0001 (tunai), register klaim & sumber, lampiran master prompt |

### B. Tech / arsitektur / data

| Berkas | Peran | Isi inti |
|---|---|---|
| `DEMO_PACK_v1.1_Amandemen.md` | Amandemen teknis | **Skema Prisma v1.1** (outlets, profiles, categories, menu_items, menu_variants, tables, bills, orders, order_items, payments, payment_proofs, stock_items, stock_movements, stock_reservations, audit_logs, daily_counters, rate_limit_buckets), SQL migrasi mentah (shim, RLS/GRANT, trigger, bucket), **kontrak Zod v1.1**, spesifikasi logika kritis (`createOrder`, `reserveStock`, `confirmPayment`, kode unik, hari bisnis), ADR-0003/0004/0005 |
| `DEMO_PACK_v1.1_Jaminan_Database.md` | Jaminan database | 12 jaminan (J-01..J-12: default-tutup klien, akses per outlet, Realtime sebagai pemicu, satu rumus ketersediaan, nominal unik, ledger append-only, status final tak bisa dibuka, konsistensi outlet, hari bisnis satu sumber, kode pesanan atomik, bucket privat, rate limit+idempotensi) + T-00 penjaga migrasi |
| `SPEK_TECH_STACK_DAN_SETUP.md` | Stack & setup | Keputusan stack (Node 22, pnpm, Next.js 16 App Router, Prisma 7, Supabase Auth/Realtime/Storage, Zod, TanStack Query, Vitest, Playwright), jalur tanpa-Docker, pemisahan lingkungan (local/test/dev/demo/production), CI/CD, kartu D-00/D-01, daftar verifikasi |
| `rekomendasi_arsitektur.md` | Opsi arsitektur pilot | Hybrid Node/VPS (provisional, untuk pilot); demo memakai Vercel+Supabase (Q-007 A); ADR-0003 ditunda |
| `AGENTS.md` | Aturan kerja AI | Peran/batas wewenang AI, alur tugas, arsitektur & aturan impor, struktur service, penamaan, ukuran kode, TS/validasi/error, DoD, testing, git/PR, templat laporan, penegakan otomatis |

### C. Riset / bukti validasi

| Berkas | Peran |
|---|---|
| `brainstorm-fnb-tahap0-bersih.txt` | Brainstorm Tahap 0 — sumber kebenaran keputusan terkunci (sebutan berulang di semua dokumen) |
| `Analisis_Kompetitor_AutoHabis_T1_Okt2026.md` | Analisis kompetitor (masukan T1) |
| `Desain_Validasi_T1_T2_T3_...Okt2026.md` | Desain instrumen validasi T1/T2/T3 |
| `Audit_Bukti_Market_Research_...Okt2026.md`, `Evidence_Audit_Research_Methodologist_...Okt2026.md`, `R1_Paket_Bukti_Gelombang3.md` | Audit bukti riset (gelombang 1-3) |
| `Executive_Summary_Revisi_Ketat_...Okt2026.md` | Ringkasan eksekutif revisi |
| `Technical-Feasibility-Study-FNB-WebApp-UMKM-Indonesia.md` | Studi kelayakan teknis |

Peran riset ini sudah dirangkum di `MVP.md` bagian 5 (register klaim & sumber, dengan label `[FAKTA]`/`[HIPOTESIS]`/`[BELUM TERVERIFIKASI]`) dan `01-prd-master.md` bagian 2 (M-1..M-9 dengan kekuatan bukti), sehingga tidak perlu dibuka penuh untuk penilaian kesiapan.

### D. Proses / pelacakan / templat

| Berkas | Peran | Status (dari `PROGRESS.md`) |
|---|---|---|
| `PROGRESS.md` (root & Baru) | Pelacak kemajuan P0-P14, DL, L1, F, SL, R + urutan eksekusi + log | P0 APPROVED; P1/P2/P3 DONE-MENUNGGU-REVIEW; **P5-P14, semua DL, semua L1/F/SL/R NOT-STARTED** |
| `OPEN-QUESTIONS.md` (root & Baru) | Pelacak pertanyaan Q-001..Q-029 | Root: Q-001..Q-025 DIJAWAB (Q-016=A). Baru: Q-001..Q-025 DIJAWAB (Q-016=B) + **Q-026..Q-029 TERBUKA** |
| `PROMPT_PACK_PRD_PER_FITUR.md` | Templat Pack 2: PRD per modul/fitur (L1, F-CUS/F-KAS/F-LOG, R-rollup) | Templat saja; keluaran NOT-STARTED |
| `PROMPT_PACK_PRD_USER_STORY.md` | Templat Pack 1: user story | Templat saja |
| `PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA.md` | Templat v2.1: Spesifikasi Logika Domain (DL) & Fitur (SL), skema ID (LR/US) | Templat saja; keluaran NOT-STARTED |

---

## 2. Perbandingan root vs "folder yang baru"

Subfolder berisi **revisi 7 Nov 2026** atas 5 berkas (01, 02, 03, OPEN-QUESTIONS, PROGRESS) yang menerapkan 25 keputusan manusia (Q-001..Q-025). Versi root adalah dokumen **6 Nov 2026 pra-revisi** untuk 01/02/03, tetapi `OPEN-QUESTIONS.md` dan `PROGRESS.md` di root sudah memuat keputusan 7 Nov. Akibatnya root berada dalam **campuran status**: tiga dokumen inti belum direvisi, dua dokumen pendukung sudah. Subfolder adalah kandidat pengganti yang konsisten secara internal.

### Yang berubah (Baru lebih lengkap/terkini)

- **`01-prd-master.md`**: header "Direvisi 7 Nov 2026"; §1 wedge jadi "disetujui manusia sebagai arah kerja provisional ... G0 belum lolos" (lebih jujur); tambah **M-9** (PBJT Malang 10% omzet ≥ Rp15 juta, Perda 1/2025); §2 kekosongan data diperbarui (R1 Gelombang 3 sudah ada); §6 SHOULD menambah "hanya `awaiting_verification`/`awaiting_cash`" (Q-020 A) dan "takeaway lewat QR outlet khusus" (Q-021 A); §8 A-1 jadi konkret (300 dtk, Hobby non-komersial, Supabase pause 1 minggu, tanpa backup); A-6/A-7/A-8 mencantum persetujuan; R-5/R-6 mencantum BR-120/BR-121; §11 DoDD beberapa item dicentang.
- **`02-actors...`**: 2.1 langkah 1 menambah QR takeaway khusus; 2.3 langkah 7 menambah logika duplikat Q-016 B; 2.5d perpanjangan kini atomik dengan reservasi (Q-001 A, Q-020 A); 2.5e batal saat `awaiting_verification` ditegaskan tidak boleh (Q-003 A); 2.6 langkah 4/6 menambah penolakan penurunan `opening` (Q-019 A) dan `manualSoldOut` tanpa reset harian; 2.9 langkah 3 customer boleh pakai foto sama (Q-016 B); matriks diperbarui (kasir lihat ledger read-only di `/kasir`; customer tanpa jumlah sisa).
- **`03-business-rules.md`**: tambah **§10A "Aturan tambahan dari keputusan 7 Nov 2026"** dengan **BR-120..BR-129** (perpanjangan atomik reservasi, blokir TRUNCATE, larangan batal saat verifikasi, `AMOUNT_INSUFFICIENT`, tanpa sisa porsi, kasir lihat ledger, tolak penurunan `opening`, `manualSoldOut` manual, takeaway lewat QR khusus, retensi bukti). BR-007/016/027/052/077/078/091/092/114 juga direvisi; §12.1 sandbox diperbaiki (tidak ada perpanjangan validator untuk `pending`); §14 celah diberi kolom Status.
- **`OPEN-QUESTIONS.md`**: Q-016 diubah ke **Opsi B**; tambah **Q-026..Q-029** (TERBUKA); catat Q-028/Q-029 menyentuh kontrak beku.
- **`PROGRESS.md`**: catatan P1/P2/P3 "direvisi 7 Nov"; log E tambah baris keputusan + Q-016 B + Q-026..Q-029.

### Kontradiksi (harus dituntaskan)

1. **Q-016 A vs B (paling penting):** root `OPEN-QUESTIONS.md` menulis Q-016 = **Opsi A**; subfolder = **Opsi B** ("diubah dari A ke B oleh manusia"). Root kini basahan. Konsekuensi menyebar: BR-052 (keunikan hash bukti), 02 §2.3/§2.9/§4, dan DoDD PRD semua berbeda antara root dan Baru. Penggantian harus sebagai **satu paket lengkap** (lima berkas sekaligus), bukan sebagian, karena penggantian sebagian menimbulkan kontradiksi Q-016 A/B.
2. **A-1 berlabel "[TERVERIFIKASI]" agak berlebih:** `SPEK_TECH_STACK_DAN_SETUP.md` §5/§7 butir 5-6 masih menandai batas cron Hobby, batas body, ToS komersial, dan interval workflow GitHub sebagai `[BELUM TERVERIFIKASI]`, padahal A-1 (Baru) berlabel `[TERVERIFIKASI 4 Nov 2026]`. Teks A-1 sendiri menyebut "konfirmasi manusia tetap diperlukan", jadi tidak fatal, tetapi label menyesatkan pembaca cepat.
3. **BR-016 "[BELUM PASTI]" (Baru):** BR-016 (Baru) menambah klausa "metode bayar boleh semua kecuali sandbox" yang ditandai "[BELUM PASTI: ... lihat Q-026]". Ini melanggar kontrak dokumen sendiri (header: "Semua pernyataan memakai 'harus'/'tidak boleh' dan **dapat diuji**"). Aturan yang belum pasti tidak dapat diuji. (Temuan ini juga ada di review sebelumnya.)

### Mana lebih lengkap?

**Subfolder lebih lengkap, terkini, dan konsisten secara internal.** Setelah tiga catatan di atas dituntaskan, subfolder layak menjadi sumber kebenaran. Penegakan: review sebelumnya (`.agents/tasks/review-folder-baru-2026-11-07/review.md`) memberi verdikt "APPROVE DENGAN CATATAN" untuk paket secara keseluruhan dan "REVISI WAJIB" untuk `03-business-rules.md` (satu poin BR-016). Saya konfirmasi temuan-temuan itu dari pembacaan langsung.

---

## 3. Kelengkapan artefak kebutuhan untuk masuk SDLC

| Artefak inti | Ada? | Cukup detail? | Bukti & catatan |
|---|---|---|---|
| Problem statement | Ya | Ya | `01-prd-master.md` §1-§2 (M-1..M-9 dengan label kekuatan bukti); `MVP.md` bagian G0 |
| Personas / aktor | Ya | Ya (dengan caveat) | `02-actors...` §1 (5 persona). **Caveat:** tanpa data primer — semua perilaku di luar sumber berlabel `[ASUMSI]`, divalidasi di T1/T2/T3 (Q-008); T2 belum dijalankan (G0 belum lolos) |
| User journeys | Ya | Ya | `02-actors...` §2 (9 perjalanan end-to-end dengan langkah/aktor/sistem/catatan/risiko) |
| Permissions / roles (RBAC/RLS) | Ya | Ya | `02-actors...` §3 matriks peran×kemampuan + daftar larangan customer; `Jaminan DB` J-01/J-02/J-11; `Amandemen` §3.2 RLS/GRANT. Seluruh matriks area 🔍 (wajib review manusia) |
| Business rules | Ya | Ya | `03-business-rules.md` ~97 BR yang dapat diuji ("harus"/"tidak boleh"), tabel transisi, TTL, batas, rate limit, rantai ketergantungan |
| MVP scope | Ya | Ya | `MVP.md` Fase 1 (44 fitur A/B/C dengan klasifikasi MVP/V2/V3 + milestone M0-M4) |
| **Acceptance criteria (per-fitur)** | **Belum** | **Tidak cukup** | AC tingkat demo ada (`01-prd` MT-1..MT-8; `MVP.md` skrip demo; `Jaminan DB` T-01..T-12). **AC per-fitur belum ada**: `P10` (demo scenario+acceptance), `L1-*`, `F-CUS/F-KAS/F-LOG-*`, `SL-*` semua NOT-STARTED (`PROGRESS.md`). Templat ada di prompt pack tapi keluaran belum dibuat |
| **Non-functional requirements** | **Sebagian, tersebar** | **Tidak cukup terkuantifikasi** | Tidak ada dokumen NFR; `P11 20-nfr.md` NOT-STARTED. Yang ada tersebar: performa di MT-2/MT-3/MT-4 (median detik), keamanan di J-01/J-02/J-11 + BR-100..BR-106, andal di J-04/J-07 + kedaluwarsa tiga lapis (BR-034/BR-035), rate limit di BR-102/§12.3 [HIPOTESIS]. Tidak ada target uptime, RPO/RTO, kapasitas konkurensi, atau angka kinerja produksi — namun ini **wajar untuk jalur demo** (bukan pilot/produksi) |
| Data model | Ya (draft) | Ya (draft, belum dibekukan) | `Amandemen` §2 Skema Prisma v1.1 (16 tabel lengkap) + §3 SQL migrasi; `Jaminan DB` J-01..J-12 + T-00. **Status:** "draft, menunggu review manusia"; dibekukan di M0 setelah persetujuan ("Definition of Demo Done" item 1) |
| Tech stack decision | Ya | Ya | `SPEK_TECH_STACK` keputusan satu-per-hal (Node 22, Next.js 16, Prisma 7, Supabase, Zod, TanStack Query, Vitest, Playwright); `AGENTS.md` stack header; `rekomendasi_arsitektur` opsi pilot |

**Kesimpulan kelengkapan:** 7 dari 10 artefak inti sudah lengkap dan ketat. Tiga yang belum: AC per-fitur, NFR terpisah, dan finalisasi data model (skema masih draft). Ketiganya sudah terjadwal di pipeline `PROGRESS.md` (P10/P11 dan M0), bukan celah tak terduga.

---

## 4. Kekosongan & blocker

### Kekosongan yang menahan (prioritas tinggi)

1. **NFR belum terdokumentasi terpisah/terkuantifikasi.** `P11 20-nfr.md` NOT-STARTED. Untuk jalur demo, target kinerja sudah implisit di MT-2 (≤180 dtk isi stok), MT-3 (median ≤60 dtk verifikasi), MT-4 (median ≤120 dtk pesan), MT-6 (13/13 jaminan hijau), dan toleransi konkurensi di MT-1/MT-7/MT-8. Tapi tidak ada pernyataan NFR eksplisit (skalabilitas, kapasitas, availabilitas/uptime, RPO/RTO, kompatibilitas perangkat, aksesibilitas). Untuk demo ini dapat diterima; untuk masuk SDLC formal, NFR minimal demo perlu ditulis di `20-nfr.md`.
2. **AC per-fitur belum ada.** `PROGRESS.md` menunjukkan `P10`, `L1-CUS/KAS/LOG`, `F-CUS-01..10`, `F-KAS-01..09`, `F-LOG-01..08`, `SL-*` semua NOT-STARTED. Templat siap (`PROMPT_PACK_PRD_PER_FITUR`, `PROMPT_PACK_v2.1_TAMBAHAN_LOGIKA` dengan skema ID `LR-`/`US-`), tapi keluaran belum dibuat. Tanpa AC per-fitur, traceability (`P12`) dan consistency review (`P13`) tidak bisa dimulai.
3. **Empat pertanyaan terbuka baru (Q-026..Q-029) belum dijawab** (`OPEN-QUESTIONS.md` Baru). Dua di antaranya menyentuh **kontrak beku** dan harus diselesaikan **sebelum** skema dibekukan di M0:
   - **Q-028** (mekanisme keunikan hash bukti setelah Q-016 B) — mengubah Skema, Jaminan DB, manifest T-00.
   - **Q-029** (dampak takeaway lewat QR khusus pada batas per meja + `tableToken` wajib) — mengubah `CreateOrderInput`.
   - Q-026 (metode bayar walk-in) dan Q-027 (kode error penurunan `opening` + pengingat HABIS) tidak menyentuh kontrak beku, tapi Q-026 menentukan isi BR-016 final.
4. **Kontradiksi dokumen root vs Baru belum dituntaskan** (Q-016 A vs B; status campuran root). Harus diputuskan: ganti root dengan Baru sebagai satu paket lengkap.

### Kekosongan yang dapat ditoleransi (jalur demo)

- **T1/T2/T3 belum dijalankan; G0 belum lolos** (`MVP.md`). Wedge disetujui "provisional" (7 Nov). Ini **sengaja** didisain sebagai gate sebelum Fase 8 (kode produk); demo boleh jalan paralel. Persona/metrik semua `[HIPOTESIS]` — sudah jujur diberi label dan tidak dipakai sebagai target pasar. Bukan blocker untuk SDLC demo, tapi persona valid T2 akan memperkuat kebutuhan.
- **Data pasar Malang kosong** (Q-008): pola bayar, frekuensi menu habis, perangkat, sinyal. Sudah diberi label `[HIPOTESIS]`, dijadikan bahan T2, bukan diisi tebakan.
- **Batas/ToS Vercel Hobby, cron, body, pg_cron** `[BELUM TERVERIFIKASI]` (`SPEK_TECH_STACK` §5/§7). Daftar verifikasi tersedia; ditugaskan ke manusia sebelum D-01.
- **Bunyi pasal PBJT di JDIH belum dicek** (M-9 menyebut "bunyi pasal belum dicek ke JDIH"). Demo memakai pajak 0 (BR-007), jadi tidak menahan.

---

## 5. Pertanyaan terbuka

Sumber: `OPEN-QUESTIONS.md` (Baru, terkini).

- **Q-001..Q-025: DIJAWAB** (semua, keputusan manusia 7 Nov 2026). Q-016 diubah dari A ke B. Tidak ada yang memblokir penulisan AC/NFR — keputusan sudah ada.
- **Q-026..Q-029: TERBUKA** (belum ada keputusan manusia):
  - **Q-026** metode bayar walk-in (teks Opsi A "semua kecuali sandbox" vs rekomendasi "tunai dan manual_qris") — menentukan BR-016 final. **Bukan kontrak beku**; bisa cepat.
  - **Q-027** kode error penurunan `opening` + pengingat HABIS manual (`STOCK_BELOW_COMMITTED`?). **Bukan kontrak beku**.
  - **Q-028** mekanisme keunikan hash bukti setelah Q-016 B — **mengubah kontrak beku** (Skema, Jaminan DB, manifest T-00). **Blocker sebelum M0**.
  - **Q-029** batas per meja takeaway + `tableToken` wajib — **mengubah kontrak beku** (`CreateOrderInput`). **Blocker sebelum M0**.
- **Pertanyaan yang hanya bisa dijawab T1-T3** (bukan keputusan desain, tapi data lapangan): apakah kompetitor gratis punya auto-habis (T1); apakah rumah makan menghitung porsi dan mau isi stok (T2/T3); seberapa sering menu habis & kapan bayar (T2). Ini menentukan G0, bukan SDLC demo.

**Ringkas: 0 pertanyaan memblokir penulisan AC/NFR. 2 pertanyaan (Q-028, Q-029) memblokir pembekuan skema di M0.**

---

## 6. Verdikt dan checklist prioritas

### Verdikt: HAMPIR SIAP

Justifikasi: fondasi kebutuhan (problem, persona, journey, izin, aturan bisnis, scope MVP, data model draft, tech stack, jaminan DB) sudah lengkap dan ketat — kualitas dokumentasi tinggi dengan pelabelan kejujuran (`[FAKTA]`/`[HIPOTESIS]`/`[ASUMSI]`/`[BELUM TERVERIFIKASI]`) yang konsisten. Yang tersisa adalah lapisan kebutuhan tingkat fitur (AC per-fitur, NFR terpisah) dan penuntasan keputusan terbuka pada kontrak beku. Semua sudah punya rencana di `PROGRESS.md`/prompt pack — bukan lubang tak terpikirkan.

### Checklist prioritas sebelum SDLC requirements formal (per-fitur) bisa ditulis

Urutan ditata dari yang membuka jalan terbanyak. Tandai [B] blocker, [S] harus-tapi-bukan-blocker.

1. **[B] Putuskan penggantian dokumen: adopsi subfolder "folder yang baru" sebagai satu paket lengkap (5 berkas sekaligus)** untuk menyelesaikan kontradiksi Q-016 A/B dan status campuran root. (`OPEN-QUESTIONS.md` root basahan pada Q-016.)
2. **[B] Jawab Q-028** (mekanisme keunikan hash bukti) — menentukan BR-052 final, kolom/jaminan baru, dan manifest T-00. Mengubah kontrak beku; perlu persetujuan manusia sebelum skema dibekukan di M0.
3. **[B] Jawab Q-029** (batas per meja takeaway + `tableToken` wajib) — menentukan BR-128 final dan `CreateOrderInput`. Mengubah kontrak beku; perlu persetujuan manusia sebelum M0.
4. **[S] Jawab Q-026** (metode bayar walk-in) lalu perbaiki BR-016 (hapus klausa "[BELUM PASTI]" dari tubuh aturan; pindahkan ketidakpastian ke Q-026 hingga diputuskan, atau tambahkan BR-130 definitif setelah keputusan). Ini juga REVISI WAJIB pada `03-business-rules.md` (melanggar janji "dapat diuji").
5. **[S] Jawab Q-027** (kode `STOCK_BELOW_COMMITTED` + pengingat HABIS manual) — melengkapi BR-126/BR-127. Bukan kontrak beku.
6. **[S] Bekukan Skema Prisma v1.1 dan Zod v1.1** (M0, setelah langkah 2-3) — syarat "Definition of Demo Done" item 1. Saat ini masih "draft, menunggu review manusia".
7. **[S] Tulis NFR demo** (`P11 20-nfr.md`): kuantifikasi minimal yang sudah tersebar — target kinerja (MT-2/3/4), kapasitas konkurensi (MT-1), batas rate (§12.3), keamanan (J-01/02/11), andal (kedaluwarsa tiga lapis), kompatibilitas (HP Android lama, data seluler). Tegaskan ini NFR demo (bukan produksi).
8. **[S] Tulis AC per-fitur** (`P10` + `L1-*` + `F-*` + `SL-*` mengikuti `PROGRESS.md` Bagian D urutan 2-6), memakai templat prompt pack. AC merujuk aturan logika via ID (LR/BR/J), tidak menyalin langkah (sesuai `PROMPT_PACK_v2.1`).
9. **[S] Verifikasi batas/ToS Vercel Hobby, cron, body, dan interval workflow GitHub** dari halaman resmi (`SPEK_TECH_STACK` §9 daftar) — sebelum D-01. Perbarui label A-1 agar konsisten (`[TERVERIFIKASI]` vs `[BELUM TERVERIFIKASI]`).
10. **[S] Jalankan T1/T2/T3 untuk G0** (dapat paralel dengan SDLC demo; instrumen sudah ada di `MVP.md`). Hasil memvalidasi wedge dan memperkuat persona sebelum pilot.

### Catatan penyempurnaan dokumen (opsional, dari review sebelumnya, dikonfirmasi)

- Tandai BR-052 dan BR-128 (Baru) dengan "⚠ Menunggu Q-028/Q-029 (kontrak beku); jangan implementasikan sebelum disetujui" agar implementer tidak menganggap final.
- Perluas BR-076 (urutan kunci global) untuk menyertakan baris reservasi, karena BR-120 kini memperbarui `expires_at` reservasi atomik dengan payment (profil deadlock, sudah ditandai 🔍 di 02 §2.5d).
- Konsistensi label A-1: `SPEK_TECH_STACK` masih `[BELUM TERVERIFIKASI]` untuk cron/body/ToS, namun A-1 (Baru) berlabel `[TERVERIFIKASI]`.

---

## Catatan kejujuran & batasan penyelidikan

- Tidak ada kode sumber di repo; semua klaim bersifat dokumen (status konsisten dengan `PROGRESS.md`: P0-P3 DONE-MENUNGGU-REVIEW, sisanya NOT-STARTED). Saya tidak menjalankan build/test karena tidak ada.
- `DEMO_PACK_v1.1_Amandemen.md` (39 KB) dan `MVP.md` (52 KB) dibaca selektif, bukan baris-demi-baris penuh; struktur, skema, Zod, logika kritis, dan bagian scope/G0/ADR sudah dicakup. Bila ada detail NFR tersembunyi di bagian yang tidak dihabiskan, itu tidak mengubah kesimpulan utama (NFR belum punya dokumen terpisah; `P11` NOT-STARTED di `PROGRESS.md` adalah sumber otoritatif untuk itu).
- Dokumen riset (7 berkas) hanya disampling perannya; tidak diperiksa isinya, karena `MVP.md` bagian 5 dan `01-prd-master.md` bagian 2 sudah merangkum klaim, sumber, dan label kekuatan bukti.
- Penilaian "HAMPIR SIAP" adalah untuk **jalur demo**. Jalur pilot/produksi (Fase 8+, terkunci hingga G0 lolos) memerlukan lebih: hasil T1/T2/T3, NFR produksi, ADR-0003 arsitektur, provider QRIS dinamis terverifikasi, dan retensi/penghapusan bukti (Q-024 "tentukan N sebelum pilot").
