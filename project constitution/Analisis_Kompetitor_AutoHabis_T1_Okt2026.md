# Analisis Kompetitor SaaS F&B UMKM  
## Fokus: Auto-Habis / Sold-Out & Validitas Wedge Mode Porsi  
**Tanggal**: 21 Oktober 2026  
**Status**: Audit berdasarkan data sekunder (website, Play Store, panduan resmi, blog, help center). **Belum ada trial akun**.  
**Auditor**: Analis Kompetitor Produk SaaS F&B UMKM

---

## 1. Definisi Operasional yang Digunakan

**Auto-habis (definisi ketat untuk wedge produk)**:  
Fitur yang memungkinkan:
1. Input stok berbasis **porsi harian** (atau unit yang sangat ringan, bukan resep bahan baku penuh), dan  
2. Ketika porsi/stok mencapai 0 → item **otomatis disable / tidak bisa dipesan** di halaman customer (self-order / QR meja), bukan hanya notifikasi ke kasir atau filter di layar kasir.

**Auto-habis (definisi longgar / yang umum di pasar)**:  
- Notifikasi stok minimum / stok habis ke pemilik/kasir.  
- Blok penjualan di POS ketika stok = 0.  
- Filter “hanya tampilkan yang tersedia” di layar kasir.  
- Manual “tandai habis” yang kemudian sync ke channel lain (termasuk delivery apps).  
- Auto-mark Out of Stock di platform delivery (GrabFood, GoFood, dll.) berdasarkan kondisi order tertentu.

**Catatan kritis**: Wedge produk mengandalkan definisi **ketat**. Data sekunder saat ini hanya mendukung keberadaan definisi **longgar** di beberapa pemain. Tidak ada bukti publik yang cukup untuk menyatakan definisi ketat sudah dominan di segmen warung mikro.

---

## 2. Audit Tabel Kompetitor (Revisi Lengkap)

| Pemain | Self-Order / QR Meja | Auto-Habis (status saat ini) | Resep / Bahan Baku | Harga Efektif 1 Outlet Mikro (indikasi publik) | Status Verifikasi | Catatan / Asumsi |
|--------|----------------------|------------------------------|--------------------|-----------------------------------------------|-------------------|------------------|
| **Qasir** | Ada (Self Order) – tier Pro | Inventori + riwayat stok. Notifikasi terkait stok. **Belum terverifikasi** apakah auto-disable di halaman customer self-order berbasis porsi. | Resep & bahan baku (Pro) | Pro / Pro Plus: ratusan ribu – ~Rp 1,2 jt/tahun (indikasi situs) | **Website + Play Store only** | Fitur lanjutan berbayar. Tidak ditemukan deskripsi “porsi harian → auto-sold-out customer”. |
| **Loyverse** | Tidak ada bukti kuat QR self-order customer-facing | Inventori dasar gratis + low-stock notification. Advanced Inventory berbayar. Stok tampil di POS. **Belum terverifikasi** auto-disable di customer page. | Composite item + produksi | Advanced Inventory ≈ USD 25/bulan per toko | **Website only** | Self-order lemah. Auto-habis lebih ke notifikasi & tracking. |
| **Majoo** | Self-order + QR E-menu + KDS (paket tertentu) | **Notifikasi stok minimum/habis/minus** + **Limitasi Stok Keluar** (bisa blok penjualan POS & invoice saat stok = 0). Sinkron stok multi-channel. **Belum terverifikasi** apakah auto-disable otomatis di halaman customer self-order, dan apakah input berbasis porsi harian. | Ada (resep, COGS, produksi stok) | Mulai ratusan ribu/bulan (paket Advance/Prime) | **Website + panduan resmi** | Kandidat terdekat. Limitasi stok = bentuk auto-habis di sisi kasir. Perlu uji apakah berlaku di customer-facing. |
| **Kasir Pintar** | QR Order / QR Meja | Filter “Tersedia” (sembunyikan stok 0 di layar kasir). Notifikasi minimum stok. Mode stok tracking (fisik vs booking). **Belum terverifikasi** auto-disable di halaman customer. | Plugin bahan baku | Versi berbayar lebih lengkap (harga publik belum detail) | **Website / Help Center** | Filter “Tersedia” membantu kasir, bukan otomatis di sisi pelanggan. |
| **Menuku** | Klaim QR self-order + sinkron real-time | **Belum terverifikasi** | — | Klaim tanpa langganan bulanan (skala tidak jelas) | **Website only** | Data terlalu tipis untuk dinilai. |
| **Moka POS** | Contactless Order / Moka Order (dine-in, pick-up, delivery) | Inventory real-time (stok berkurang otomatis saat transaksi). Laporan stok. **Belum terverifikasi** auto-disable di customer-facing page atau input berbasis porsi. | Manajemen stok & bahan (terbatas di data publik) | Basic ~Rp 299.000/outlet/bulan; Pro ~Rp 499.000/outlet/bulan (indikasi 2026) | **Website only** | Kuat di integrasi GoFood & multi-outlet. Harga di atas kenyamanan warung mikro murni. |
| **Labamu** | QR Menu + Order Management | Manajemen ingredients + stok. Klaim cek ketersediaan saat terima order. **Belum terverifikasi** auto-disable customer page berbasis porsi. | Ingredients management | Belum terverifikasi detail harga publik untuk 1 outlet mikro | **Website only** | Fokus multi-bisnis (F&B + retail + manufaktur). Skala lebih besar. |
| **Runchise / ESB** | POS + online delivery integration | Stock opname, waste, production, ingredient (sering add-on). Klaim update menu. **Belum terverifikasi** auto-habis berbasis porsi di customer page. | Ingredient + production (lengkap di tier tertentu) | Bervariasi; sering paket berbayar / add-on | **Website only** | Lebih cocok multi-outlet / franchise. Bukan fokus utama S1. |
| **GrabFood / GoFood (platform)** | Merchant app + portal | **Manual & bulk “Out of Stock”** + **auto-mark OOS** (untuk merchant API pada kondisi order tertentu: cancelled karena unavailable, single item, dll.). | Tidak relevan (bukan POS penuh) | Gratis (bagian dari platform delivery) | **Help Center resmi (terverifikasi)** | Ancaman tidak langsung: merchant sudah terbiasa “tandai habis” di channel delivery. Bisa mengurangi perceived need untuk auto-habis di self-order internal. |

**Sumber data**: Situs resmi, Play Store, blog produk, panduan pengguna, dan Help Center platform hingga Oktober 2026. **Tidak ada akun trial yang dijalankan.**

---

## 3. Apakah Klaim “Wedge Kosong” Bisa Dipertahankan?

**Jawaban tegas: Tidak.**

- Data sekunder menunjukkan bahwa **bentuk auto-habis longgar** (notifikasi + blok penjualan di POS + filter stok 0 + manual/auto OOS di delivery apps) **sudah ada** di Majoo (terdokumentasi jelas), Moka, Kasir Pintar, dan platform Grab/GoFood.  
- Tidak ditemukan bukti publik yang kuat untuk **Mode Porsi harian ringan + auto-disable di halaman customer** sebagai fitur default/gratis yang dominan di segmen warung mikro.  
- Karena belum ada trial, klaim “wedge kosong” **tidak dapat dipertahankan**.  

**Klaim yang sah**:  
> “Belum terverifikasi. Terdapat kandidat (terutama Majoo, diikuti Qasir dan Moka) yang memiliki mekanisme auto-habis di sisi kasir atau channel delivery. T1 wajib untuk menguji apakah mekanisme tersebut mencakup halaman customer self-order dan apakah inputnya seringan Mode Porsi.”

**Status klaim**: **Asumsi** → harus diganti menjadi “belum terverifikasi; kandidat harus diuji”.

---

## 4. Analisis Ancaman dari Pemain Besar & Platform

Meskipun tidak ada yang terbukti identik dengan Mode Porsi (definisi ketat), beberapa pemain besar memiliki keunggulan struktural yang dapat menyulitkan adopsi produk baru di segmen mikro:

| Pemain / Platform | Keunggulan Utama | Bagaimana Bisa Menyulitkan | Cara Melawan dengan Aset yang Ada (Hipotesis) |
|-------------------|------------------|----------------------------|-----------------------------------------------|
| **Majoo** | Fitur lengkap (self-order, KDS, inventori, Limitasi Stok), ekosistem berlangganan, brand recognition di F&B | Merchant yang sudah bayar paket Prime cenderung stickiness tinggi; Limitasi Stok sudah menutup sebagian pain oversell di sisi kasir | Diferensiasi pada **friction input ekstrem rendah** (Mode Porsi 1–2 menit pagi) + **inti gratis** untuk 1 outlet + fokus pure warung mikro (bukan multi-outlet) |
| **Moka POS** | Integrasi kuat dengan GoFood, inventory real-time, brand Gojek ecosystem, harga transparan | Merchant yang sudah pakai Moka untuk delivery + kasir jarang ganti; stok sync otomatis mengurangi kebutuhan tool terpisah | Fokus pada warung yang **belum** pakai POS berbayar (masih manual) + no-surcharge QRIS + verifikasi pembayaran yang lebih aman |
| **GrabFood / GoFood** | Auto/manual mark Out of Stock di channel delivery (gratis), volume order tinggi, habit merchant sudah terbentuk | Merchant terbiasa “tandai habis” hanya di delivery; perceived need untuk auto-habis di dine-in/self-order internal bisa rendah | Tekankan pain **oversell di meja / QR meja** (bukan delivery) + kontrol ketersediaan real-time untuk pelanggan yang datang langsung |
| **Qasir** | Self-order sudah ada, harga relatif terjangkau di tier Pro, basis pengguna UMKM besar | Jika self-order + stok sudah “cukup baik”, switching cost tinggi | Mode Porsi sebagai **default gratis** + pengalaman customer page yang lebih ringan & stabil di koneksi buruk |
| **Labamu / Runchise** | Skala (puluhan ribu bisnis), fitur ingredients & multi-channel | Lebih menyerang segmen yang sudah tumbuh (bukan pure mikro) | Abaikan head-on; fokus S1 yang belum terlayani dengan baik oleh solusi “lengkap tapi mahal/kompleks” |

**Kesimpulan ancaman**: Ancaman terbesar bukan “fitur identik”, melainkan **habit + switching cost** dari merchant yang sudah memakai POS berbayar atau platform delivery. Peluang terbesar tetap di segmen warung mikro yang masih 100% manual atau hanya pakai QRIS statis + buku catatan.

---

## 5. Kandidat yang Harus Diuji di T1 (Urutan Prioritas)

1. **Majoo** (prioritas tertinggi) – dokumentasi Limitasi Stok Keluar sudah eksplisit.  
2. **Qasir Pro / Pro Plus** – self-order ada; perlu cek perilaku stok = 0 di self-order.  
3. **Moka POS** (Basic atau Pro) – inventory real-time + Contactless Order; cek auto-disable.  
4. **Kasir Pintar** – filter “Tersedia” + QR Order.  
5. **Loyverse Advanced Inventory** (opsional, sebagai kontrol internasional yang ringan).  
6. **1 kandidat tambahan** (Labamu atau Runchise) jika waktu memungkinkan.

Menuku tetap dimonitor, prioritas rendah karena data publik terlalu tipis.

---

## 6. Rekomendasi Desain Teardown T1

### Tujuan T1
Menentukan apakah wedge “Mode Porsi → auto-habis di customer page” masih memiliki ruang diferensiasi yang berarti, atau sudah cukup tertutup oleh kompetitor di harga yang relevan untuk 1 outlet mikro.

### Skenario Uji (wajib dilakukan berurutan)

| No | Skenario | Yang Diamati |
|----|----------|--------------|
| 1 | Setup menu + stok awal (input stok biasa vs resep) | Friction input, apakah ada opsi “porsi harian” atau unit setara |
| 2 | Set stok item = 0 (atau di bawah minimum) | Apakah item otomatis hilang / disable di **halaman customer self-order / QR**? Atau hanya di layar kasir? |
| 3 | Manual “tandai habis” / sold-out (jika ada) | Apakah status sync ke self-order, online ordering, dan channel lain? |
| 4 | Self-order aktif + stok berubah real-time | Latency update di sisi pelanggan |
| 5 | Cek harga efektif | Biaya bulanan/tahunan untuk 1 outlet agar fitur self-order + stok + (jika ada) auto-habis aktif |
| 6 | Bandingkan dengan platform delivery | Apakah merchant yang pakai Grab/GoFood sudah merasa “cukup” dengan mark OOS di app merchant? |

### Metrik

- Ada/tidak fitur auto-disable di **customer-facing page** ketika stok = 0.  
- Unit input stok: porsi / pcs / resep bahan baku / lainnya.  
- Jumlah langkah & waktu untuk set stok harian (proxy friction Mode Porsi).  
- Harga efektif 1 outlet (setelah trial / harga publik terbaru).  
- Apakah fitur tersedia di tier yang realistis untuk warung mikro (ARPU rendah).  
- Persepsi “sudah cukup” dari merchant yang sudah pakai platform delivery.

### Go / No-Go Criteria

| Hasil T1 | Keputusan |
|----------|-----------|
| ≥ 2 kompetitor utama sudah punya **auto-disable di customer page** + input stok yang relatif ringan, di harga ≤ Rp 300–500 rb/bulan (atau setara) | Wedge Mode Porsi **melemah signifikan**. Pertimbangkan diferensiasi lain (kemudahan ekstrem, gratis inti, atau fokus verifikasi QRIS). |
| Hanya ada blok di sisi kasir / notifikasi, **tidak** auto-disable di customer page, atau hanya di tier sangat mahal | Wedge masih memiliki ruang. Lanjutkan validasi T2 (kesediaan input harian). |
| Ditemukan fitur yang sangat mirip Mode Porsi (input porsi harian → auto-sold-out customer) di tier terjangkau | Wedge **gagal**. Pivot atau cari sudut diferensiasi baru. |
| Data tidak konklusif (fitur ada tapi perilaku tidak stabil / tidak terdokumentasi) | Ulangi uji atau perluas sample; jangan putuskan MVP. |

**Aturan ketat**: Keputusan go/no-go **hanya** setelah minimal 3 trial akun selesai dan didokumentasikan (screenshot + catatan perilaku).

---

## 7. Yang Masih Asumsi (Harus Ditandai Jelas)

| Klaim / Pernyataan | Status | Alasan | Keputusan Auditor |
|--------------------|--------|--------|-------------------|
| Kompetitor “belum punya” auto-habis berbasis porsi (definisi ketat) | **Asumsi** | Hanya berdasarkan data publik. Belum trial. | Wajib label “belum terverifikasi” sampai T1 selesai. |
| Mode Porsi lebih ringan & lebih natural bagi pemilik warung mikro | **Asumsi** | Belum diuji kesediaan input harian (T2). | Jangan jadikan benefit utama di komunikasi eksternal. |
| Harga kompetitor “terlalu mahal” untuk S1 | **Asumsi parsial** | Harga publik ada, tetapi harga efektif setelah trial + kebutuhan fitur belum diukur. | Gunakan angka publik hanya sebagai indikasi; verifikasi di T1. |
| Auto-habis di customer page adalah pain point yang cukup kuat | **Asumsi** | Belum ada data frekuensi oversell dari T2. | Prioritaskan pertanyaan frekuensi oversell di T2. |
| Limitasi Stok Majoo berlaku juga di self-order customer | **Asumsi** | Dokumentasi menyebut blok di POS & invoice; perilaku di QR/self-order belum terverifikasi. | Uji langsung di T1 skenario 2. |
| Merchant yang sudah pakai Grab/GoFood merasa “cukup” dengan mark OOS di app merchant | **Asumsi** | Help Center menunjukkan fitur ada, tetapi tidak ada data perceived sufficiency. | Tambahkan pertanyaan di T2 tentang kebiasaan mark OOS di delivery vs dine-in. |

**Keputusan independen auditor** (berdasarkan kebutuhan kejelasan konteks):  
Semua pernyataan di tabel di atas **wajib** diberi label “belum terverifikasi / asumsi” di dokumen internal sampai T1 + T2 selesai. Tidak boleh digunakan sebagai landasan keputusan scope MVP.

---

## 8. Rekomendasi Akhir

1. **Hapus** semua formulasi “wedge kosong” dari dokumen internal dan eksternal. Ganti dengan:  
   > “Belum terverifikasi. Terdapat kandidat (terutama Majoo, Moka, Qasir) dengan mekanisme auto-habis di sisi kasir atau channel delivery. T1 wajib untuk menguji cakupan ke customer page dan kesamaan dengan Mode Porsi.”

2. Jalankan T1 segera dengan prioritas: **Majoo → Qasir → Moka → Kasir Pintar**.

3. Hasil T1 menjadi input wajib sebelum merancang pertanyaan T2 yang lebih tajam tentang kesediaan input porsi dan frekuensi oversell.

4. Analisis ancaman platform (Grab/GoFood) harus masuk ke framing T2: bedakan pain oversell di delivery vs di meja/self-order.

5. Model “inti gratis (Mode Porsi 1 outlet) + fitur lanjutan berbayar” tetap konsisten dengan pola pasar, tetapi hanya sebagai hipotesis desain sampai data primer tersedia.

---

*Dokumen ini disusun untuk keperluan internal validasi produk. Semua klaim fitur kompetitor berasal dari data sekunder publik dan belum diverifikasi lewat trial akun. Keputusan scope MVP tidak boleh diambil sebelum T1 selesai.*
