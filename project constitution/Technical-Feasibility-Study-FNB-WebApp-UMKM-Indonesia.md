# Technical Feasibility Study  
**Web App F&B Multi-Modul untuk UMKM Indonesia**  
*(Customer QR Order + Kasir + Dapur + Logistik/Stok + Admin)*

**Tanggal dokumen** : 21 Oktober 2026  
**Status** : Draft untuk verifikasi stakeholder (Tahap 0 → Tahap 1)  
**Versi** : 1.0  
**Sumber data** : Analisis sekunder Oktober 2023 – Oktober 2026 + keputusan terkunci Tahap 0

---

## 1. Executive Summary

Proyek ini menilai kelayakan teknis pembangunan **satu aplikasi web multi-modul berbasis role** (Customer, Kasir, Dapur, Logistik, Admin) yang dihubungkan oleh entitas **Order** dan **Bill**, ditujukan khusus untuk UMKM F&B mikro di Indonesia (warung/rumah makan 1 outlet).

**Kesimpulan utama**:  
**Secara teknis feasible** dengan stack yang sudah dipilih (Next.js App Router + TypeScript + Tailwind + shadcn/ui + Supabase + Prisma + Zod + Vercel). Teknologi matang, proven di proyek sejenis di Indonesia, mendukung real-time, RBAC/RLS, mobile-first, dan online-only dengan fallback walk-in.  

Risiko teknis tertinggi terletak pada:  
- Konkurrensi stok (reservasi + TTL)  
- Integrasi PaymentProvider (QRIS dinamis sandbox + manual)  
- Performa RLS pada query stok/order yang sering  
- Adopsi input “stok porsi harian” oleh pemilik (risiko operasional, bukan teknis murni)

Wedge utama (“Menu otomatis HABIS berdasarkan stok porsi harian, naik bertahap ke Mode Resep”) secara teknis dapat diimplementasikan dengan satu ledger `stock_movement` append-only.  

**Rekomendasi**: Lanjutkan ke Tahap 1 (Scope MVP) sambil menjalankan T1 (teardown kompetitor) dan T2 (wawancara) secara paralel. Mode Resep tetap provisional.

---

## 2. Latar Belakang & Tujuan Studi

### 2.1 Konteks Produk (dari Tahap 0)
- Satu database, lima permukaan role, dihubungkan oleh Order + Bill.
- Target primer: **S1 – Warung/rumah makan mikro** (1 outlet, 2–6 orang, HP Android, QRIS statis, pemilik sering merangkap kasir).
- Dual payment timing: `pay_first` (default) dan `pay_after`.
- Stok bertahap: **Mode Porsi** (default) → **Mode Resep** (opsional).
- Online-only dengan fallback kasir walk-in.
- Stack terkunci: Next.js App Router, TypeScript, Tailwind, shadcn/ui, Supabase (Postgres + Realtime), Prisma, Zod, deploy Vercel.
- Kualitas target: production-grade (RBAC + RLS, validasi server-side, uang integer Rupiah, harga dihitung server, audit log, mobile-first, WCAG AA).

### 2.2 Tujuan Technical Feasibility Study
1. Menilai apakah stack dan arsitektur yang dipilih mampu memenuhi requirement fungsional & non-fungsional.
2. Mengidentifikasi risiko teknis kritis dan mitigasinya.
3. Mengonfirmasi bahwa solusi dapat dibangun oleh tim minimal 2 developer (dengan bantuan AI coding) dalam kerangka milestone yang dapat didemokan.
4. Menyediakan dasar keputusan go/no-go teknis sebelum masuk Scope MVP.

### 2.3 Ruang Lingkup Studi
**Termasuk**:  
- Kelayakan teknologi stack  
- Real-time order/status/stok  
- Keamanan (RBAC/RLS, rate limit endpoint publik)  
- Model data ledger stok & bill/payment  
- Integrasi pembayaran (abstraksi PaymentProvider)  
- Skalabilitas untuk 1 outlet (MVP) hingga beberapa outlet (V3)  
- Kesesuaian dengan kondisi UMKM Indonesia (konektivitas, perangkat Android lama, Bahasa Indonesia)

**Tidak termasuk** (akan dibahas di tahap lain atau butuh verifikasi primer):  
- Validasi wedge secara lapangan (T1/T2/T3)  
- Estimasi biaya detail & model bisnis  
- Legal/compliance penuh (pajak daerah, sertifikasi halal 2026)  
- Performance load-test aktual (hanya estimasi berdasarkan benchmark publik)

---

## 3. Ringkasan Validasi Masalah (Market & Operational Context)

Data sekunder 2023–2026 mendukung bahwa masalah yang ingin diselesaikan **nyata secara makro**, meski wedge spesifik masih memerlukan validasi primer.

| Hipotesis / Klaim | Status Bukti (Okt 2026) | Sumber Utama | Implikasi Teknis |
|-------------------|--------------------------|--------------|------------------|
| Pencatatan transaksi, stok, HPP masih manual di UMKM | **Kuat** | Business Fitness Index 2024 (OCBC + NielsenIQ): **77% UMKM masih mencatat keuangan manual** (dilaporkan Nov 2025). Data Kemenkop/UKM: ~58% masih konvensional. Studi kasus kuliner 2025–2026 menunjukkan kesalahan stok & inefisiensi. | Solusi harus **sangat ringan input**. Mode Porsi (1 angka per menu per hari) lebih feasible daripada Mode Resep sejak hari pertama. |
| Verifikasi pembayaran QRIS di kasir lambat & rawan penipuan | **Sedang–Kuat (kualitatif)** | Kasus 2025–2026: screenshot/editan bukti QRIS palsu (termasuk AI), stiker QRIS palsu ditempel, QRIS mengarah ke judol. Imbauan BI, ASPI, Polisi (Polres Bungo, Polda Metro). | Kasir harus verifikasi dari **notifikasi/mutasi**, bukan screenshot. Abstraksi PaymentProvider (ManualQris + SandboxGateway) wajib. |
| Order via QR meja mengurangi antrean & salah catat | **Lemah** | Hanya klaim pemasaran & karya mahasiswa. | Fitur tetap valuable, tetapi jangan dijadikan selling point utama tanpa data primer. |
| Warung menghitung ketersediaan dalam “porsi” | **Sedang (untuk HPP/produksi); belum untuk stok harian real-time** | Studi akademik rumah makan/warung: HPP dihitung per porsi; data penjualan sering dalam “jumlah porsi”. Pencatatan stok harian masih manual & tidak konsisten. | Mode Porsi secara teknis mudah; kesediaan pemilik mengisi setiap pagi harus diuji T2/T3. |
| MDR QRIS (berlaku 1 Okt 2026) | **Terkonfirmasi** | BI & bank (BCA, BTN, Sinarmas, dll.): 0% ≤ Rp100 rb semua kategori; UMI 0% ≤ Rp500 rb (di atas 0,3%); UKE/UME/UBE di atas Rp100 rb = 0,7%. MDR ditanggung merchant, dilarang dibebankan ke konsumen. | Aturan bisnis: **dilarang surcharge QRIS** ke customer. Harga integer Rupiah. |
| Kompetitor sudah punya multi-surface + self-order | **Ya, tetapi fitur lanjutan biasanya berbayar** | Qasir: Self Order + Resep di Pro/Pro Plus. Loyverse: composite/recipe di Advanced Inventory ($25/bln). Majoo, Kasir Pintar, Menuku, dll. memiliki variasi self-order & stok. | Wedge “auto-habis berbasis stok porsi harian yang sangat ringan + gratis di inti” disetujui sebagai arah kerja provisional; ruang diferensiasi belum terverifikasi (menunggu T1). |

**Paradoks kunci** (dari analisis DeepSeek + data sekunder):  
Infrastruktur pembayaran (QRIS) sudah masif (puluhan juta merchant, >90% UMKM), tetapi alat manajemen operasional (stok/HPP terintegrasi dengan order) masih tertinggal jauh. Ini memperkuat bahwa *wedge* harus berada di **penghubung Order ↔ Ketersediaan**, bukan di pembayaran murni.

**Catatan penting**: Data di atas adalah **proksi**. Ambang T2 (mis. ≥3 responden menghitung dalam porsi & mau mengisi stok harian) **belum terjawab** oleh data sekunder. T1–T3 tetap wajib.

---

## 4. Proposed Technical Solution

### 4.1 High-Level Architecture
- **Frontend**: Next.js App Router (React Server Components + Client Components), TypeScript, Tailwind CSS, shadcn/ui.  
  Rute berbasis role: `/m/{outlet}/{tableToken}` (customer), `/kasir`, `/dapur`, `/logistik`, `/admin`.
- **Backend / BaaS**: Supabase (Postgres + Auth + Realtime + Storage).  
  Prisma sebagai ORM + migrasi. Zod untuk validasi schema bersama (contract-first).
- **Deploy**: Vercel (edge + serverless functions).
- **Payment**: Abstraksi `PaymentProvider` dengan dua implementasi awal:
  - `ManualQris` (QRIS statis + verifikasi kasir dari mutasi)
  - `SandboxGateway` (untuk demo QRIS dinamis)
- **Realtime**: Supabase Realtime (Broadcast / Postgres Changes) untuk status order, stok porsi, notifikasi kasir/dapur.
- **Keamanan**: Supabase Auth + RLS di semua tabel sensitif + RBAC di aplikasi + rate limit endpoint publik + audit log.
- **Uang**: Integer Rupiah (tidak ada desimal). Semua perhitungan harga/diskon/total di server.

### 4.2 Core Domain Concepts (dari keputusan terkunci)
- **Bill** sebagai unit pembayaran (satu bill bisa berisi beberapa order di mode `pay_after`).
- **Order** selalu milik satu Bill.
- **Gerbang Dapur**: order dilepas ke dapur hanya jika `payment_timing = pay_after` **atau** `bill.status = paid`.
- **Satu Ledger Stok**: `stock_item` (tipe `portion` atau `ingredient`) + `stock_movement` append-only. Saldo adalah turunan.
- **Reservasi Stok** (Mode Porsi): stok direservasi saat order dibuat, dengan TTL pelepasan jika tidak dibayar (`pay_first`).
- **payment_timing** di-snapshot saat Bill dibuat.

### 4.3 Mode Stok
| Mode | Input Pemilik | Efek ke Customer | Ledger |
|------|---------------|------------------|--------|
| **Porsi** (default) | Isi stok porsi per menu per hari | Menu otomatis tidak bisa dipesan saat porsi = 0 | `stock_item` tipe portion + movement |
| **Resep** (opsional, provisional) | Link menu ke bahan + qty | Potong bahan; tampilkan HPP & margin; status stok (aman/menipis/habis) | Sama, tipe ingredient |

---

## 5. Technical Feasibility Assessment

### 5.1 Technology Maturity & Fit
| Komponen | Maturity | Fit untuk Use-Case | Catatan |
|----------|----------|--------------------|---------|
| Next.js App Router | Sangat tinggi (production di banyak POS & ordering Indonesia) | Sangat baik (SSR/SSG + RSC, mobile-first) | Banyak contoh: Cobakso, Foodya, Kasiran POS backoffice, self-order rumah makan, POS warung Next.js + Supabase. |
| Supabase (Postgres + Realtime + Auth + RLS) | Tinggi | Sangat baik untuk real-time order/status/stok 1-outlet | Benchmark publik: puluhan ribu concurrent connections, ratusan ribu msg/sec. RLS performance dapat di-tune dengan index + `(select auth.uid())`. |
| Prisma + Zod | Tinggi | Contract-first sangat cocok untuk parallel stream A/B | Schema bersama dibekukan dulu. |
| Vercel | Tinggi | Deploy sederhana, edge functions | Cocok MVP; monitor cold-start & bandwidth. |
| Payment abstraction | Sedang (tergantung provider) | Baik | Sandbox belum diverifikasi detail; ManualQris selalu tersedia sebagai fallback. |

**Kesimpulan teknologi**: Stack **proven dan sesuai**. Tidak ada teknologi bleeding-edge yang menjadi single point of failure.

### 5.2 Real-time & Concurrency
- Supabase Realtime mendukung Broadcast dan Postgres Changes dengan latency rendah (median single-digit ms pada skala sedang).
- Untuk 1 outlet: concurrent user sangat rendah (kasir + dapur + beberapa customer meja) → jauh di bawah limit plan.
- **Risiko kompetisi stok**: diatasi dengan reservasi + TTL + transaction isolation (Prisma/Supabase). Perlu careful design di Tahap 5 (ADR).

### 5.3 Security & Compliance Teknis
- RLS wajib di semua tabel (production checklist Supabase).
- Endpoint publik (`/m/...`) harus rate-limited + tableToken rotation + batas order belum bayar.
- Audit log untuk void/refund + otorisasi.
- Data sensitif (pembayaran) tidak disimpan di client.
- WCAG AA + Bahasa Indonesia + UI ringan untuk HP Android lama → achievable dengan Tailwind + shadcn yang dikustomisasi.

### 5.4 Scalability (MVP → V3)
- **MVP (1 outlet)**: Sangat feasible. Satu project Supabase cukup.
- **V2/V3 (multi-outlet)**: Schema sudah memuat `outlet_id`. Perlu perencanaan RLS per outlet + possibly connection pooling / read replica jika volume tinggi. Masih dalam kapasitas stack.

### 5.5 Operational Feasibility (Tim & AI)
- Tim minimal 2 developer + AI (Claude/DeepSeek konsultasi, Antigravity coding).
- Contract-first (Prisma + Zod) memungkinkan parallel Stream A (customer + kasir + bill/payment) dan Stream B (dapur + logistik + admin).
- Bagian yang **wajib review manusia**: RLS/RBAC, idempotensi + webhook pembayaran, migrasi DB, void/refund, konkurensi stok, rate limit.

### 5.6 Alternatives Considered
| Opsi | Kelebihan | Kekurangan | Alasan tidak dipilih |
|------|-----------|------------|----------------------|
| Full custom backend (Nest/Express + own WS) | Kontrol penuh | Biaya & waktu jauh lebih tinggi | Tim kecil, time-to-demo penting |
| Firebase | Real-time kuat | Pricing kurang prediktabel, RLS lebih lemah dibanding Postgres | Supabase lebih cocok untuk relational + RLS kuat |
| Offline-first (local-first DB) | Tahan putus internet | Kompleksitas sinkronisasi multi-device sangat tinggi | Keputusan online-only + fallback walk-in sudah terkunci |

---

## 6. Key Technical Risks & Mitigations

| Risiko | Likelihood | Impact | Mitigasi |
|--------|------------|--------|----------|
| Oversell stok saat concurrent order | Sedang | Tinggi | Reservasi stok + TTL + DB transaction + optimistic locking / advisory lock |
| RLS performance degradation | Rendah–Sedang | Sedang | Index pada kolom RLS, gunakan `(select auth.uid())`, monitor `pg_stat_statements`, test query kritis |
| Integrasi gateway QRIS dinamis gagal / mahal | Sedang | Sedang | Abstraksi PaymentProvider; ManualQris selalu tersedia; sandbox dulu |
| Pemilik tidak mau isi stok porsi setiap pagi | Tinggi (operasional) | Tinggi (wedge gagal) | T3 prototipe klik + fitur “salin stok kemarin”; Mode Porsi tetap opsional |
| Putus internet outlet | Tinggi di lapangan | Tinggi | Online-only diterima; fallback kasir buat order walk-in; mode “catat belakangan” kandidat V2 |
| Cold start / latency Vercel + Supabase | Rendah | Rendah–Sedang | Keep-alive, edge caching untuk menu statis, monitor |

---

## 7. Resource & Skill Requirements

- **Tim inti**: Minimal 2 full-stack developer (TypeScript/React + Postgres familiarity).
- **Keahlian kritis yang harus ada / di-review manusia**:
  - Penulisan & testing RLS policies
  - Desain idempotency key + payment webhook
  - Concurrent stock reservation
  - Audit log & authorization flow (void/refund)
- **AI assistance**: Sangat efektif untuk CRUD, UI komponen, Zod schema, unit/integration test berdasarkan acceptance criteria.
- **Infrastructure**: Supabase Pro (atau setara) untuk production; Vercel Pro jika traffic naik.
- **Tidak diperlukan**: Hardware khusus, printer/KDS di MVP (opsional flag dapur).

---

## 8. High-Level Implementation Approach (Milestone-Oriented)

Sesuai keputusan Tahap 0:
1. **Bekukan contract** (Prisma schema + Zod) terlebih dahulu.
2. Parallel streams:
   - **Stream A**: Customer surface + Kasir + Bill/Payment + PaymentProvider
   - **Stream B**: Dapur + Logistik/Stok (Mode Porsi) + Admin
3. Setiap milestone harus **demo-able** secara mandiri.
4. Human review gate pada area berisiko tinggi sebelum merge ke main.

Detail backlog dan estimasi akan disusun di Tahap 7 setelah Scope MVP dikunci.

---

## 9. Conclusions & Recommendations

### 9.1 Technical Feasibility Verdict
**FEASIBLE** dengan tingkat keyakinan tinggi untuk MVP (1 outlet, Mode Porsi, dual payment timing, online-only).

Stack yang dipilih mature, memiliki banyak referensi implementasi serupa di Indonesia (Next.js + Supabase untuk POS/stok/order), dan secara arsitektur mendukung requirement real-time, keamanan, dan skalabilitas bertahap.

### 9.2 Critical Path & Dependencies
- **Harus dilakukan segera (paralel)**: T1 (teardown kompetitor – fokus auto-habis & self-order tier) dan T2 (wawancara 4–7 pelaku S1).
- Mode Resep tetap **provisional** agar tidak merusak arsitektur jika diturunkan ke V2.
- Sandbox PaymentProvider & provider konkret diputuskan di Tahap 5.

### 9.3 Go / No-Go Teknis
**GO** untuk melanjutkan ke Tahap 1 (Scope MVP / V2 / V3) dengan catatan:
- Hasil T1/T2 dapat mengubah prioritas fitur atau bahkan wedge.
- Risiko operasional (kesediaan isi stok porsi) lebih tinggi daripada risiko teknis murni.

### 9.4 Next Steps
1. Stakeholder mereview & menyetujui dokumen ini.
2. Jalankan T1 + T2.
3. Setelah “lanjut”, masuk Tahap 1 Scope dengan Mode Resep ditandai provisional.
4. Lanjutkan paralel ke Tahap 2–7 sesuai rencana asli.

---

## 10. Referensi & Sumber

### Validasi Masalah & Pasar
- Business Fitness Index 2024 (OCBC + NielsenIQ) – 77% UMKM masih pencatatan keuangan manual (dilaporkan Nov 2025).
- Data digitalisasi UMKM Kemenkop/UKM & BPS 2024–2025 (~25–39% digitalisasi, mayoritas masih mikro).
- Kebijakan MDR QRIS BI berlaku 1 Oktober 2026 (dikonfirmasi bank: BCA, BTN, Sinarmas, dll.).
- Laporan kasus penipuan QRIS 2025–2026 (BI, ASPI, Polres, media).
- Studi akademik & pengabdian masyarakat UMKM kuliner/warung 2024–2026 (HPP per porsi, pencatatan manual).

### Kompetitor (fitur yang terverifikasi dari sumber publik)
- Qasir (Self Order + Resep di tier Pro).
- Loyverse (composite item / Advanced Inventory berbayar).
- Majoo, Kasir Pintar, Menuku, dll. (self-order & stok bervariasi).

### Teknologi
- Supabase Docs: Realtime Benchmarks, Limits, RLS Performance, Production Checklist (2026).
- Contoh implementasi Indonesia: proyek Next.js + Supabase / Next.js POS & self-order (Cobakso, Foodya, Kasiran, POS warung, self-order rumah makan, dll.).

### Dokumen Internal
- Brainstorm Web App F&B Multi-Modul – Tahap 0 (Validasi) + Keputusan Terkunci, 20 Oktober 2026.

---

**Dokumen ini bersifat draft teknis.**  
Semua angka ambang T2, klaim kompetitor yang belum di-trial langsung, dan kesediaan pemilik mengisi stok porsi **memerlukan verifikasi primer** sebelum dianggap final.  

Silakan review, koreksi, atau minta penambahan bagian tertentu.  
Setelah disetujui, dokumen ini dapat menjadi lampiran keputusan go teknis menuju Tahap 1.
