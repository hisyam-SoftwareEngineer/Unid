# DEMO PACK v1.1: Amandemen Teknis (menggantikan Bagian 3, 4, 5.4, 5.6, 6, 7 dari v1)

Tanggal: 4 Nov 2026 · Status: **draft, menunggu review manusia** · Jalur: DEMO
Label: [FAKTA] [HIPOTESIS] [BELUM TERVERIFIKASI]. 🔍 = wajib review manusia (AI tidak menyatakan "aman").

Dokumen ini = v1 + perbaikan 6 blocker, 10 masalah mayor, dan celah panduan. Bagian v1 yang tidak disebut di sini tetap berlaku.

---

## 0. Prinsip arsitektur (mengikat semua kartu)

1. **Server-authoritative.** Semua baca/tulis data bisnis lewat server (Prisma). Browser hanya memegang sesi Auth dan sinyal Realtime.
2. **Satu pintu per mutasi kritis:** `confirmPayment()` (satu-satunya yang boleh menulis `paid`), `reserveStock()`, `nextPickupCode()`, `releaseToQueue()`, `getAvailability()`, `calculateBill()`.
3. **Kebenaran tidak bergantung job latar.** Ketersediaan dan status efektif benar walau sweeper mati.
4. **Hal yang mahal diubah setelah freeze dipaku sekarang:** `outlet_id` di semua tabel tenant, enum cadangan V2, zona waktu per outlet, penamaan snake_case.
5. **Urutan kunci global** (hindari deadlock): `idempotency advisory → tables → payments → stock_items (urut id) → daily_counters`.

## 1. Keputusan baru (lanjutan tabel Bagian 0 v1)

| # | Keputusan | Status |
|---|---|---|
| 10 | Dua jalur data: Prisma (server) dan Supabase JS (hanya Auth + Realtime SELECT whitelist). Customer tanpa jalur DB | Usulan |
| 11 | Customer memantau status lewat polling adaptif (Broadcast ditunda) | Usulan |
| 12 | Hari bisnis = zona outlet, cutoff default 03:00 (`dayCutoffMinutes=180`). Menjawab pertanyaan terbuka #5 | **Perlu persetujuan manusia** |
| 13 | Kode unik berlaku untuk `transfer_proof` dan `manual_qris`, dijamin unik oleh indeks DB | Usulan |
| 14 | Demo tanpa pembatalan setelah `queued` dan tanpa "ganti metode bayar" (batal lalu pesan ulang) | **Perlu persetujuan manusia** |
| 15 | Payment `rejected` membatalkan order dan bill, customer pesan ulang | Usulan |
| 16 | Migrasi hanya lewat Prisma Migrate (termasuk SQL mentah). Supabase CLI hanya untuk stack lokal | Usulan |

### ADR-0005: Pola akses data
- **Konteks:** Prisma tersambung sebagai role DB yang mem-bypass RLS, sedangkan Realtime menghormati RLS.
- **Keputusan:** Tulis dan baca bisnis = Prisma di server setelah otorisasi di service. Browser staf boleh `SELECT` tabel whitelist untuk memicu refetch. Payload Realtime tidak pernah jadi sumber data.
- **Konsekuensi:** pindah ke Node/VPS (ADR-0003) cukup membungkus `server/services`. RLS = lapisan pertahanan + Realtime, bukan satu-satunya kontrol.

### ADR-0003 (placeholder, agar penomoran tidak berlubang)
Hybrid Node/VPS **ditunda sampai pilot**. Tulis konteks dan opsi saat pilot direncanakan.

### ADR-0004 (tambahan pada v1)
- Hash SHA-256 hanya anti-pakai-ulang file identik; mengubah satu piksel mengalahkannya. Kontrol sesungguhnya: pencocokan mutasi, nominal unik, jendela waktu.
- Hash dihitung **di server**. MIME diperiksa dari magic bytes, bukan dari klaim klien.

---

## 2. Skema Prisma v1.1 (pengganti Bagian 3)

Aturan global: id dan FK `@db.Uuid`, default `gen_random_uuid()`; tabel `@@map` snake_case plural; kolom `@map` snake_case. Indeks parsial dan trigger hidup di SQL migrasi (Bagian 3), bukan di Prisma.

```prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooler :6543 ?pgbouncer=true&connection_limit=1
  directUrl = env("DIRECT_URL")     // hanya migrasi
}

enum Role              { kasir pemilik logistik }
enum OrderType         { dine_in takeaway }
enum OrderSource       { customer walk_in }
enum OrderStatus       { placed queued preparing ready completed cancelled expired voided } // voided = RESERVED V2
enum PaymentTiming     { pay_first pay_after }
enum BillStatus        { open awaiting_payment paid void }
enum PaymentMethod     { sandbox manual_qris transfer_proof cash }
enum PaymentStatus     { pending awaiting_verification awaiting_cash paid rejected expired cancelled refunded } // refunded = RESERVED V2
enum StockType         { portion ingredient }
enum MovementType      { opening consume adjust waste void_return }  // void_return = RESERVED V2
enum ReservationStatus { held confirmed released }

model Outlet {
  id               String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  slug             String   @unique
  name             String
  timezone         String   @default("Asia/Jakarta")
  dayCutoffMinutes Int      @default(180) @map("day_cutoff_minutes")
  createdAt        DateTime @default(now()) @map("created_at")
  @@map("outlets")
}

model Profile {
  id       String @id @db.Uuid                       // = auth.users.id
  outletId String @map("outlet_id") @db.Uuid
  role     Role
  name     String
  outlet   Outlet @relation(fields: [outletId], references: [id])
  @@map("profiles")
}

model Category {
  id        String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId  String @map("outlet_id") @db.Uuid
  name      String
  sortOrder Int    @default(0) @map("sort_order")
  items     MenuItem[]
  outlet    Outlet @relation(fields: [outletId], references: [id])
  @@map("categories")
}

model MenuItem {
  id            String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId      String  @map("outlet_id") @db.Uuid
  categoryId    String  @map("category_id") @db.Uuid
  name          String
  price         Int
  imageUrl      String? @map("image_url")
  isActive      Boolean @default(true) @map("is_active")
  manualSoldOut Boolean @default(false) @map("manual_sold_out")
  outlet        Outlet  @relation(fields: [outletId], references: [id])
  category      Category @relation(fields: [categoryId], references: [id])
  variants      MenuVariant[]
  stockItem     StockItem?
  @@map("menu_items")
}

model MenuVariant {
  id         String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId   String @map("outlet_id") @db.Uuid
  menuItemId String @map("menu_item_id") @db.Uuid
  name       String
  priceDelta Int    @default(0) @map("price_delta")
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  @@map("menu_variants")
}

model Table {
  id           String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId     String    @map("outlet_id") @db.Uuid
  label        String
  tableToken   String    @unique @map("table_token")   // 16 byte acak, base64url 22 char
  tokenRotated DateTime? @map("token_rotated")
  outlet       Outlet    @relation(fields: [outletId], references: [id])
  @@map("tables")
}

model Bill {
  id            String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId      String        @map("outlet_id") @db.Uuid
  tableId       String?       @map("table_id") @db.Uuid
  paymentTiming PaymentTiming @default(pay_first) @map("payment_timing")
  status        BillStatus    @default(open)
  subtotal      Int
  discountTotal Int           @default(0) @map("discount_total")  // diskon bisnis; BUKAN kode unik
  taxTotal      Int           @default(0) @map("tax_total")
  serviceTotal  Int           @default(0) @map("service_total")
  total         Int
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")
  paidAt        DateTime?     @map("paid_at")
  orders        Order[]
  payments      Payment[]
  @@unique([id, outletId])
  @@map("bills")
}

model Order {
  id           String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  billId       String      @map("bill_id") @db.Uuid
  outletId     String      @map("outlet_id") @db.Uuid
  tableId      String?     @map("table_id") @db.Uuid
  type         OrderType
  source       OrderSource @default(customer)
  status       OrderStatus @default(placed)
  sessionId    String      @map("session_id")        // dari cookie sid terbitan server
  customerName String?     @map("customer_name")
  pickupCode   String      @map("pickup_code")
  businessDate DateTime    @map("business_date") @db.Date
  note         String?
  createdAt    DateTime    @default(now()) @map("created_at")
  updatedAt    DateTime    @updatedAt @map("updated_at")
  queuedAt     DateTime?   @map("queued_at")
  bill         Bill        @relation(fields: [billId, outletId], references: [id, outletId])
  items        OrderItem[]
  @@unique([outletId, businessDate, pickupCode])
  @@unique([id, outletId])
  @@index([outletId, status])
  @@index([sessionId, status])
  @@index([tableId, status])
  @@map("orders")
}

model OrderItem {
  id           String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  orderId      String   @map("order_id") @db.Uuid
  outletId     String   @map("outlet_id") @db.Uuid
  menuItemId   String   @map("menu_item_id") @db.Uuid
  variantId    String?  @map("variant_id") @db.Uuid
  nameSnapshot String   @map("name_snapshot")
  unitPrice    Int      @map("unit_price")
  qty          Int
  note         String?
  order        Order    @relation(fields: [orderId, outletId], references: [id, outletId])
  reservation  StockReservation?
  @@map("order_items")
}

model Payment {
  id                 String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  billId             String        @map("bill_id") @db.Uuid
  outletId           String        @map("outlet_id") @db.Uuid
  method             PaymentMethod
  status             PaymentStatus @default(pending)
  amount             Int                                  // = bill.total - uniqueCodeDiscount
  uniqueCodeDiscount Int           @default(0) @map("unique_code_discount")
  idempotencyKey     String        @map("idempotency_key")
  requestHash        String        @map("request_hash")   // hash payload; key sama + payload beda = 409
  expiresAt          DateTime      @map("expires_at")
  holdExtensions     Int           @default(0) @map("hold_extensions")
  verifiedBy         String?       @map("verified_by") @db.Uuid
  verifiedAt         DateTime?     @map("verified_at")
  mutationNote       String?       @map("mutation_note")
  rejectReason       String?       @map("reject_reason")
  amountReceived     Int?          @map("amount_received")
  changeAmount       Int?          @map("change_amount")
  createdAt          DateTime      @default(now()) @map("created_at")
  updatedAt          DateTime      @updatedAt @map("updated_at")
  bill               Bill          @relation(fields: [billId, outletId], references: [id, outletId])
  proof              PaymentProof?
  @@unique([outletId, idempotencyKey])
  @@index([status, expiresAt])
  @@index([outletId, status])
  @@map("payments")
}

model PaymentProof {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  paymentId   String   @unique @map("payment_id") @db.Uuid
  outletId    String   @map("outlet_id") @db.Uuid
  storagePath String   @map("storage_path")
  sha256      String                      // dihitung SERVER
  mime        String                      // hasil magic bytes SERVER
  sizeBytes   Int      @map("size_bytes") // ukuran objek di Storage
  uploadedAt  DateTime @default(now()) @map("uploaded_at")
  payment     Payment  @relation(fields: [paymentId], references: [id])
  @@unique([outletId, sha256])
  @@map("payment_proofs")
}

model StockItem {
  id           String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId     String      @map("outlet_id") @db.Uuid
  menuItemId   String?     @unique @map("menu_item_id") @db.Uuid
  type         StockType   @default(portion)
  name         String
  unit         String      @default("porsi")
  menuItem     MenuItem?   @relation(fields: [menuItemId], references: [id])
  movements    StockMovement[]
  reservations StockReservation[]
  @@map("stock_items")
}

// Append-only (trigger DB, lihat SQL M9)
model StockMovement {
  id            String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId      String       @map("outlet_id") @db.Uuid
  stockItemId   String       @map("stock_item_id") @db.Uuid
  type          MovementType
  qty           Int                              // bertanda
  businessDate  DateTime     @map("business_date") @db.Date
  orderId       String?      @map("order_id") @db.Uuid
  reservationId String?      @unique @map("reservation_id") @db.Uuid  // consume ganda mustahil
  reason        String?
  createdBy     String?      @map("created_by") @db.Uuid
  createdAt     DateTime     @default(now()) @map("created_at")
  stockItem     StockItem    @relation(fields: [stockItemId], references: [id])
  @@index([stockItemId, businessDate])
  @@map("stock_movements")
}

model StockReservation {
  id           String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId     String            @map("outlet_id") @db.Uuid
  stockItemId  String            @map("stock_item_id") @db.Uuid
  orderItemId  String            @unique @map("order_item_id") @db.Uuid
  qty          Int
  status       ReservationStatus @default(held)
  businessDate DateTime          @map("business_date") @db.Date
  expiresAt    DateTime          @map("expires_at")
  createdAt    DateTime          @default(now()) @map("created_at")
  stockItem    StockItem         @relation(fields: [stockItemId], references: [id])
  orderItem    OrderItem         @relation(fields: [orderItemId], references: [id])
  @@index([stockItemId, businessDate, status])
  @@index([status, expiresAt])
  @@map("stock_reservations")
}

model AuditLog {                                  // append-only
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  outletId  String   @map("outlet_id") @db.Uuid
  actorId   String?  @map("actor_id") @db.Uuid
  action    String
  entity    String
  entityId  String   @map("entity_id")
  meta      Json?
  createdAt DateTime @default(now()) @map("created_at")
  @@index([outletId, createdAt])
  @@map("audit_logs")
}

model DailyCounter {                              // pickupCode atomik
  outletId     String   @map("outlet_id") @db.Uuid
  businessDate DateTime @map("business_date") @db.Date
  key          String
  value        Int      @default(0)
  @@id([outletId, businessDate, key])
  @@map("daily_counters")
}

model RateLimitBucket {
  key         String
  windowStart DateTime @map("window_start")
  count       Int      @default(0)
  @@id([key, windowStart])
  @@map("rate_limit_buckets")
}
```

Catatan: `Profile.id` bukan FK Prisma ke `auth.users` (skema `auth` dikelola Supabase). Seed menjamin kesesuaian. 🔍 Verifikasi manusia: `prisma migrate dev` tidak boleh men-drop indeks parsial dan trigger di Bagian 3.

---

## 3. SQL migrasi mentah (satu berkas per langkah, urut)

**3.1 Shim (agar shadow DB Prisma tidak gagal; di Supabase asli tidak berefek)**
```sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='auth') THEN
    CREATE SCHEMA auth;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $f$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $f$;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname='supabase_realtime') THEN CREATE PUBLICATION supabase_realtime; END IF;
END $$;
```

**3.2 Hardening hak akses + RLS** 🔍
```sql
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
GRANT SELECT ON orders, payments, stock_movements, stock_reservations, audit_logs TO authenticated;

CREATE FUNCTION public.current_outlet_id() RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT outlet_id FROM profiles WHERE id = (SELECT auth.uid()) $$;
CREATE FUNCTION public.current_role_name() RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS
$$ SELECT role::text FROM profiles WHERE id = (SELECT auth.uid()) $$;

-- aktifkan RLS di SEMUA tabel; tabel tanpa policy = default deny
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_read ON orders FOR SELECT TO authenticated
  USING (outlet_id = (SELECT current_outlet_id()) AND (SELECT current_role_name()) IN ('kasir','pemilik'));
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_read ON payments FOR SELECT TO authenticated
  USING (outlet_id = (SELECT current_outlet_id()) AND (SELECT current_role_name()) IN ('kasir','pemilik'));
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_read ON stock_movements FOR SELECT TO authenticated
  USING (outlet_id = (SELECT current_outlet_id()));
ALTER TABLE stock_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY staff_read ON stock_reservations FOR SELECT TO authenticated
  USING (outlet_id = (SELECT current_outlet_id()));
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY owner_read ON audit_logs FOR SELECT TO authenticated
  USING (outlet_id = (SELECT current_outlet_id()) AND (SELECT current_role_name()) = 'pemilik');
-- tabel lain: ENABLE ROW LEVEL SECURITY tanpa policy

ALTER PUBLICATION supabase_realtime ADD TABLE orders, payments, stock_movements, stock_reservations;
```
Catatan: matriks v1 mengizinkan logistik melihat ledger tetapi bukan antrean; policy di atas mengikuti itu. Tidak ada GRANT tulis ke role mana pun.

**3.3 Indeks parsial kode unik (B1)**
```sql
CREATE UNIQUE INDEX payments_active_amount_uq ON payments (outlet_id, amount)
WHERE unique_code_discount > 0 AND status IN ('pending','awaiting_verification');
```

**3.4 Ketersediaan stok (satu rumus)**
```sql
CREATE FUNCTION available_portions(p_item uuid, p_date date) RETURNS int LANGUAGE sql STABLE AS $$
  SELECT (COALESCE((SELECT SUM(qty) FROM stock_movements WHERE stock_item_id=p_item AND business_date=p_date),0)
        - COALESCE((SELECT SUM(qty) FROM stock_reservations
                    WHERE stock_item_id=p_item AND business_date=p_date AND status='held' AND expires_at > now()),0))::int $$;
```

**3.5 Trigger append-only dan status final (M9)** 🔍
```sql
CREATE FUNCTION forbid_mutation() RETURNS trigger LANGUAGE plpgsql AS
$$ BEGIN RAISE EXCEPTION '% bersifat append-only', TG_TABLE_NAME USING ERRCODE='42501'; END $$;
CREATE TRIGGER stock_movements_append_only BEFORE UPDATE OR DELETE ON stock_movements FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER audit_logs_append_only      BEFORE UPDATE OR DELETE ON audit_logs      FOR EACH ROW EXECUTE FUNCTION forbid_mutation();

CREATE FUNCTION forbid_leaving_final() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status::text = ANY (TG_ARGV) AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Status final % tidak boleh berubah', OLD.status USING ERRCODE='23514';
  END IF; RETURN NEW; END $$;
CREATE TRIGGER payments_final BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION forbid_leaving_final('paid','rejected','expired','cancelled');
CREATE TRIGGER orders_final   BEFORE UPDATE ON orders   FOR EACH ROW EXECUTE FUNCTION forbid_leaving_final('completed','cancelled','expired');
CREATE TRIGGER reservations_final BEFORE UPDATE ON stock_reservations FOR EACH ROW EXECUTE FUNCTION forbid_leaving_final('confirmed','released');
```
Trigger sengaja kecil agar graf transisi tetap satu sumber (TS). V2 melonggarkan `paid → refunded`. Sebelum pilot: role runtime terbatas (INSERT/SELECT saja di tabel append-only).

**3.6 Hari bisnis**
```sql
CREATE FUNCTION business_date(p_outlet uuid) RETURNS date LANGUAGE sql STABLE AS $$
  SELECT ((now() AT TIME ZONE o.timezone) - make_interval(mins => o.day_cutoff_minutes))::date
  FROM outlets o WHERE o.id = p_outlet $$;
```

**3.7 Storage bucket privat `payment-proofs`:** `file_size_limit` 2 MB, `allowed_mime_types` JPEG/PNG, tanpa policy `storage.objects` untuk anon/authenticated.

---

## 4. Kontrak Zod v1.1 (pengganti Bagian 4)

```ts
import { z } from "zod";
const rupiah = z.number().int().nonnegative();
const uuid = z.string().uuid();
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const OrderLineInput = z.object({
  menuItemId: uuid, variantId: uuid.optional(),
  qty: z.number().int().min(1).max(10),
  note: z.string().max(140).optional(),
});

// sessionId dihapus: berasal dari cookie `sid` bertanda tangan server
export const CreateOrderInput = z.object({
  tableToken: z.string().regex(/^[A-Za-z0-9_-]{22}$/).optional(),
  type: z.enum(["dine_in", "takeaway"]),
  customerName: z.string().trim().max(40).optional(),
  items: z.array(OrderLineInput).min(1).max(30),
  method: z.enum(["sandbox", "manual_qris", "transfer_proof", "cash"]),
  idempotencyKey: z.string().min(16).max(64),
}).refine(v => v.items.reduce((a, i) => a + i.qty, 0) <= 30, { message: "Maksimal 30 porsi per pesanan" });

// tahap 1 upload: tidak ada mime/size/hash dari klien
export const ProofInitInput = z.object({ paymentId: uuid });
export const ProofFinalizeInput = z.object({ paymentId: uuid, objectPath: z.string().max(200) });

export const VerifyPaymentInput = z.object({
  paymentId: uuid,
  decision: z.enum(["valid", "reject"]),
  mutationAmount: rupiah.optional(),               // wajib untuk valid pada transfer_proof/manual_qris
  mutationNote: z.string().max(40).optional(),
  rejectReason: z.string().max(140).optional(),
}).refine(v => v.decision !== "reject" || !!v.rejectReason, { message: "Alasan penolakan wajib diisi", path: ["rejectReason"] });

export const ReceiveCashInput = z.object({ paymentId: uuid, amountReceived: rupiah });
export const ExtendHoldInput = z.object({ paymentId: uuid });

export const SetDailyStockInput = z.object({
  businessDate: day,                               // server hanya menerima hari bisnis ini atau +1
  entries: z.array(z.object({ menuItemId: uuid, portions: z.number().int().min(0).max(999) })).min(1),
});

export const AdvanceOrderInput = z.object({ orderId: uuid, to: z.enum(["preparing", "ready", "completed"]) });
export const CancelPlacedOrderInput = z.object({ orderId: uuid });   // hanya status 'placed'
```
Aturan service (bukan Zod): `valid` non-tunai wajib `mutationAmount === payment.amount` atau `AMOUNT_MISMATCH` 422.

---

## 5. Spesifikasi logika kritis 🔍

### 5.1 `createOrder` (satu transaksi, urutan tetap)
1. Advisory lock `pg_advisory_xact_lock(hashtextextended(outletId||idempotencyKey,0))`; cari payment lama. Ada dan `requestHash` sama → kembalikan hasil lama (200). Hash beda → `IDEMPOTENCY_CONFLICT` 409.
2. Validasi `tableToken` → `FOR UPDATE` baris `tables`; hitung order `placed` per meja (maks 3 belum bayar, maks 1 tunai aktif); per `sid` maks 3.
3. `calculateBill` dari harga DB. Periksa `isActive`, `manualSoldOut`.
4. `reserveStock` (5.2).
5. Insert bill, order, items, reservasi, payment (TTL per metode; `allocateUniqueCode` bila berlaku).
6. `nextPickupCode` **terakhir** (kunci counter ditahan sesingkat mungkin).
7. Audit. Tidak ada I/O jaringan di dalam transaksi.

`withTx` retry maksimal 3× untuk P2002 (kode unik/idempotensi), P2034, 40001, 40P01; pilihan kode unik dihitung ulang tiap percobaan.

### 5.2 `reserveStock` (B2)
```ts
const need = new Map<string, number>();            // agregasi per stockItem (satu menu bisa banyak baris)
for (const l of lines) if (l.stockItemId) need.set(l.stockItemId, (need.get(l.stockItemId) ?? 0) + l.qty);
const ids = [...need.keys()].sort();               // urutan konsisten
if (!ids.length) return;                           // menu tanpa StockItem = tak terbatas
await tx.$queryRaw`SELECT id FROM stock_items WHERE id = ANY(${ids}::uuid[]) ORDER BY id FOR UPDATE`;
const rows = await tx.$queryRaw<{id:string; available:number}[]>`
  SELECT id, available_portions(id, ${bd}::date) AS available FROM stock_items WHERE id = ANY(${ids}::uuid[])`;
const short = rows.filter(r => r.available < need.get(r.id)!);
if (short.length) throw new AppError("OUT_OF_STOCK", { items: short.map(r => ({ id: r.id, available: Math.max(r.available, 0) })) });
```
Aturan: isolasi default READ COMMITTED; setiap aksi yang **mengurangi** ketersediaan (reservasi baru, `opening` diturunkan) wajib mengunci baris yang sama; yang menambah (release/expire) tidak. Hanya `FOR UPDATE` dan `pg_advisory_xact_lock` (jangan advisory lock level sesi di pooler). Ketersediaan negatif ditampilkan 0/HABIS.

### 5.3 `confirmPayment` (B5, satu-satunya jalur ke `paid`)
```ts
export async function confirmPayment(tx: Tx, paymentId: string, actor: Actor, ev: ConfirmEvidence) {
  const p = await lockPayment(tx, paymentId);                 // SELECT … FOR UPDATE
  if (p.status === "paid") return { replay: true };           // klik ganda aman
  assertTransition(p.status, "paid");
  assertEvidence(p, ev);                                      // mutasi (non-tunai) / nominal diterima (tunai)
  if (p.expiresAt <= new Date()) throw new AppError("PAYMENT_EXPIRED");
  const now = new Date();
  await tx.payment.update({ where: { id: p.id }, data: { status: "paid", verifiedBy: actor.id, verifiedAt: now, ...ev.fields } });
  const bill = await tx.bill.update({ where: { id: p.billId }, data: { status: "paid", paidAt: now } });
  const rs = await tx.stockReservation.findMany({
    where: { status: "held", orderItem: { order: { billId: p.billId } } },
    include: { orderItem: { include: { order: true } } } });
  for (const r of rs) {
    await tx.stockReservation.update({ where: { id: r.id }, data: { status: "confirmed" } });
    await tx.stockMovement.create({ data: { outletId: p.outletId, stockItemId: r.stockItemId, type: "consume", qty: -r.qty,
      businessDate: r.orderItem.order.businessDate, orderId: r.orderItem.orderId, reservationId: r.id } });
  }
  for (const o of await tx.order.findMany({ where: { billId: p.billId } })) await releaseToQueue(tx, o, bill);
  await writeAudit(tx, { outletId: p.outletId, action: ev.auditAction, entity: "payment", entityId: p.id, actorId: actor.id, meta: ev.auditMeta });
  return { replay: false };
}
```
Aturan: sandbox, verifikasi kasir, dan tunai semuanya memanggil fungsi ini. Lint melarang `status: "paid"` di luar berkas ini.
**Reservasi sudah kedaluwarsa tetapi masih `held`:** `confirmPayment` memeriksa `expiresAt` payment (yang menjadi acuan), jadi reservasi tidak mungkin sudah dilepas sweeper tanpa payment ikut `expired`; sweeper selalu mengubah keduanya atomik.
**Bayar terlambat (validator lambat):** ditolak `PAYMENT_EXPIRED`; UI menyarankan order walk-in. Cegah dengan perpanjangan (5.6) dan catat audit `payment.expired_with_proof`.

### 5.4 Kode unik (B1)
Berlaku untuk `transfer_proof` dan `manual_qris`; `total < 1000` atau `TRANSFER_UNIQUE_CODE=off` → kode 0. Pilih acak dari 1–99 yang `total-d` tidak dipakai payment aktif atau payment berumur < 24 jam; 99 slot habis → `SYSTEM_BUSY` 503. Race ditangkap indeks 3.3 dan di-retry. `bill.total` tidak berubah dan kode unik **tidak** masuk `discountTotal`. Teks UI: *"Bayar tepat Rp24.983 (potongan kode unik Rp17). Nominal harus persis agar dikenali."* Status [HIPOTESIS].

### 5.5 Hari bisnis dan `pickupCode` (B4)
`businessDate` dihitung sekali di SQL (3.6) dan disimpan di order; `consume` selalu memakai `order.businessDate`. Di kode, tanggal = string `YYYY-MM-DD`. Counter:
```sql
INSERT INTO daily_counters (outlet_id, business_date, key, value) VALUES ($1,$2,'pickup',1)
ON CONFLICT (outlet_id, business_date, key) DO UPDATE SET value = daily_counters.value + 1 RETURNING value;
```
Format `A-{n:03}` dine-in, `B-{n:03}` takeaway; >999 lanjut 4 digit. Rollback ikut membatalkan kenaikan (tanpa lubang).

### 5.6 TTL (menyempurnakan 5.6 v1)
| Metode | TTL awal | Perpanjangan |
|---|---|---|
| sandbox | 10 menit | tidak |
| manual_qris | 10 menit | saat "Sudah bayar": `expiresAt = max(expiresAt, now+15m)` sekali |
| transfer_proof | 15 menit | setelah finalize bukti: `now+30m` sekali |
| cash | 20 menit | tidak |
Validator juga bisa **Perpanjang +15 menit** maksimal 2× (`holdExtensions`), diaudit. Celah v1 yang ditutup: klaim manual_qris di menit ke-9 hanya menyisakan 1 menit untuk validator.

### 5.7 Alur turunan yang belum ada di v1
- **Payment `rejected`:** reservasi `released`, order `cancelled`, bill `void` (satu transaksi). Customer memesan ulang.
- **Pembatalan `placed` (customer/kasir):** payment `cancelled`, reservasi `released`, order `cancelled`, bill `void`.
- **Setelah `queued`:** tidak ada pembatalan di demo (B6). Alur void = V2 memakai `void_return`, `refunded`, `voided` (enum sudah dicadangkan).
- **Ganti metode bayar:** tidak ada; batal lalu pesan ulang (keranjang tersimpan di klien).

### 5.8 Kedaluwarsa tiga lapis (M6)
1. `available_portions()` memfilter `expires_at > now()`. Ini yang menjamin kebenaran.
2. Baca status menghitung `effectiveStatus` (non-final & lewat `expiresAt` → `expired`); semua aksi memeriksa ulang `expiresAt`. Jalur baca **tidak pernah menulis**.
3. Sweeper (`POST /api/cron/expire`, header `CRON_SECRET`):
```sql
SELECT id FROM payments WHERE status IN ('pending','awaiting_verification','awaiting_cash') AND expires_at <= now()
ORDER BY expires_at LIMIT 50 FOR UPDATE SKIP LOCKED;
-- per baris: payment→expired, reservasi→released, order→expired, bill→void, audit
```
Pemicu: penjadwal eksternal tiap 1–5 menit (GitHub Actions cron atau layanan cron gratis) + oportunistik saat staf memuat antrean. [BELUM TERVERIFIKASI] Cron Vercel Hobby biasanya terbatas harian dan `pg_cron` di tier gratis perlu dicek; sweeper tetap opsional bagi kebenaran karena lapis 1–2.

### 5.9 Upload bukti (M1, M2) 🔍
1. `POST proof/init`: periksa payment, status, dan kepemilikan (orderId + cookie); buat path `{outletId}/{paymentId}/{uuid}.jpg`; kembalikan signed upload URL.
2. Klien kompres (canvas → JPEG sisi maks 1600px, kualitas 0.8, biasanya < 500 KB) lalu unggah langsung ke Storage.
3. `POST proof/finalize`: server mengunduh objek, memeriksa ukuran dan magic bytes (`FF D8 FF` JPEG, `89 50 4E 47 0D 0A 1A 0A` PNG), hitung SHA-256, insert `PaymentProof`, set `awaiting_verification`, perpanjang TTL (5.6). Gagal/duplikat → hapus objek, `PROOF_INVALID`/`PROOF_DUPLICATE`.
Validator melihat bukti via signed URL 60 detik, dibuat saat satu item dibuka.

### 5.10 Sesi, batas, rate limit (M3 M4 M5) 🔍
- Cookie `sid` httpOnly, Secure, SameSite=Lax: 16 byte acak + HMAC-SHA256 (`SESSION_SECRET`, `timingSafeEqual`), diterbitkan oleh middleware untuk `/m/*` dan route publik. [BELUM TERVERIFIKASI] nama/posisi middleware pada versi Next.js yang dipakai.
- **Baca** status = `orderId` (UUID v4, capability URL). **Tulis** (bukti, klaim, batal) = `orderId` + cookie.
- Batas per-sesi hanyalah kenyamanan (cookie bisa dihapus); **kontrol keamanan = batas per-meja** di dalam transaksi.
- `tableToken` 16 byte acak (22 char). QR statis bisa difoto, jadi ada batas: qty baris 1–10, ≤ 30 porsi per order, ≤ 3 order belum bayar per meja, ≤ 1 order tunai aktif per meja.
- Rate limit lewat `RateLimitBucket` (window tetap, satu upsert atomik) di balik interface `RateLimiter` agar bisa diganti Upstash:

| Endpoint | per sid | per IP |
|---|---|---|
| `POST orders` | 6 / 10 mnt | 30 / 10 mnt |
| `proof/*` | 10 / 10 mnt | 30 / 10 mnt |
| `GET status` | 40 / mnt | 200 / mnt |
| `GET menu` | — | 120 / mnt |
Batas IP sengaja longgar (WiFi warung/CGNAT). IP dari header terpercaya platform. Semua angka [HIPOTESIS], setel dari log demo.

### 5.11 Realtime
- **Staf:** `postgres_changes` pada `orders` dan `payments`, filter `outlet_id`. Payload hanya pemicu refetch. Cadangan: polling 10 dtk, refetch saat `online`/`visibilitychange`.
- **Customer:** hook `useOrderStatus(orderId)`: polling 3 dtk (2 menit pertama) → 5 → 10 dtk; berhenti di status final; jeda saat tab tersembunyi; `If-None-Match` (ETag `status+updated_at`); backoff sampai 15 dtk pada 429/5xx dengan banner "Menyambung ulang…". UI hanya mengenal hook ini, sehingga ganti ke Broadcast tidak menyentuh komponen.

### 5.12 Sandbox aman (M7)
`APP_ENV` (`demo|production`) dan `PAYMENT_SANDBOX_ENABLED`. `env.ts` menolak boot bila `APP_ENV=production` dan sandbox aktif. Endpoint simulasi 404 saat nonaktif; banner **SIMULASI** di UI. Demo dan pilot memakai dua project Supabase terpisah. Jangan andalkan `NODE_ENV`.

### 5.13 Pooler dan hosting (M10)
Prisma via pooler transaksi + `directUrl` untuk migrasi; singleton di `globalThis`. Jaga transaksi pendek (maks `timeout: 10000`). Region fungsi Vercel didekatkan ke DB (mis. `sin1` bila Supabase di Singapura) [BELUM TERVERIFIKASI ketersediaan per plan]; latensi lintas benua pada transaksi 6–8 statement lebih berbahaya daripada batas durasi. Batas body, durasi, dan ToS Hobby (komersial) dicek manual dari halaman resmi sebelum D-01.

---

## 6. Struktur proyek dan konvensi

```
src/
  app/ m/[outlet]/[token]/   (staff)/kasir|logistik|login/   api/public|staff|cron/
  server/ contracts/ services/ db/ auth/ errors/ config/env.ts
  client/ hooks/ api/
prisma/ schema.prisma migrations/ seed.ts
supabase/config.toml        # stack lokal saja
tests/ unit integration rls concurrency e2e
```
Lint `no-restricted-imports`: `app/api → services → db`; `services` tanpa `next/*` dan `react`; `client` hanya boleh mengimpor `server/contracts`. Mutasi = Route Handler (bukan Server Action). Kepemilikan: A = `api/public`, kasir, payments, billing; B = stock, logistik; **beku & bersama** = `contracts`, `schema.prisma`, `errors`.

**Endpoint**

| Method + path | Auth | Catatan |
|---|---|---|
| `GET /api/public/m/{outlet}/{token}/menu` | — | menu + available |
| `POST /api/public/orders` | sid | 201; replay 200 |
| `GET /api/public/orders/{id}` | orderId | status, effectiveStatus, ETag |
| `POST /api/public/orders/{id}/cancel` | orderId+sid | hanya `placed` |
| `POST /api/public/payments/{id}/claim-paid` | orderId+sid | manual_qris |
| `POST /api/public/payments/{id}/simulate-paid` | flag env | sandbox |
| `POST /api/public/payments/{id}/proof/init`, `/finalize` | orderId+sid | 5.9 |
| `GET /api/staff/queue`, `/payments/pending` | kasir/pemilik | |
| `GET /api/staff/payments/{id}/proof-url` | kasir/pemilik | 60 dtk |
| `POST /api/staff/payments/{id}/verify`, `/receive-cash`, `/extend-hold` | kasir/pemilik | |
| `POST /api/staff/orders`, `/orders/{id}/advance` | kasir/pemilik | walk-in; maju saja |
| `GET /api/staff/stock`, `PUT /api/staff/stock/daily`, `POST /api/staff/menu/{id}/sold-out` | logistik/pemilik (+kasir toggle) | |
| `POST /api/cron/expire` | `CRON_SECRET` | 5.8 |

**Error:** `{ "error": { "code", "message", "details?" } }`, pesan Indonesia terpusat di `messages.id.ts`, `requestId` di log.
`VALIDATION_FAILED` 422 · `UNAUTHENTICATED` 401 · `FORBIDDEN` 403 · `TABLE_TOKEN_INVALID` 404 · `RATE_LIMITED`/`TOO_MANY_UNPAID` 429 · `OUT_OF_STOCK`/`ITEM_UNAVAILABLE` 409 · `PAYMENT_EXPIRED`/`PAYMENT_STATE_INVALID` 409 · `AMOUNT_MISMATCH` 422 · `PROOF_DUPLICATE` 409 · `PROOF_INVALID` 422 · `IDEMPOTENCY_CONFLICT` 409 · `SYSTEM_BUSY` 503 · `INTERNAL` 500.

**Env (divalidasi Zod, gagal-boot):** `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (nama kunci mengikuti dashboard Supabase), `SUPABASE_SERVICE_ROLE_KEY` (server only, `import 'server-only'`), `SESSION_SECRET` (≥32 byte), `CRON_SECRET`, `APP_ENV`, `PAYMENT_SANDBOX_ENABLED`, `TRANSFER_UNIQUE_CODE`, `PAY_BANK_NAME/ACCOUNT/HOLDER`, `QRIS_STATIC_IMAGE_PATH` (menjawab pertanyaan terbuka #2), `SEED_*_PASSWORD`.

**Seed:** outlet → kategori/menu/varian → meja (token acak 16 byte) → user Auth via `supabase.auth.admin.createUser` (idempoten) + `Profile.id` = id Auth → (M2) `StockItem` + `opening` hari ini. Menolak jalan bila `APP_ENV=production`; mencetak URL tiap meja.

**Strategi test:** integrasi/konkurensi di Postgres nyata (Docker) dengan shim 3.1, reset lewat template DB (TRUNCATE diblokir trigger); RLS di `supabase start` (`SET LOCAL ROLE authenticated` + claim `sub`); E2E Playwright = skrip demo. Invarian SQL di akhir tiap test integrasi: tidak ada `paid` tanpa `consume` (kecuali item tak terbatas); tidak ada baris dengan `outlet_id` berbeda dari induknya; `available ≥ 0` untuk item tanpa reservasi kedaluwarsa.

---

## 7. Task card revisi (ukuran relatif S/M/L)

Setiap kartu wajib memuat **Kontrak beku** dan **Di luar scope** sesuai template MVP.md Bagian 6.

| ID | Tugas | Uk | Bergantung | 🔍 |
|---|---|---|---|---|
| D-00 | Project Supabase (demo) + stack lokal + Vercel + secret (manusia) | S | — | |
| D-01 | Repo, tooling, lint batas impor, `env.ts` | S | D-00 | |
| D-02a | Skema Prisma v1.1 + migrasi awal | L | D-01 | ✔ |
| D-02b | SQL mentah 3.1–3.7 | M | D-02a | ✔ |
| D-02c | Seed (user Auth, menu, meja) | M | D-02a | |
| D-03 | Auth + `requireRole` + test RLS/GRANT | M | D-02b | ✔ |
| D-04 | Zod v1.1, `errors`, `calculateBill`, `withTx`, kerangka service | M | D-02a | |
| D-05a | Customer: menu | M | D-04 | |
| D-05b | Customer: keranjang + checkout UI | M | D-05a | |
| D-06a | Sesi `sid`, `RateLimiter`, batas per-meja | M | D-04 | ✔ |
| D-06b | `createOrder` (5.1) + `nextPickupCode` | L | D-06a | ✔ |
| D-07 | `confirmPayment` + Sandbox + claim ManualQris + alur 5.7 | L | D-06b | ✔ |
| D-08a | Proof init/finalize + bucket | M | D-07 | ✔ |
| D-08b | Alokator kode unik + indeks | S | D-06b | ✔ |
| D-09 | Tunai (kembalian server) | S | D-07 | ✔ |
| D-10 | Kasir: Verifikasi (nominal diketik, perpanjang hold) | M | D-07, D-08a | |
| D-11 | Kasir: antrean + walk-in | M | D-07 | |
| D-12a | Endpoint status + `useOrderStatus` | S | D-06b | |
| D-12b | Customer: halaman status + bayar | M | D-12a | |
| D-14 | `reserveStock`, sweeper, tes konkurensi | L | D-06b | ✔ |
| D-13 | Logistik: isi stok pagi + salin kemarin (mengunci stok bila menurunkan) | M | D-14 | |
| D-15 | Menu otomatis HABIS + toggle manual | S | D-14 | |
| D-16 | Rekap (opsional) | S | D-14 | |
| D-17 | E2E skrip demo | M | D-12b, D-15 | |

M1 berjalan dengan menu tanpa `StockItem` (tak terbatas), sehingga M1 tidak menunggu M2.

**AC tambahan yang wajib masuk kartu terkait**
- D-14: 20 `createOrder` paralel stok 1 → tepat 1 sukses; A`[x,y]` vs B`[y,x]` ×50 → tanpa deadlock; satu order dua baris menu sama (2+2, stok 3) → ditolak.
- D-07: `confirmPayment` dua kali paralel → satu efek; error paksa di langkah ke-4 → rollback total; status `paid` tanpa `consume` tidak ada.
- D-08b: 100 payment paralel dengan total sama → semua nominal berbeda; `TRANSFER_UNIQUE_CODE=off` → kode 0.
- D-06b: kunci idempotensi sama + payload beda → 409; dua request identik bersamaan → satu order.
- D-03: sebagai `authenticated`, INSERT/UPDATE/DELETE semua tabel ditolak; outlet B tidak melihat outlet A; logistik tidak `SELECT payments`; `anon` ditolak.
- D-10: `valid` tanpa `mutationAmount` sama persis → `AMOUNT_MISMATCH`.

---

## 8. Keputusan dan verifikasi untuk manusia

1. Setujui keputusan 12 dan 14 (cutoff 03:00; tanpa pembatalan setelah `queued`; tanpa ganti metode).
2. Setujui kode unik untuk `manual_qris` + `transfer_proof` (status [HIPOTESIS], flag env).
3. Verifikasi: indeks parsial dan trigger tidak di-drop `prisma migrate dev`; region Vercel; batas body/durasi dan ToS Hobby; nama kunci Supabase terbaru; opsi penjadwal sweeper; posisi middleware Next.js.
4. Perbarui `MVP.md` (empat implementasi PaymentProvider) dan tulis ADR-0003.
5. Tinjau area 🔍 dengan checklist: urutan kunci, atomisitas `confirmPayment`, GRANT/RLS, upload bukti, trigger, rate limit.
6. **Risiko sisa yang tidak bisa dihapus software:** validator mengetik nominal sesuai layar tanpa membuka mutasi; QR meja statis yang difoto pihak lain (dibatasi, tidak dihilangkan); hash bukti dikalahkan perubahan satu piksel.

Checklist siap coding (ubah dari v1): `[ ]` manusia membekukan Bagian 2 dan 4 dokumen ini · `[ ]` D-00 selesai · `[ ]` butir 3 di atas terverifikasi.
