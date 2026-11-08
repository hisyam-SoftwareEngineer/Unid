# Tabel Audit Bukti  
## Market Research Report UMKM F&B Indonesia (Draft Okt 2026)

**Auditor**: Principal Product Researcher / Market Research Auditor  
**Tanggal audit**: 21 Oktober 2026  
**Status dokumen yang diaudit**: Draft revisi Tahap 0 (data sekunder saja)  
**Catatan metodologi audit**:  
- Hanya menggunakan bukti yang tercantum di draft laporan dan sumber yang sudah diverifikasi.  
- Tidak menambahkan angka, sumber, atau klaim baru.  
- Jika bukti tidak cukup → “belum terverifikasi”.  
- Penilaian confidence bersifat konservatif dan jujur.

---

## Tabel Audit Bukti

| No | Klaim | Bukti saat ini | Jenis bukti | Confidence | Gap | Cara verifikasi | Dampak keputusan jika klaim salah |
|----|-------|----------------|-------------|------------|-----|-----------------|-----------------------------------|
| 1 | **H1 – Pencatatan manual 77%** (dari UMKM yang sudah mencatat keuangan masih manual) | OCBC Business Fitness Index 2024 (bersama NielsenIQ): 77% dari pelaku UMKM yang sudah melakukan pencatatan keuangan/pembukuan masih melakukannya secara manual. 77% UMKM mengaku sudah melakukan pencatatan. Sumber: siaran pers resmi OCBC + liputan media (Suara.com, Detik, dll.). | **Fakta** (untuk pencatatan keuangan) | **High** | Tidak spesifik untuk stok porsi harian atau HPP operasional di warung mikro. Tidak membedakan usaha mikro vs kecil/menengah secara detail di angka 77%. | Sudah cukup kuat. Untuk spesifikasi stok: wawancara T2 + observasi lapangan. | Jika salah (angka jauh lebih rendah), urgensi fitur pencatatan ringan menurun. Risiko over-invest di modul pencatatan dasar. |
| 2 | **H2 – Verifikasi pembayaran QRIS di kasir lambat dan rawan penipuan** | Kasus konkret 2025–Okt 2026: screenshot/editan bukti transfer palsu (termasuk bantuan AI), stiker QRIS palsu, QRIS yang mengarah ke akun judi online. Bank Indonesia, ASPI, dan kepolisian aktif mengimbau verifikasi nama merchant dan mutasi rekening. | **Fakta** (kualitatif – kasus nyata) + **Interpretasi** (bahwa ini masalah operasional yang luas) | **Medium** | Tidak ada angka kerugian nasional yang dipublikasikan secara resmi. Tidak ada data frekuensi kejadian di segmen warung mikro. | T2 (tanya frekuensi kejadian + cara verifikasi saat ini) + monitoring kasus media/BI/ASPI. | Jika salah (masalah jarang terjadi atau sudah teratasi oleh merchant), fitur verifikasi QRIS menjadi nice-to-have, bukan prioritas tinggi. |
| 3 | **H3 – Order via QR meja mengurangi antrean dan salah catat** | Hampir seluruhnya klaim pemasaran vendor (Qasir, Majoo, dll.) atau karya ilmiah terbatas. Tidak ditemukan data sekunder kuantitatif independen yang kuat. | **Asumsi** (berdasarkan klaim vendor) | **Low** | Tidak ada data sebelum-sesudah atau A/B test independen. Tidak ada pengukuran waktu antrean atau tingkat kesalahan catat di lapangan. | T2 (tanya pengalaman antrean & salah catat) + T3 (uji prototipe QR meja vs cara manual). | Jika salah, positioning “kurangi antrean” menjadi lemah. Fitur self-order tetap bisa berguna untuk alasan lain (kurangi beban kasir, akurat order), tetapi jangan dijadikan benefit utama. |
| 4 | **Mode Porsi sebagai unit stok operasional harian** (pemilik warung rutin mencatat / berpikir dalam porsi harian real-time) | Beberapa studi HPP warung/rumah makan menghitung biaya dan produksi dalam unit **porsi**. Manajemen bahan baku formal (FIFO, PAR, resep standar) lebih umum di resto/kafe yang sedikit lebih besar. | **Interpretasi** + **Asumsi** | **Low – Medium** | Belum ada bukti kuat bahwa pemilik warung mikro rutin mencatat **sisa porsi harian real-time** (bukan hanya menghitung HPP periodik). Kesediaan input setiap pagi belum teruji. | T2: pertanyaan spesifik “Kapan terakhir kali mencatat sisa porsi?”, “Bagaimana cara tahu menu habis?”, “Bersedia isi setiap pagi? Berapa lama wajar?”. T3: uji friction input Mode Porsi. | Jika salah (pemilik tidak berpikir/tidak mau input porsi harian), Mode Porsi gagal sebagai wedge. Harus pivot ke unit lain atau ke notifikasi stok yang lebih ringan. |
| 5 | **Kompetitor belum punya auto-habis berbasis porsi** (Mode Porsi harian ringan + disable otomatis di halaman customer) | Data publik (website, Play Store, blog) Qasir, Loyverse, Majoo, Kasir Pintar, Menuku menunjukkan: inventori + low-stock notification / warning sudah umum; self-order ada di tier berbayar. Tidak ditemukan deskripsi eksplisit “input porsi harian → auto-disable di customer page” sebagai fitur default gratis. | **Interpretasi** dari data publik | **Low** | Belum ada akun trial (T1). Fitur bisa ada di tier berbayar atau di update terbaru yang tidak terlihat di marketing page. Klaim “belum punya” hanya berdasarkan data sekunder. | **T1 wajib**: trial akun Qasir Pro, Loyverse Advanced, Majoo, Kasir Pintar, dan kandidat lain. Dokumentasikan apakah ada input berbasis porsi + auto-sold-out di customer-facing page. | Jika salah (kompetitor sudah punya fitur serupa di harga terjangkau), wedge “kosong” hancur. Diferensiasi harus digeser ke kemudahan input, harga, atau pengalaman customer yang lebih ringan. |
| 6 | **QRIS & MDR** (adopsi sangat tinggi; MDR baru berlaku 1 Okt 2026; dilarang surcharge ke konsumen) | Bank Indonesia (Agustus 2026): 69,32 juta pengguna, 47,11 juta merchant, >96% UMKM. Kebijakan MDR 1 Oktober 2026: UMI ≤ Rp500.000 = 0%; di atasnya 0,3%. Merchant dilarang membebankan MDR ke konsumen (sumber: BI + bank-bank + liputan Kontan). | **Fakta** | **High** | Angka merchant dan proporsi UMKM bisa berubah; detail implementasi MDR di lapangan (apakah semua PSP patuh) belum sepenuhnya terlihat. | Monitor update resmi Bank Indonesia dan ASPI. T2: tanya praktik aktual surcharge di warung. | Jika salah (adopsi jauh lebih rendah atau MDR diabaikan), argumen infrastruktur pembayaran siap menjadi lemah. Fitur no-surcharge tetap wajib secara regulasi. |
| 7 | **Ukuran pasar foodservice** (USD 26,3 miliar 2023 → USD 29 miliar 2024 menurut USDA; estimasi lain lebih tinggi) | USDA FAS GAIN Report: HRI Indonesia USD 26,3 miliar (2023), USD 29 miliar (2024). Estimasi lain (MoreFood Expo, GlobalData, MarketLine, dll.) mencapai USD 38–62 miliar tergantung cakupan (termasuk street food, delivery, profit sector). | **Fakta** (untuk angka USDA) + **Interpretasi** (pasar besar & terfragmentasi) | **High** (untuk rentang USDA) / **Medium** (untuk estimasi lebih tinggi) | Perbedaan definisi sangat besar. Angka USDA adalah HRI; angka lebih tinggi mencakup cakupan lebih luas. Tidak ada angka tunggal yang “benar”. | Selalu cantumkan rentang + definisi + sumber. Jangan satukan angka. Untuk sizing produk, fokus pada segmen S1 (warung mikro), bukan total market. | Jika salah (pasar jauh lebih kecil dari yang digambarkan), proyeksi volume dan opportunity size menjadi overstated. Namun untuk keputusan wedge, ukuran total market kurang kritis dibanding validasi masalah di S1. |

---

## Ringkasan Temuan Audit

| Kategori | Jumlah Klaim | Keterangan |
|----------|--------------|------------|
| **Fakta kuat (High)** | 2 | H1 (dengan catatan wording) dan QRIS/MDR |
| **Fakta + Interpretasi (Medium)** | 2 | H2 dan ukuran pasar (rentang) |
| **Asumsi / Low confidence** | 3 | H3, Mode Porsi sebagai unit harian, dan “kompetitor belum punya auto-habis berbasis porsi” |

**Kesimpulan auditor**:  
Tiga klaim paling kritis untuk keputusan produk (H3, Mode Porsi, dan kekosongan fitur di kompetitor) masih berada di zona **Low confidence** dan bergantung hampir sepenuhnya pada data primer (T1 + T2 + T3). Draft laporan sudah cukup hati-hati setelah revisi, tetapi residual risk masih tinggi jika Mode Porsi dikunci sebagai MVP tanpa verifikasi lapangan.

**Rekomendasi prioritas**:
1. Jangan gunakan klaim 3, 4, dan 5 sebagai landasan keputusan scope MVP.
2. T1 (teardown trial) dan T2 (wawancara) harus dijalankan sebelum mengunci wedge.
3. Semua komunikasi internal dan eksternal wajib mempertahankan pembedaan Fakta / Interpretasi / Asumsi.

---

*Dokumen audit ini hanya menilai kekuatan bukti sekunder yang ada di draft. Tidak menggantikan validasi primer.*
