# REKOMENDASI OPTIMASI ARSITEKTUR BACKEND (HYBRID APPROACH)
**Proyek:** Web App F&B Multi-Modul untuk UMKM Indonesia  
**Tanggal:** 21 Oktober 2026 · Diperbarui: 7 Nov 2026  
**Status:** Opsi untuk Pilot (provisional; demo Vercel + Supabase, Node/VPS ditunda ke ADR-0003)  

---

## 1. Analisis Batasan Vercel Hobby Tier (Gratis)
Berdasarkan dokumentasi resmi Vercel per 2026, penggunaan **Vercel Hobby Tier** untuk backend produksi operasional F&B memiliki risiko tinggi karena batasan teknis dan legal berikut:
1. **Batas Durasi Fungsi:** Dokumentasi Vercel Hobby menyebut durasi maksimum fungsi 300 detik [TERVERIFIKASI 4 Nov 2026]. Risiko durasi rendah. Risiko latensi lintas-region tetap ada.
2. **Masalah Cold Start:** Fungsi yang jarang diakses (misal saat warung sepi di antara jam makan) akan mengalami *delay* respons beberapa detik saat pertama kali dipicu kembali, yang akan mengganggu efisiensi kerja kasir dan dapur.
3. **Larangan Komersial (Fair Use Policy):** Vercel Hobby Tier **dilarang untuk penggunaan komersial** (operasional bisnis nyata). Hobby boleh untuk demo atau prototipe; pilot nyata wajib Pro Tier ($20/bulan per anggota tim) atau hosting lain.

---

## 2. Opsi untuk Pilot: Arsitektur Hybrid (Semi-Microservice)

> **Catatan (7 Nov 2026):** Ini **opsi untuk pilot**, bukan solusi terkunci. Demo memakai Vercel + Supabase (Q-007, opsi A). Keputusan Node.js di VPS ditulis sebagai **ADR-0003** saat pilot direncanakan.

Untuk menghindari batasan Vercel Pro yang mahal namun tetap menjaga efisiensi biaya UMKM, arsitektur dioptimalkan menjadi **Hybrid Backend**: menggabungkan keunggulan **Node.js (Express/Fastify)** yang dipasang di VPS murah (mulai dari Rp50.000/bulan) sebagai penanggung jawab logika kritis, dengan **Supabase (BaaS)** sebagai database utamanya.

### Mengapa Node.js, Bukan Laravel?
Sesuai dengan keputusan *Contract-First* pada Master Prompt (Prisma + Zod + TypeScript), **Node.js adalah pasangan hybrid yang paling mutlak**:
* **Satu Ekosistem Bahasa (TypeScript Cohesion):** Node.js dapat langsung membaca skema `Prisma` dan `Zod` yang sudah dibekukan tanpa perlu menulis ulang kode validasi ke bahasa lain (seperti PHP pada Laravel).
* **Hemat Memori & Event-Driven:** Node.js berjalan secara *asynchronous* bawaan, sangat ringan di VPS berspesifikasi rendah, dan andal dalam menangani *high concurrency* (banyak request masuk bersamaan dari meja pelanggan).

---

## 3. Pembagian Beban Kerja Berdasarkan Karakteristik Halaman

```
                      [ USER / FRONTEND (Next.js) ]
                                   │
         ┌─────────────────────────┴────────────────────────┐
         ▼                                                  ▼
[ SERVICE A: Node.js (Express/Fastify) ]          [ SERVICE B: Supabase (BaaS) ]
 Lokasi: VPS (Selalu Aktif, No Cold Start)          Lokasi: Cloud Postgres
 ───────────────────────────────────────          ──────────────────────────────
 ▸ Modul Kasir (/kasir)                           ▸ Modul Customer (/m/..) - Ringan
 ▸ Modul Dapur (/dapur) - Proses Instan            ▸ Validasi Keamanan via Row-Level Security
 ▸ Kalkulasi Keuangan Bisnis & HPP                 ▸ Penyimpanan Ledger Stok Append-Only
 ▸ Webhook & Idempotensi Payment Gateway           ▸ Autentikasi Pengguna & Sesi Token Meja
```

### Detail Implementasi per Modul:

1. **Permukaan Pelanggan (`/m/{outlet}/{tableToken}`) -> Supabase & Vercel**
   * **Karakteristik:** *High traffic* saat jam makan, namun operasinya sangat ringan (hanya membaca menu dan membuat draf order).
   * **Optimasi:** Halaman menu statis di-render lewat Vercel (instan dibuka di HP Android lama). Validasi pembatasan order dikunci langsung di database menggunakan **Supabase Row-Level Security (RLS)**. Aman di tier gratis karena eksekusinya di bawah 1 detik.

2. **Permukaan Kasir (`/kasir`) & Dapur (`/dapur`) -> Node.js (VPS)**
   * **Karakteristik:** Transaksional kritis, membutuhkan stabilitas tinggi, dan harus bebas dari *cold start*.
   * **Optimasi:** Logika sensitif seperti otorisasi *void/refund*, penguncian stok (*concurrency lock*) agar tidak terjadi *oversell*, dan verifikasi pembayaran mutasi ditangani oleh Node.js yang selalu aktif di VPS.

3. **Permukaan Admin & Logistik (`/admin`, `/logistik`) -> Node.js (VPS)**
   * **Karakteristik:** Operasi berat berbasis CPU (*CPU-bound*) dengan durasi proses yang panjang.
   * **Optimasi:** Menghitung total transaksi dari ratusan ribu baris ledger *append-only* untuk menghasilkan laporan keuangan/HPP bulanan diproses di VPS, sehingga terhindar dari interupsi batas durasi fungsi Vercel.

---

## 4. Matriks Evaluasi Infrastruktur Akhir

| Komponen Infrastruktur | Batasan Tier Gratis | Status untuk Aplikasi UMKM F&B | Strategi Mitigasi / Hybrid |
| :--- | :--- | :--- | :--- |
| **Vercel Functions** | Maksimal **300 detik** per request [TERVERIFIKASI 4 Nov 2026] | **Risiko rendah** (durasi); latensi lintas-region tetap ada | Cukup untuk demo; backend transaksional kritis pindah ke Node.js di VPS saat pilot. |
| **Vercel Commercial Policy** | Dilarang untuk bisnis komersial | **Melanggar Aturan** jika dipakai di toko riil | Cukup untuk demo/staging; pilot nyata wajib Pro atau hosting lain (Frontend di VPS). |
| **Supabase Postgres** | **500 MB** storage; project **pause setelah 1 minggu tanpa aktivitas**; maksimal **2 project aktif**; **tanpa backup** | **Cukup untuk demo/prototipe** (menampung jutaan baris data teks transaksi) | Cukup untuk demo/prototipe; pilot nyata wajib paket berbayar (backup dan uptime) atau hosting lain. |
| **Node.js di VPS** | Tergantung spesifikasi VPS | **Sangat Stabil** (Sistem *always-on*, tanpa cold-start) | Gunakan VPS lokal murah (~Rp50rb-100rb/bln) sudah sangat mumpuni. |

---

## 5. Kesimpulan Rekomendasi Teknis
Kombinasi **Next.js (Frontend) + Node.js Express/Fastify (API Kritis di VPS) + Supabase (Database)** adalah **opsi untuk pilot** (bukan solusi terkunci). Demo memakai Vercel + Supabase (Q-007, opsi A). Keputusan memakai Node.js di VPS untuk pilot ditulis sebagai **ADR-0003** saat pilot direncanakan.

---
