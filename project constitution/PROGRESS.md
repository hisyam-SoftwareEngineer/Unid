# PROGRESS

Diperbarui: 7 Nov 2026 · Status keseluruhan: P0 APPROVED; P1, P2, P3 DONE-MENUNGGU-REVIEW. Berikutnya setelah APPROVED: Bagian 2 (P8).
Status yang sah: NOT-STARTED, IN-PROGRESS, PARTIAL, DONE-MENUNGGU-REVIEW, APPROVED (hanya manusia).
Pack 2 menggantikan P4, P6, P7 Pack 1 (L1 + fitur). Pack v2.1 menambah DL dan SL.

## A. Tabel P0-P14 (Pack 1)

| Prompt | Keluaran | Status | Prasyarat | LANJUTKAN DARI | Catatan |
|---|---|---|---|---|---|
| P0 | 00-context.md, PROGRESS.md, OPEN-QUESTIONS.md | APPROVED (pengguna: "lanjut", 6 Nov 2026) | | | Lihat Q-001..Q-015 |
| P1 | 01-prd-master.md | **DONE-MENUNGGU-REVIEW** | P0 | | 8 metrik, 12 risiko |
| P2 | 02-actors-journeys-permissions.md | **DONE-MENUNGGU-REVIEW** | P1 | | 9 perjalanan; Q-016..Q-019 |
| P3 | 03-business-rules.md | **DONE-MENUNGGU-REVIEW** | P1 | | 87 BR; Q-020..Q-025 |
| P4 | digantikan L1-CUS + F-CUS-01..10 | NOT-STARTED | lihat Bagian C | | |
| P5 | 11-module-payment.md | NOT-STARTED | P2, P3 | | Lihat Q-014 |
| P6 | digantikan L1-KAS + F-KAS-01..09 | NOT-STARTED | lihat Bagian C | | |
| P7 | digantikan L1-LOG + F-LOG-01..08 | NOT-STARTED | lihat Bagian C | | |
| P8 | 14-module-access-auth.md | NOT-STARTED | P2 | | Dikerjakan paling awal setelah P2 |
| P9 | 15-module-platform.md | NOT-STARTED | P4-P8 | | |
| P10 | 16-demo-scenario-acceptance.md | NOT-STARTED | P4-P9 | | |
| P11 | 20-nfr.md | NOT-STARTED | P9 | | |
| P12 | 21-traceability-matrix.md | NOT-STARTED | P4-P11 | | Tambah kolom LR dan DL/SL |
| P13 | 22-consistency-review.md | NOT-STARTED | P12 | | |
| P14 | 30-task-cards-v2.md | NOT-STARTED | P13 APPROVED | | |

## B. Spesifikasi logika domain (DL, setelah P5, urutan ini)

| ID | Berkas | Status | Prasyarat | 🔍 |
|---|---|---|---|---|
| DL-ORD | logic/DL-ORD.md | NOT-STARTED | P0-P3, P5 | ya |
| DL-PAY | logic/DL-PAY.md | NOT-STARTED | P0-P3, P5 | ya |
| DL-STK | logic/DL-STK.md | NOT-STARTED | P0-P3, P5 | ya |
| DL-QUE | logic/DL-QUE.md | NOT-STARTED | P0-P3, P5 | tidak |
| DL-CODE | logic/DL-CODE.md | NOT-STARTED | P0-P3, P5 | ya |
| DL-EXP | logic/DL-EXP.md | NOT-STARTED | P0-P3, P5 | tidak |
| DL-SES | logic/DL-SES.md | NOT-STARTED | P0-P3, P5 | ya |
| DL-UPL | logic/DL-UPL.md | NOT-STARTED | P0-P3, P5 | ya |

## C. Level 1 modul dan fitur (Pack 2)

| ID | Berkas | Status | Prasyarat |
|---|---|---|---|
| L1-CUS | modules/customer/_module.md | NOT-STARTED | P0-P3, P5 |
| L1-KAS | modules/kasir/_module.md | NOT-STARTED | P0-P3, P5 |
| L1-LOG | modules/logistik/_module.md | NOT-STARTED | P0-P3 |
| F-CUS-01..10 | modules/customer/F-CUS-nn-*.md | NOT-STARTED | L1-CUS (urutan dalam Bagian D) |
| F-KAS-01..09 | modules/kasir/F-KAS-nn-*.md | NOT-STARTED | L1-KAS |
| F-LOG-01..08 | modules/logistik/F-LOG-nn-*.md | NOT-STARTED | L1-LOG |
| SL (10) | F-CUS-04, 06, 09; F-KAS-03, 04, 06, 08, 09; F-LOG-01, 04 | NOT-STARTED | PRD fitur + DL terkait APPROVED |
| R-CUS, R-KAS, R-LOG | _rollup.md | NOT-STARTED | semua fitur modul APPROVED |
| F-ADM-01..03 | admin-pasca-demo | PASCA-DEMO, tidak dikerjakan | |

## D. Urutan eksekusi yang disarankan (dari sistem pertama dipakai ke fitur penting)

Semua urutan memenuhi prasyarat Pack. Setiap bagian berhenti di gate, menunggu "lanjut".

| Bagian | Isi | Alasan |
|---|---|---|
| 1 Fondasi produk | P1, P2, P3 | Tujuan, aktor (rumah makan), aturan bisnis |
| 2 Akses dan sesi | P8 | Hal pertama yang dipakai: login staf, token meja, sesi anonim |
| 3 Mesin aturan | P5, lalu DL-SES, DL-CODE, DL-ORD, DL-PAY, DL-UPL, DL-STK, DL-QUE, DL-EXP | Aturan uang dan stok ditulis sekali; Q-001 sudah dijawab (Opsi A, 7 Nov 2026) sehingga DL-PAY dan DL-STK dapat ditulis setelah P5 |
| 4 Customer | L1-CUS, F-CUS-01..10 (+ SL-04, 06, 09) | Alur pelanggan dari scan meja sampai status |
| 5 Kasir | L1-KAS, F-KAS-01..09 (+ SL-03, 04, 06, 08, 09) | Verifikasi, tunai, antrean, walk-in |
| 6 Logistik dan wedge | L1-LOG, F-LOG-01..08 (+ SL-01, 04) | Stok porsi dan menu HABIS otomatis |
| 7 Rakit modul | R-CUS, R-KAS, R-LOG | Konsistensi per modul |
| 8 Platform dan penutup | P9, P10, P11, P12, P13, P14 | Demo, NFR, ketertelusuran, tinjauan, task card |

Pengecualian urutan Pack: P8 dikerjakan sebelum P5 (Q-015). L1-LOG tidak perlu P5 tetapi dikerjakan di Bagian 6 agar DL-STK sudah ada.

## E. Log
- 6 Nov 2026: P0 selesai; tiga berkas dibuat; 15 pertanyaan terbuka dicatat.
- 6 Nov 2026: Bagian 1 (P1, P2, P3) selesai, menunggu review. Pertanyaan terbuka menjadi Q-001..Q-025. Berikutnya setelah APPROVED: Bagian 2 (P8 akses dan sesi).
- 7 Nov 2026: Wedge disetujui sebagai arah kerja provisional (G0 belum lolos). Verifikasi angka 77% ditangani manusia. Ambang PBJT Kota Malang dipastikan Rp15 juta (Perda 1/2025). Rekomendasi arsitektur dan MVP.md diperbarui.
