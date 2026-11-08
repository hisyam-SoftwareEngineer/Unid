# Evidence Audit & Research Methodology Report  
## UMKM F&B Indonesia – Validasi Produk Digital (Tahap 0)

**Peran**: Research Methodologist & Evidence Auditor  
**Tanggal**: 21 Oktober 2026  
**Cakupan**: Audit kualitas bukti seluruh klaim utama dari draft Market Research Report, analisis kompetitor, dan sesi sebelumnya  
**Prinsip yang ditegakkan**:
- Hanya menggunakan data yang sudah diverifikasi di sesi riset sebelumnya.
- Tidak mengarang angka, sumber, atau fitur.
- Jika tidak ada data → tulis “belum terverifikasi”.
- Bedakan secara ketat: **Fakta / Interpretasi / Asumsi**.
- Tidak pernah menyarankan keputusan MVP final tanpa data primer (T1–T3).

---

## 1. Tabel Audit Bukti per Klaim Utama

### Klaim 1: “77% pencatatan masih manual”

| Kolom | Isi |
|-------|-----|
| **Klaim** | Dari UMKM yang sudah melakukan pencatatan keuangan, 77% masih melakukannya secara manual. |
| **Bukti saat ini** | OCBC Business Fitness Index 2024 (kerja sama NielsenIQ). Siaran pers resmi OCBC (17 Agustus 2024): 77% pelaku UMKM yang sudah mencatat/pembukuan masih manual. 77% UMKM mengaku sudah melakukan pencatatan. Sumber diverifikasi: siaran pers OCBC + liputan Suara.com, Detik. Sampel ≈620 responden di Jakarta, Medan, Bandung, Surabaya. |
| **Jenis bukti** | **Fakta** (untuk pencatatan keuangan) |
| **Confidence** | **High** |
| **Gap** | Tidak spesifik untuk stok porsi harian atau HPP operasional di warung mikro. Tidak membedakan usaha mikro vs kecil/menengah secara detail pada angka 77%. Sampel urban. |
| **Cara verifikasi** | Klaim pencatatan keuangan sudah cukup kuat. Untuk spesifikasi stok/porsi: T2 wawancara + observasi lapangan. |
| **Dampak keputusan jika klaim salah** | Jika angka jauh lebih rendah, urgensi fitur pencatatan ringan menurun → risiko over-invest di modul pencatatan dasar. |

**Catatan wording wajib**: Selalu tulis “dari yang sudah mencatat”, bukan “77% seluruh UMKM masih manual”.

---

### Klaim 2: “Verifikasi pembayaran QRIS di kasir lambat dan rawan penipuan”

| Kolom | Isi |
|-------|-----|
| **Klaim** | Verifikasi QRIS di kasir lambat dan rawan penipuan (screenshot/editan bukti palsu, stiker QRIS palsu, QRIS ke akun judi). |
| **Bukti saat ini** | Kasus konkret 2025–Oktober 2026 diliput media (Antara, Kompas, Okezone, dll.). Bank Indonesia, ASPI, dan kepolisian aktif mengimbau verifikasi nama merchant + mutasi rekening. |
| **Jenis bukti** | **Fakta** (kualitatif – kasus nyata) + **Interpretasi** (bahwa masalah ini cukup luas) |
| **Confidence** | **Medium** |
| **Gap** | Tidak ada angka kerugian nasional resmi. Tidak ada data frekuensi kejadian khusus di segmen warung mikro. |
| **Cara verifikasi** | T2 (tanya frekuensi kejadian + cara verifikasi saat ini di lapangan) + monitoring kasus BI/ASPI/media. |
| **Dampak keputusan jika klaim salah** | Jika masalah jarang terjadi atau sudah teratasi oleh merchant, fitur verifikasi QRIS menjadi nice-to-have, bukan prioritas tinggi. |

---

### Klaim 3: “Order via QR meja mengurangi antrean dan salah catat”

| Kolom | Isi |
|-------|-----|
| **Klaim** | Self-order / QR meja mengurangi antrean dan kesalahan pencatatan order. |
| **Bukti saat ini** | Hampir seluruhnya klaim pemasaran vendor (Qasir, Majoo, dll.) atau karya ilmiah terbatas. Tidak ditemukan data sekunder kuantitatif independen yang kuat. |
| **Jenis bukti** | **Asumsi** (berdasarkan klaim vendor) |
| **Confidence** | **Low** |
| **Gap** | Tidak ada data sebelum-sesudah atau A/B test independen. Tidak ada pengukuran waktu antrean atau tingkat kesalahan catat di lapangan. |
| **Cara verifikasi** | T2 (pengalaman antrean & salah catat) + T3 (uji prototipe QR meja vs cara manual). |
| **Dampak keputusan jika klaim salah** | Positioning “kurangi antrean” menjadi lemah. Fitur self-order tetap bisa berguna untuk alasan lain (kurangi beban kasir, akurasi order), tetapi jangan dijadikan benefit utama. |

---

### Klaim 4: “Mode Porsi natural bagi warung sebagai unit stok operasional harian”

| Kolom | Isi |
|-------|-----|
| **Klaim** | Pemilik warung mikro berpikir dan bersedia mencatat ketersediaan dalam unit porsi harian real-time. |
| **Bukti saat ini** | Beberapa studi HPP warung/rumah makan menghitung biaya & produksi dalam unit porsi. Manajemen bahan baku formal (FIFO, PAR, resep) lebih umum di resto/kafe yang sedikit lebih besar. |
| **Jenis bukti** | **Interpretasi** + **Asumsi** |
| **Confidence** | **Low – Medium** |
| **Gap** | Belum ada bukti bahwa pemilik warung mikro rutin mencatat sisa porsi harian real-time (bukan hanya menghitung HPP periodik). Kesediaan input setiap pagi belum teruji. |
| **Cara verifikasi** | T2: “Kapan terakhir kali mencatat sisa porsi?”, “Bagaimana cara tahu menu sudah habis?”, “Bersedia isi jumlah porsi per menu setiap pagi? Berapa lama waktu yang wajar?”. T3: uji friction input Mode Porsi. |
| **Dampak keputusan jika klaim salah** | Mode Porsi gagal sebagai wedge. Harus pivot ke unit lain atau ke notifikasi stok yang lebih ringan. |

---

### Klaim 5: “Kompetitor belum punya auto-habis berbasis porsi (Mode Porsi harian + auto-disable di customer page)”

| Kolom | Isi |
|-------|-----|
| **Klaim** | Belum ada kompetitor yang memiliki input stok berbasis porsi harian ringan + auto-disable otomatis di halaman customer self-order sebagai fitur default/terjangkau di segmen mikro. |
| **Bukti saat ini** | Data publik (website, Play Store, help center) Qasir, Loyverse, Majoo, Kasir Pintar, Moka, Labamu, Runchise, Grab/GoFood: inventori + low-stock notification + blok di POS + mark OOS di delivery sudah umum. Tidak ditemukan deskripsi eksplisit “porsi harian → auto-sold-out di customer page”. |
| **Jenis bukti** | **Interpretasi** dari data publik (belum trial) |
| **Confidence** | **Low** |
| **Gap** | Belum ada akun trial (T1). Fitur bisa ada di tier berbayar atau update terbaru yang tidak terlihat di marketing page. |
| **Cara verifikasi** | T1 trial minimal 3–4 kompetitor (prioritas: Majoo → Qasir → Moka → Kasir Pintar). Dokumentasikan perilaku saat stok = 0 di halaman customer self-order. |
| **Dampak keputusan jika klaim salah** | Wedge “kosong” hancur. Diferensiasi harus digeser ke kemudahan input ekstrem, harga, atau pengalaman customer yang lebih ringan. |

**Status klaim yang sah**: “Belum terverifikasi. Terdapat kandidat (terutama Majoo) dengan mekanisme auto-habis di sisi kasir. Harus diuji lewat T1.”

---

### Klaim 6: QRIS & MDR (adopsi tinggi, MDR baru, no surcharge)

| Kolom | Isi |
|-------|-----|
| **Klaim** | QRIS sudah sangat masif (>96% merchant UMKM); MDR baru berlaku 1 Oktober 2026; dilarang surcharge ke konsumen. |
| **Bukti saat ini** | Bank Indonesia (Agustus 2026): 69,32 juta pengguna, 47,11 juta merchant, >96% UMKM. Kebijakan MDR 1 Oktober 2026 (UMI ≤ Rp500.000 = 0%; di atasnya 0,3%). Sumber: BI + bank + liputan Kontan. |
| **Jenis bukti** | **Fakta** |
| **Confidence** | **High** |
| **Gap** | Detail implementasi MDR di lapangan (kepatuhan PSP) dan perubahan angka merchant setelah kebijakan baru belum sepenuhnya terlihat. |
| **Cara verifikasi** | Monitor update resmi Bank Indonesia & ASPI. T2: tanya praktik aktual surcharge di warung. |
| **Dampak keputusan jika klaim salah** | Jika adopsi jauh lebih rendah atau MDR diabaikan, argumen infrastruktur pembayaran siap menjadi lemah. Fitur no-surcharge tetap wajib secara regulasi. |

---

### Klaim 7: Ukuran pasar foodservice

| Kolom | Isi |
|-------|-----|
| **Klaim** | Sektor foodservice/HRI Indonesia mencapai USD 26,3 miliar (2023) hingga USD 29 miliar (2024) menurut USDA; estimasi lain lebih tinggi. |
| **Bukti saat ini** | USDA FAS GAIN Report: HRI USD 26,3 miliar (2023), USD 29 miliar (2024). Estimasi lain (MoreFood Expo, GlobalData, MarketLine, dll.) USD 38–62 miliar tergantung cakupan. |
| **Jenis bukti** | **Fakta** (untuk angka USDA) + **Interpretasi** (pasar besar & terfragmentasi) |
| **Confidence** | **High** (rentang USDA) / **Medium** (estimasi lebih tinggi) |
| **Gap** | Perbedaan definisi sangat besar. Angka USDA = HRI; angka lebih tinggi mencakup street food, delivery, atau profit sector yang lebih luas. |
| **Cara verifikasi** | Selalu cantumkan rentang + tahun + definisi + sumber. Jangan satukan angka. Untuk sizing produk, fokus pada segmen S1. |
| **Dampak keputusan jika klaim salah** | Jika pasar jauh lebih kecil, proyeksi volume dan opportunity size menjadi overstated. Namun untuk keputusan wedge, ukuran total market kurang kritis dibanding validasi masalah di S1. |

---

## 2. Identifikasi Bias

| Jenis Bias | Deskripsi | Tingkat Risiko | Status Mitigasi di Draft Saat Ini | Mitigasi yang Masih Diperlukan |
|------------|-----------|----------------|-----------------------------------|-------------------------------|
| **Bias vendor / publikasi** | Fitur dipromosikan di website/Play Store sering hanya tersedia di paket berbayar atau belum stabil | **Tinggi** | Sudah ditandai “website only / belum trial” | T1 trial wajib sebelum klaim fitur kompetitor |
| **Bias sampel urban** | OCBC BFI & banyak studi kasus condong ke responden kota besar (Jakarta, Medan, Bandung, Surabaya) | **Sedang–Tinggi** | Belum dimitigasi secara eksplisit di desain T2 | T2 harus mencakup minimal 1 kota non-Jabodetabek |
| **Bias formalitas** | Data pemerintah formal (30,2 juta) vs estimasi total termasuk informal (64–66 juta) | **Sedang** | Sudah dijelaskan perbedaan | Selalu cantumkan catatan metodologi saat mengutip angka |
| **Bias survivorship / early adopter** | Merchant yang sudah pakai POS berbayar lebih terlihat di data publik | **Tinggi** | Belum dimitigasi | Fokus T2 pada warung yang masih 100% manual atau hanya QRIS + buku catatan |
| **Bias konfirmasi** | Kecenderungan mencari bukti yang mendukung Mode Porsi sebagai wedge | **Sedang** | Draft sudah menurunkan confidence & menandai asumsi | Auditor independen + go/no-go criteria ketat di T1/T2 |
| **Bias definisi** | “Foodservice”, “UMKM”, dan “pencatatan manual” didefinisikan berbeda antar sumber | **Tinggi** | Sudah disajikan sebagai rentang | Jangan pernah satukan angka tanpa catatan definisi |

---

## 3. Angka yang Saling Bertentangan & Perbedaan Definisi

| Angka yang Bertentangan | Nilai A | Nilai B | Penjelasan Perbedaan Definisi | Cara Menyajikan yang Benar |
|-------------------------|---------|---------|-------------------------------|----------------------------|
| Jumlah unit UMKM | 30,2 juta (Kemenko – formal tercatat) | 64–66 juta (Statsindo / Kemenkop – estimasi total) | Formal = yang terdaftar/berizin. Total = termasuk usaha informal yang tidak tercatat. | Selalu tulis keduanya + catatan cakupan. Jangan pilih satu angka. |
| Ukuran foodservice | USD 26,3 miliar (2023) / USD 29 miliar (2024) – USDA HRI | USD 38–62 miliar (estimasi lain 2024–2025) | USDA = Hotel + Restaurant + Institutional. Estimasi lain sering mencakup street food, full consumer foodservice, atau profit sector yang lebih luas. | Sajikan sebagai **rentang** dengan tahun + definisi + sumber. Anchor di USDA. |
| 77% pencatatan manual | 77% dari UMKM **yang sudah mencatat** masih manual (OCBC BFI 2024) | Kadang disalahartikan sebagai “77% seluruh UMKM masih manual” | Pembilang = yang sudah melakukan pencatatan. Penyebut = seluruh UMKM yang disurvei. | Wajib wording: “dari UMKM yang sudah mencatat keuangan, 77% masih manual”. |
| Proporsi merchant QRIS UMKM | >96% (BI) | Beberapa laporan menyebut 96,7% | Perbedaan kecil, kemungkinan rounding atau periode sedikit berbeda. | Gunakan “>96%” dan sebut sumber BI. |

**Tidak ada kontradiksi faktual yang tidak bisa dijelaskan.** Semua perbedaan berasal dari perbedaan definisi dan cakupan metodologi.

---

## 4. Keterbatasan Riset Sekunder (Jujur)

1. **Tidak ada data primer sama sekali.** Seluruh temuan bersifat kalibrasi hipotesis, bukan validasi.
2. **Cakupan geografis terbatas.** Sumber utama (OCBC BFI, banyak studi kasus) condong ke kota besar. Perilaku warung di kota sekunder dan area non-urban belum terwakili.
3. **Bias vendor & publikasi tinggi.** Klaim fitur kompetitor berasal dari marketing material, bukan observasi langsung. Fitur sering “ada di brochure” tetapi hanya aktif di tier berbayar atau belum stabil.
4. **Definisi yang tidak seragam.** Angka UMKM dan foodservice berbeda antar sumber karena metodologi berbeda. Draft sudah mencoba mengatasinya dengan rentang, tetapi residual risk tetap ada jika pembaca mengabaikan catatan.
5. **Tidak ada pengukuran frekuensi pain point.** Kasus penipuan QRIS dan oversell bersifat kualitatif. Tidak diketahui seberapa sering terjadi di populasi S1.
6. **Tidak ada data kesediaan input.** Asumsi bahwa pemilik bersedia mengisi stok porsi setiap pagi adalah yang paling kritis dan paling lemah buktinya.
7. **Waktu data.** Beberapa sumber (terutama OCBC 2024) sudah berumur >1 tahun. Kondisi QRIS, MDR, dan kompetitor bisa berubah cepat.
8. **Tidak ada trial kompetitor.** Semua pernyataan tentang “belum punya auto-habis berbasis porsi” masih asumsi sampai T1 selesai.
9. **Tidak ada data distribusi praktik pembayaran** (bayar dulu vs bayar setelah) di lapangan.

**Pernyataan metodologi yang wajib dicantumkan di setiap versi laporan**:  
> “Laporan ini hanya menggunakan data sekunder publik. Tidak menggantikan wawancara primer, trial kompetitor, atau prototipe klik. Keputusan scope MVP tidak boleh diambil dari dokumen ini saja.”

---

## 5. Ringkasan Confidence & Prioritas Verifikasi

| Klaim | Jenis | Confidence | Prioritas Verifikasi |
|-------|-------|------------|----------------------|
| 77% pencatatan manual (dari yang sudah mencatat) | Fakta | High | Rendah (sudah kuat) |
| QRIS & MDR | Fakta | High | Rendah (monitor update) |
| Ukuran foodservice (rentang USDA) | Fakta | High | Rendah (selalu pakai rentang) |
| Verifikasi QRIS rawan | Fakta kualitatif + Interpretasi | Medium | Sedang (T2) |
| Mode Porsi natural & kesediaan input | Interpretasi + Asumsi | Low–Medium | **Tinggi (T2 + T3)** |
| Kompetitor belum punya auto-habis berbasis porsi | Interpretasi (belum trial) | Low | **Tinggi (T1)** |
| QR meja mengurangi antrean | Asumsi | Low | Sedang (T2/T3) |

**Tiga klaim paling menentukan untuk keputusan produk** (Mode Porsi natural, kompetitor belum punya, dan frekuensi oversell) masih berada di zona **Low confidence** dan bergantung hampir sepenuhnya pada data primer.

---

## 6. Rekomendasi Metodologi (Tanpa Keputusan MVP)

1. Jangan mengunci scope MVP berdasarkan laporan sekunder ini.
2. Jalankan T1 (trial kompetitor) dan T2 (wawancara S1) secara paralel segera.
3. Semua dokumen internal wajib mempertahankan label **Fakta / Interpretasi / Asumsi** secara eksplisit.
4. Setiap kali angka UMKM atau foodservice dikutip, sertakan catatan definisi dan sumber.
5. Setelah T1 + T2 selesai, lakukan audit bukti ulang terhadap data primer sebelum masuk Tahap 1 (Scope MVP).
6. Go/No-Go criteria untuk wedge Mode Porsi hanya boleh diputuskan setelah minimal 3 trial akun (T1) + 12 wawancara (T2) didokumentasikan.

---

*Dokumen ini adalah audit kualitas bukti dan metodologi. Tujuannya menjaga disiplin epistemik agar keputusan produk tidak dibangun di atas asumsi yang belum teruji. Tidak ada rekomendasi keputusan final MVP di dalamnya.*
