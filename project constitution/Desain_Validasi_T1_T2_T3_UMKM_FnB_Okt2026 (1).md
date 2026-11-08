# Desain Validasi Primer T1 / T2 / T3  
## Produk Web App Multi-Modul untuk UMKM F&B Indonesia (Tahap 0 → Tahap 1)

**Peran**: Product Researcher  
**Tanggal**: 21 Oktober 2026  
**Dasar**: Draft Market Research Report + Audit Bukti + Analisis Kompetitor (data sekunder)  
**Prinsip**:  
- Desain ini hanya instrumen validasi.  
- Tidak ada keputusan scope MVP final sebelum T1–T3 selesai dan didokumentasikan.  
- Semua metrik dan go/no-go bersifat terukur dan dapat diamati.  
- Estimasi durasi/effort adalah **asumsi perencanaan**, bukan komitmen.

---

## 1. T1 – Teardown Kompetitor (Competitor Teardown)

### Tujuan
Menentukan apakah wedge “Mode Porsi → auto-habis di halaman customer” masih memiliki ruang diferensiasi yang berarti di harga yang relevan untuk 1 outlet mikro, atau sudah cukup tertutup oleh kompetitor.

### Sample (Minimal)
| Prioritas | Pemain | Alasan Dipilih | Target Tier yang Diuji |
|-----------|--------|----------------|------------------------|
| 1 | Majoo | Dokumentasi Limitasi Stok Keluar paling eksplisit | Paket yang menyertakan Self Order + Inventori |
| 2 | Qasir | Self-order sudah ada; basis UMKM besar | Pro / Pro Plus |
| 3 | Moka POS | Inventory real-time + Contactless Order; ekosistem Gojek | Basic atau Pro |
| 4 | Kasir Pintar | Filter “Tersedia” + QR Order | Versi berbayar yang punya QR Order |
| 5 (opsional) | Loyverse Advanced Inventory | Kontrol internasional yang ringan | Advanced Inventory |
| 6 (opsional) | Labamu atau Runchise | Jika waktu memungkinkan | Tier yang relevan untuk 1 outlet |

**Catatan**: Menuku dimonitor tetapi prioritas rendah (data publik terlalu tipis).

### Metode
1. Daftar / aktifkan trial akun (jika tersedia) atau gunakan akun demo resmi.
2. Ikuti skenario uji berurutan di bawah.
3. Dokumentasikan dengan screenshot + catatan perilaku (termasuk latency dan edge case).
4. Catat harga efektif setelah trial (atau harga publik terbaru jika trial tidak memungkinkan).
5. Bandingkan dengan perilaku mark Out of Stock di GrabFood / GoFood Merchant App (sebagai konteks platform).

### Skenario Uji (Wajib Berurutan)

| No | Skenario | Yang Diamati / Dicatat |
|----|----------|------------------------|
| 1 | Setup menu + stok awal | Apakah ada opsi input “porsi harian” atau unit setara yang sangat ringan? Berapa langkah & waktu? |
| 2 | Set stok item = 0 (atau di bawah minimum) | Apakah item **otomatis disable / hilang** di halaman customer self-order / QR meja? Atau hanya di layar kasir / notifikasi? |
| 3 | Manual “tandai habis” / sold-out (jika ada) | Apakah status sync ke self-order, online ordering, dan channel lain? |
| 4 | Self-order aktif + ubah stok real-time | Latency update di sisi pelanggan. Apakah ada delay atau inkonsistensi? |
| 5 | Cek harga efektif 1 outlet | Biaya bulanan/tahunan agar fitur self-order + stok + (jika ada) auto-habis aktif. |
| 6 | Bandingkan dengan platform delivery | Bagaimana merchant yang sudah pakai Grab/GoFood, apakah mark OOS di app merchant sudah dianggap “cukup”? |

### Pertanyaan Kunci (Internal Researcher)
- Apakah ada input stok berbasis porsi harian (atau unit setara sangat ringan)?
- Apakah sold-out otomatis men-disable item di **halaman customer**?
- Berapa friction (langkah + waktu) untuk set stok harian?
- Di tier harga berapa fitur tersebut aktif? Apakah realistis untuk ARPU warung mikro?

### Metrik
- Ada / tidak fitur auto-disable di **customer-facing page** saat stok = 0 (Ya / Tidak / Parsial).
- Unit input stok yang tersedia (porsi / pcs / resep bahan baku / lainnya).
- Jumlah langkah & estimasi waktu untuk set stok harian (proxy friction Mode Porsi).
- Harga efektif 1 outlet (Rp/bulan atau Rp/tahun).
- Ketersediaan di tier yang realistis untuk warung mikro (Ya / Tidak).

### Go / No-Go Criteria (Spesifik & Terukur)

| Hasil Observasi T1 | Keputusan |
|--------------------|-----------|
| ≥ 2 kompetitor utama sudah punya **auto-disable di customer page** + input stok relatif ringan, di harga ≤ Rp 300–500 ribu/bulan (atau setara) | Wedge Mode Porsi **melemah signifikan**. Pertimbangkan diferensiasi lain (friction ekstrem lebih rendah, inti gratis, atau fokus verifikasi QRIS). |
| Hanya ada blok di sisi kasir / notifikasi, **tidak** auto-disable di customer page, atau hanya tersedia di tier sangat mahal | Wedge masih memiliki ruang. Lanjutkan validasi T2 (kesediaan input harian). |
| Ditemukan fitur yang sangat mirip Mode Porsi (input porsi harian → auto-sold-out customer) di tier terjangkau | Wedge **gagal**. Pivot atau cari sudut diferensiasi baru. |
| Data tidak konklusif (fitur ada tapi perilaku tidak stabil / tidak terdokumentasi jelas) | Ulangi uji atau perluas sample; **jangan** putuskan scope MVP. |

**Aturan ketat**: Keputusan go/no-go T1 hanya setelah minimal 3 trial akun selesai dan didokumentasikan (screenshot + catatan perilaku).

---

## 2. T2 – Wawancara + Contextual Inquiry

### Tujuan
Menguji asumsi kritis tentang: kesediaan input porsi harian, frekuensi oversell, cara mengetahui menu habis, prioritas masalah (termasuk verifikasi QRIS), dan distribusi praktik bayar dulu vs bayar setelah.

### Sample
- **Jumlah**: 15–20 pemilik / kasir warung mikro (S1).
- **Kriteria inklusi**:
  - 1 outlet.
  - 2–6 orang.
  - HP Android sebagai perangkat utama.
  - Menggunakan QRIS (statis atau dinamis).
  - Belum memakai POS berbayar lengkap (atau hanya fitur sangat dasar).
  - Pemilik sering merangkap kasir / operasional.
- **Lokasi**: Minimal 2–3 kota (contoh: Jabodetabek + 1 kota Jawa Tengah/Timur atau Sumatera). Hindari bias 100% urban besar.
- **Rekrutmen**: Snowball + kunjungan langsung ke warung + referensi dari komunitas UMKM lokal.

### Metode
- Semi-structured interview + contextual inquiry (jika memungkinkan, observasi singkat di lokasi saat jam sepi atau setelah tutup).
- Durasi: 30–45 menit per sesi.
- Rekam audio (dengan izin) + catatan lapangan.
- Gunakan panduan wawancara yang sama untuk semua partisipan, dengan probing fleksibel.

### Pertanyaan Kunci (Inti)

**Blok A – Praktik Stok & Porsi**
1. Kapan terakhir kali Bapak/Ibu mencatat sisa porsi atau sisa menu hari itu?
2. Bagaimana cara mengetahui menu sudah habis sebelum pelanggan memesan?
3. Pernah mengalami pelanggan pesan menu yang ternyata sudah habis? Seberapa sering dalam sebulan terakhir?
4. Apakah bersedia mengisi jumlah porsi per menu setiap pagi? Berapa lama waktu yang masih wajar menurut Bapak/Ibu?

**Blok B – Prioritas Masalah**
5. Dari masalah berikut, urutkan yang paling mengganggu (1 = paling mengganggu):  
   - Verifikasi pembayaran QRIS / takut penipuan  
   - Menu habis setelah dipesan (oversell)  
   - Antrean / salah catat order  
   - Pencatatan keuangan / laporan  
   - Lainnya (sebutkan)
6. Bagaimana cara Bapak/Ibu saat ini memverifikasi pembayaran QRIS dari pelanggan?

**Blok C – Praktik Pembayaran**
7. Di warung ini, lebih sering pelanggan bayar dulu atau bayar setelah makan?
8. Apakah pernah ada masalah terkait timing pembayaran?

**Blok D – Digitalisasi Saat Ini**
9. Aplikasi atau cara apa yang sudah dipakai untuk order / stok / pembayaran?
10. Apa yang membuat Bapak/Ibu ragu atau belum mau pakai aplikasi kasir berbayar?

### Metrik (Kuantitatif + Kualitatif)
- % partisipan yang pernah mengalami oversell dalam 30 hari terakhir.
- Frekuensi oversell (median / range).
- % yang menyatakan bersedia input stok/porsi harian dengan waktu ≤ 2 menit / ≤ 3 menit / ≤ 5 menit.
- Ranking prioritas masalah (frekuensi muncul di peringkat 1–2).
- Distribusi “bayar dulu” vs “bayar setelah” (persentase).
- Tema kualitatif: alasan menolak input harian, cara aktual mengetahui menu habis, persepsi terhadap auto-habis di sisi pelanggan.

### Go / No-Go Criteria (Spesifik & Terukur)

| Hasil T2 | Keputusan |
|----------|-----------|
| < 40% partisipan bersedia input harian dengan waktu yang dianggap wajar (≤ 3 menit), **atau** frekuensi oversell sangat rendah (< 20% pernah mengalami dalam 30 hari) | Mode Porsi sebagai default **perlu diubah, disederhanakan, atau ditunda**. Pertimbangkan alternatif unit atau notifikasi saja. |
| ≥ 40% bersedia input ≤ 3 menit **dan** frekuensi oversell cukup nyata (≥ 30% pernah mengalami) **dan** ranking “menu habis” masuk top-3 prioritas | Lanjutkan ke T3 dengan Mode Porsi sebagai kandidat utama. |
| Verifikasi QRIS secara konsisten masuk ranking 1–2 prioritas | Pertahankan fitur verifikasi sebagai bagian penting dari value proposition. |
| Data tidak konklusif atau bias sampel terlalu kuat (hampir semua urban besar) | Perluas sample sebelum memutuskan. |

**Catatan**: Go/no-go T2 bersifat indikatif. Keputusan akhir wedge menunggu integrasi dengan hasil T1 dan T3.

---

## 3. T3 – Prototipe Klik (Clickable / Low-fi Prototype)

### Tujuan
Menguji friction nyata dari Mode Porsi, preference terhadap alternatif, dan sinyal awal willingness-to-pay / adoption intent.

### Sample
- **Jumlah**: 5–8 partisipan.
- **Sumber**: Diambil dari partisipan T2 yang bersedia dan memenuhi kriteria S1.
- **Preferensi**: Campuran yang sudah menyatakan bersedia input harian dan yang ragu.

### Metode
- Prototipe klikable (Figma / sejenis) atau low-fi interaktif.
- Task-based usability testing + preference test.
- Durasi: 20–30 menit per sesi.
- Moderator mencatat time-on-task, error, komentar think-aloud, dan preference.

### Skenario Tugas (Contoh)
1. **Tugas Input Pagi (Mode Porsi)**  
   “Anggap hari ini Bapak/Ibu baru buka. Isi sisa porsi untuk 5 menu utama agar sistem tahu apa yang masih tersedia.”
2. **Tugas Customer View**  
   “Bayangkan pelanggan scan QR. Apa yang terlihat jika salah satu menu sudah habis?”
3. **Preference Test**  
   Bandingkan dua alur:  
   - Mode Porsi (input angka porsi per menu)  
   - Alternatif lebih sederhana (toggle “Tersedia / Habis” saja)  
   Tanya: mana yang lebih mudah / lebih berguna / lebih mungkin dipakai setiap hari?
4. **Sinyal Adopsi**  
   “Jika fitur ini gratis untuk 1 outlet, apakah Bapak/Ibu mau coba? Apa yang masih mengganjal?”

### Pertanyaan Kunci (Post-task)
- Seberapa mudah atau ribet mengisi porsi tadi? (skala 1–5 + alasan)
- Apakah Bapak/Ibu akan mengisi seperti ini setiap pagi? Mengapa?
- Mana yang lebih disukai: isi angka porsi atau cukup toggle tersedia/habis?
- Apa yang masih kurang atau membingungkan?

### Metrik
- Task success rate (berhasil menyelesaikan input tanpa bantuan mayor ≥ 70% target).
- Time-on-task untuk input 5 menu (median, detik/menit).
- Preference (Mode Porsi vs toggle sederhana) – jumlah yang memilih masing-masing.
- Sinyal adoption intent (mau coba jika gratis / ragu / tidak mau) + alasan.
- Error & confusion points (kualitatif).

### Go / No-Go Criteria (Spesifik & Terukur)

| Hasil T3 | Keputusan |
|----------|-----------|
| Task success ≥ 70% **dan** preference jelas ke Mode Porsi **dan** sinyal “mau coba jika gratis” ≥ 60% | Mode Porsi layak dilanjutkan sebagai default di scope MVP (masih provisional sampai ada data penggunaan nyata). |
| Task success < 70% **atau** preference mayoritas ke toggle sederhana **atau** sinyal adoption rendah | Mode Porsi perlu disederhanakan (misalnya hybrid) atau diganti sebagai default. Jangan paksa sebagai core wedge. |
| Banyak confusion pada konsep “porsi” | Pertimbangkan relabeling atau onboarding yang lebih kuat; uji ulang jika perlu. |

**Aturan**: T3 tidak boleh berdiri sendiri. Hasilnya diinterpretasikan bersama T1 (kompetitor) dan T2 (kesediaan & frekuensi masalah).

---

## 4. Estimasi Durasi dan Effort (Asumsi Perencanaan)

| Aktivitas | Estimasi Durasi | Effort (Orang-hari) | Catatan |
|-----------|-----------------|---------------------|---------|
| T1 – Setup trial + teardown 4 pemain utama | 5–8 hari kerja | 4–6 orang-hari | Bisa paralel dengan rekrutmen T2 |
| T2 – Rekrutmen 15–20 partisipan | 7–12 hari | 5–8 orang-hari | Termasuk screening & jadwal |
| T2 – Pelaksanaan wawancara + contextual inquiry | 8–12 hari | 8–12 orang-hari | 2 sesi/hari realistis |
| T2 – Analisis & sintesis temuan | 3–5 hari | 3–4 orang-hari | Termasuk coding tema |
| T3 – Desain prototipe klikable | 3–5 hari | 3–5 orang-hari | Bisa mulai setelah insight awal T2 |
| T3 – Testing 5–8 partisipan + analisis | 3–5 hari | 3–4 orang-hari | |
| **Total end-to-end (paralel optimal)** | **3–5 minggu** | **26–40 orang-hari** | Asumsi 1–2 researcher full-time + dukungan rekrutmen |

**Asumsi perencanaan**:
- 1 product researcher dedicated + 1 pendukung rekrutmen/lapangan.
- Tidak termasuk waktu legal/izin rekaman atau perjalanan antar kota yang signifikan.
- Buffer 20–30% disarankan untuk keterlambatan rekrutmen.

---

## 5. Ringkasan Go / No-Go Terintegrasi

Keputusan wedge Mode Porsi **hanya** boleh diambil setelah ketiga tahap selesai dan hasilnya diintegrasikan:

| Kondisi | Implikasi untuk Mode Porsi |
|---------|---------------------------|
| T1 menunjukkan kompetitor sudah punya auto-disable customer di harga terjangkau **+** T2 menunjukkan kesediaan input rendah **+** T3 friction tinggi | **Stop** atau pivot signifikan. |
| T1 ruang masih ada **+** T2 kesediaan & frekuensi oversell memadai **+** T3 task success & preference positif | Lanjutkan Mode Porsi sebagai default provisional di scope MVP. |
| Hasil campur (satu tahap mendukung, tahap lain melemahkan) | Lakukan iterasi terbatas (misalnya sederhanakan input) lalu uji ulang cepat sebelum mengunci. |

**Pernyataan penutup**:  
Desain validasi ini adalah instrumen untuk mengurangi risiko. Tidak ada rekomendasi “lanjut MVP final” di dokumen ini. Semua keputusan scope menunggu data primer yang terukur dari T1–T3.

---

*Dokumen ini disusun untuk keperluan perencanaan validasi internal. Estimasi durasi dan effort bersifat asumsi dan dapat disesuaikan dengan kapasitas tim.*
