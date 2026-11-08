# Executive Summary (Revisi Ketat)  
## Market Research Report — UMKM F&B / Foodservice Indonesia  
### Konteks Validasi Produk Web App Multi-Modul (Tahap 0)

**Periode data sekunder**: Oktober 2023 – Oktober 2026  
**Tanggal**: 21 Oktober 2026  
**Status**: Draft untuk verifikasi internal. Belum menggantikan data primer (T1–T3).

---

Pasar UMKM Indonesia tetap menjadi tulang punggung ekonomi, dengan kontribusi sekitar 60,5–61% terhadap PDB dan ~97% serapan tenaga kerja. Sektor foodservice (definisi HRI – Hotel, Restaurant, Institutional) mencapai **USD 26,3 miliar pada 2023 dan USD 29 miliar pada 2024** menurut USDA FAS; estimasi lain lebih tinggi karena perbedaan cakupan metodologi. Infrastruktur QRIS sudah sangat luas (47,11 juta merchant per Agustus 2026, di mana >96% merupakan UMKM). Namun, kesenjangan digitalisasi operasional masih nyata: **dari UMKM yang sudah melakukan pencatatan keuangan, 77% masih melakukannya secara manual** (OCBC Business Fitness Index 2024).

**Yang sudah didukung data sekunder (Fakta / confidence sedang–tinggi)**  
- Masalah pencatatan transaksi dan keuangan yang masih manual.  
- Risiko verifikasi pembayaran QRIS (kasus screenshot palsu, stiker palsu, dan imbauan resmi BI/ASPI/kepolisian).  
- Adopsi QRIS yang sudah masif dan kebijakan MDR yang berlaku sejak 1 Oktober 2026 (termasuk larangan surcharge ke konsumen).

**Yang masih merupakan hipotesis desain (belum lolos validasi primer)**  
- Mode Porsi sebagai unit stok operasional harian yang natural dan ringan bagi pemilik warung mikro.  
- Kesediaan pemilik mengisi jumlah porsi setiap pagi.  
- Nilai fitur auto-habis (auto-disable menu di halaman customer) sebagai solusi atas oversell.  
- Klaim bahwa “wedge kosong” (belum ada kompetitor yang menawarkan auto-habis berbasis porsi harian yang ringan di halaman customer) — status saat ini: **belum terverifikasi**. Data publik hanya menunjukkan bentuk auto-habis longgar (notifikasi stok, blok di POS, atau mark Out of Stock di platform delivery). Trial langsung (T1) masih wajib.

**Keterbatasan data yang perlu diperhatikan**  
- Angka ukuran foodservice bervariasi signifikan antar sumber karena perbedaan definisi (HRI vs cakupan yang lebih luas termasuk street food dan delivery).  
- Klaim fitur kompetitor berasal dari website, Play Store, dan panduan publik; belum diverifikasi melalui akun trial.  
- Tidak ada data primer mengenai frekuensi oversell, kesediaan input harian, atau distribusi praktik “bayar dulu vs bayar setelah” di segmen warung mikro.

**Kesimpulan dan rekomendasi**  
Masalah operasional (pencatatan manual dan risiko verifikasi QRIS) didukung data sekunder dengan confidence memadai. Solusi yang diusulkan—khususnya Mode Porsi dan auto-habis di halaman customer—masih berupa hipotesis desain. Klaim “wedge kosong” belum dapat dipertahankan tanpa bukti trial.

**Tidak ada keputusan scope MVP final yang dapat diambil dari data sekunder ini.**  

Langkah wajib sebelum mengunci scope:  
1. **T1** – Teardown kompetitor (trial akun minimal Majoo, Qasir, Moka, Kasir Pintar).  
2. **T2** – Wawancara + contextual inquiry 15–20 pemilik/kasir warung mikro.  
3. **T3** – Uji prototipe klikable pada 5–8 partisipan.

Hanya setelah T1–T3 selesai dan hasilnya diintegrasikan, keputusan apakah Mode Porsi layak menjadi default MVP dapat diambil secara bertanggung jawab.

---

*Dokumen ini disusun untuk keperluan internal. Semua angka dan klaim harus diverifikasi ulang sebelum digunakan secara eksternal atau untuk keputusan investasi.*
