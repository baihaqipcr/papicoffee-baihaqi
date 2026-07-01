# 🗄️ PAPICOFFEE DATABASE SCHEMA REFERENCE

## Quick Overview

```
TABLES CREATED: 7
├── tier_rules (4 rows) ........... Master tier levels
├── menus (12 rows) .............. Menu catalog
├── cafe_info (1 row) ............ Public cafe info
├── customers (0 rows*) ......... Main customer table
├── customer_preferences (0 rows*) . Customer settings
├── transactions (0 rows*) ....... Purchase records
└── loyalty_points (0 rows*) ..... Points ledger

* Will be populated after Auth & testing

INDEXES CREATED: 10
RELATIONSHIPS: 7 (Foreign Keys)
RLS STATUS: Enabled (policies added in Phase 2)
```

---

## Table Schemas

### 1. tier_rules (Master Table)
```
PK: id (SERIAL)
├── tier_level: INT (1-4, UNIQUE)
├── tier_name: VARCHAR(50)
│   └─ "Baru", "Aktif", "VIP", "Exclusive"
├── min_order_count: INT (activation criteria)
├── min_total_spent: INT (activation criteria)
├── min_poin_balance: INT
├── poin_multiplier: DECIMAL(2,1) [1.0 - 2.0]
├── diskon_default: INT (percent 0-15)
├── priority_service: BOOLEAN
└── description: TEXT
```
**Usage:** Referenced by customers.tier_level

---

### 2. menus (Master Table)
```
PK: id (SERIAL)
├── nama_menu: VARCHAR(100) [UNIQUE]
├── kategori: VARCHAR(50)
│   └─ "Kopi", "Non-Kopi", "Makanan", "Dessert"
├── deskripsi: TEXT
├── harga: INT [CHECK > 0]
├── poin_reward: INT (default 10)
├── visible: BOOLEAN (untuk public display)
├── is_favorite_available: BOOLEAN
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```
**Usage:** Referenced via transactions.items (JSONB)

---

### 3. cafe_info (Public Table)
```
PK: id (SERIAL)
├── nama_cafe: VARCHAR(100) = "PapiCoffee"
├── deskripsi: TEXT
├── alamat: TEXT
├── jam_buka: TIME (06:00)
├── jam_tutup: TIME (21:00)
├── nomor_telepon: VARCHAR(15)
├── email_kontak: VARCHAR(100)
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```
**Usage:** Public read, displayed on guest page

---

### 4. customers (Main Table)
```
PK: id (SERIAL)
├── user_id: UUID [UNIQUE, FK → auth.users(id)]
│   └─ ON DELETE CASCADE
├─ PERSONAL INFO
├── nama: VARCHAR(100)
├── no_hp: VARCHAR(15) [UNIQUE]
├── email: VARCHAR(100)
├── tanggal_lahir: DATE
├─ MEMBER STATUS
├── tipe_pelanggan: VARCHAR(20)
│   └─ "Aktif", "VIP", "Baru", "Dormant"
├── tier_level: INT [FK → tier_rules(tier_level)]
├── tanggal_daftar: DATE
├─ PREFERENCES
├── menu_favorit: VARCHAR(100)
├── tingkat_gula_favorit: VARCHAR(20)
│   └─ "Minim", "Normal", "Banyak"
├─ LOYALTY POINTS
├── saldo_poin: INT (current balance)
├── total_poin_earned: INT (lifetime total)
├─ STATUS & AUDIT
├── is_active: BOOLEAN
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

INDEXES:
├── idx_customers_user_id
├── idx_customers_tipe
└── idx_customers_tier
```
**Relationships:**
- user_id → auth.users (1:1)
- tier_level → tier_rules (many:1)
- 1 → many customer_preferences
- 1 → many transactions
- 1 → many loyalty_points

---

### 5. customer_preferences (Settings)
```
PK: id (SERIAL)
├── customer_id: INT [UNIQUE, FK → customers(id)]
│   └─ ON DELETE CASCADE
├── menu_favorit_ids: INT[] (array of menu.id)
├── tingkat_gula_default: VARCHAR(20)
│   └─ "Minim", "Normal", "Banyak"
├── tingkat_panas_default: VARCHAR(20)
│   └─ "Dingin", "Suam", "Panas"
├── email_notification: BOOLEAN (default true)
├── sms_notification: BOOLEAN (default false)
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

INDEX: idx_customer_pref_customer_id
```
**Usage:** Store customer's preferred settings

---

### 6. transactions (Purchase Records)
```
PK: id (SERIAL)
├── customer_id: INT [FK → customers(id)]
│   └─ ON DELETE CASCADE
├── tanggal_transaksi: TIMESTAMP
├── total_harga: INT [CHECK > 0]
├── poin_diperoleh: INT
├── items: JSONB
│   └─ Format: [{"menu_id": 1, "qty": 2, "harga": 15000, "gula": "Normal"}]
├── status: VARCHAR(20)
│   └─ "pending", "completed", "cancelled"
├── payment_method: VARCHAR(20)
├── notes: TEXT
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

INDEXES:
├── idx_transactions_customer_id
└── idx_transactions_date
```
**Usage:** Record each customer purchase

---

### 7. loyalty_points (Points Ledger)
```
PK: id (SERIAL)
├── customer_id: INT [FK → customers(id)]
│   └─ ON DELETE CASCADE
├── jumlah_poin: INT (positive or negative)
├── tipe_transaksi: VARCHAR(50)
│   └─ "pembelian", "referral", "bonus", "redeem", "expired"
├── keterangan: TEXT (reason/description)
├── transaction_id: INT [FK → transactions(id), nullable]
│   └─ ON DELETE SET NULL
├── tanggal_transaksi: TIMESTAMP
├── tanggal_expired: DATE
├── is_valid: BOOLEAN
└── created_at: TIMESTAMP

INDEXES:
├── idx_loyalty_customer_id
└── idx_loyalty_valid (on is_valid, tanggal_expired)
```
**Usage:** Track all points transactions

---

## Entity Relationship Diagram

```
┌──────────────────────┐
│   auth.users         │ (Supabase built-in)
│  (UUID, email, etc)  │
└─────────┬────────────┘
          │ 1:1
          │ user_id
          │
    ┌─────▼──────────────────┐
    │   customers            │
    │ (Main table)           │
    │                        │
    │ - nama, email, no_hp   │
    │ - tier_level (FK)      │
    │ - saldo_poin, ...      │
    └────┬──────┬────────┬───┘
         │      │        │
      1:1│   1:many   1:many
         │      │        │
    ┌────▼──┐   │    ┌───▼──────────┐
    │ cust_ │   │    │ loyalty_     │
    │ pref  │   │    │ points       │
    └───────┘   │    └──────────────┘
                │
            ┌───▼──────────┐
            │ transactions │
            │              │
            │ items: JSONB │
            │ (→ menus)    │
            └──────────────┘

┌──────────────┐
│ tier_rules   │ ← Referenced by customers.tier_level
├──────────────┤
│ 1: Baru      │
│ 2: Aktif     │
│ 3: VIP       │
│ 4: Exclusive │
└──────────────┘

┌──────────────┐
│ menus        │ ← Referenced via transactions.items (JSONB)
├──────────────┤
│ 12 items     │
│ (Kopi, etc)  │
└──────────────┘

┌──────────────┐
│ cafe_info    │ ← Public (displayed on guest page)
├──────────────┤
│ 1 record     │
└──────────────┘
```

---

## Sample Data Summary

### Tier Rules (4 records)
```
Tier 1: Baru       (min 0 order, 0 spent, 1.0x multiplier, 0% diskon)
Tier 2: Aktif      (min 5 order, 150K spent, 1.25x multiplier, 5% diskon)
Tier 3: VIP        (min 20 order, 500K spent, 1.5x multiplier, 10% diskon)
Tier 4: Exclusive  (min 50 order, 1.5M spent, 2.0x multiplier, 15% diskon)
```

### Menus (12 records)
```
KOPI (5 items):
- Kopi Sanger (15K, 15 poin)
- Black Orange (18K, 18 poin)
- Latte Vanilla (20K, 20 poin)
- Cappuccino (22K, 22 poin)
- Espresso (12K, 12 poin)

NON-KOPI (3 items):
- Teh Tarik (10K, 10 poin)
- Es Jeruk Peras (12K, 12 poin)
- Iced Latte (18K, 18 poin)

MAKANAN (1 item):
- Croissant Butter (25K, 25 poin)

DESSERT (3 items):
- Donat Coklat (15K, 15 poin)
- Kue Lapis (20K, 20 poin)
- Brownies (18K, 18 poin)
```

### Cafe Info (1 record)
```
Nama: PapiCoffee
Alamat: Jl. Merdeka No. 42, Jakarta Pusat
Jam: 06:00 - 21:00
Telepon: 0812-3456-7890
Email: hello@papicoffee.id
```

---

## Key Constraints & Rules

### Data Validation
```
✅ tier_level: 1-4 only
✅ kategori: 'Kopi', 'Non-Kopi', 'Makanan', 'Dessert' only
✅ tipe_pelanggan: 'Aktif', 'VIP', 'Baru', 'Dormant' only
✅ tingkat_gula: 'Minim', 'Normal', 'Banyak' only
✅ tingkat_panas: 'Dingin', 'Suam', 'Panas' only
✅ harga: Must be > 0
✅ total_harga: Must be > 0
✅ no_hp: Unique per customer
✅ nama_menu: Unique (no duplicate menus)
✅ user_id: Unique (1 customer = 1 user)
```

### Foreign Key Constraints
```
✅ customers.user_id → auth.users(id) [CASCADE DELETE]
✅ customers.tier_level → tier_rules(tier_level)
✅ customer_preferences.customer_id → customers(id) [CASCADE DELETE]
✅ transactions.customer_id → customers(id) [CASCADE DELETE]
✅ loyalty_points.customer_id → customers(id) [CASCADE DELETE]
✅ loyalty_points.transaction_id → transactions(id) [SET NULL]
```

---

## Indexes for Performance

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| idx_customers_user_id | customers | user_id | Fast lookup by auth user |
| idx_customers_tipe | customers | tipe_pelanggan | Filter by customer type |
| idx_customers_tier | customers | tier_level | Filter by tier |
| idx_customer_pref_customer_id | customer_preferences | customer_id | Fast lookup preferences |
| idx_loyalty_customer_id | loyalty_points | customer_id | Get points by customer |
| idx_loyalty_valid | loyalty_points | is_valid, tanggal_expired | Find valid/expired points |
| idx_transactions_customer_id | transactions | customer_id | Get customer transactions |
| idx_transactions_date | transactions | tanggal_transaksi | Filter by date |
| idx_menus_kategori | menus | kategori | Filter by category |
| idx_menus_visible | menus | visible | Show public menus only |

---

## SQL Query Examples

### Get Customer Profile
```sql
SELECT c.id, c.nama, c.email, c.tier_level, c.saldo_poin, tr.tier_name, tr.diskon_default
FROM customers c
JOIN tier_rules tr ON c.tier_level = tr.tier_level
WHERE c.user_id = 'uuid-here';
```

### Get Customer's Recent Transactions
```sql
SELECT t.id, t.tanggal_transaksi, t.total_harga, t.poin_diperoleh, t.status
FROM transactions t
WHERE t.customer_id = 42
ORDER BY t.tanggal_transaksi DESC
LIMIT 10;
```

### Get Available Menus by Category
```sql
SELECT id, nama_menu, harga, poin_reward
FROM menus
WHERE kategori = 'Kopi' AND visible = true
ORDER BY nama_menu;
```

### Calculate Customer Tier Eligibility
```sql
SELECT c.id, c.nama, c.saldo_poin,
  (SELECT COUNT(*) FROM transactions WHERE customer_id = c.id) as order_count,
  (SELECT COALESCE(SUM(total_harga), 0) FROM transactions WHERE customer_id = c.id) as total_spent
FROM customers c
WHERE c.is_active = true
ORDER BY total_spent DESC;
```

---

## RLS Status

### Current State
```
✅ RLS ENABLED on all tables
✅ Basic public policies on menus & cafe_info
⏳ Full policies will be added in Phase 2
```

### Phase 2 Policies (Coming Soon)
```
🔒 customers: Member see own, Admin see all
🔒 customer_preferences: Member see own only
🔒 transactions: Member see own, Admin see all
🔒 loyalty_points: Member see own, Admin see all
🔓 menus: Public read (already done)
🔓 cafe_info: Public read (already done)
🔓 tier_rules: Public read (reference data)
```

---

## Backup & Recovery

**Supabase Automatic Backups:**
- Daily snapshots (7 days retention)
- Point-in-time recovery available
- Check: Project Settings → Backups

**Manual Export:**
```bash
# Dump schema & data
pg_dump postgresql://user:password@host/db > backup.sql

# Restore
psql postgresql://user:password@host/db < backup.sql
```

---

## Performance Considerations

### Query Optimization Tips
1. Always use indexes (don't filter by non-indexed fields unnecessarily)
2. Limit result sets with LIMIT/OFFSET
3. Use customer_id for filtering transactions (indexed)
4. Use tanggal_transaksi for date-range queries (indexed)

### Scaling Strategy (Future)
- Table partitioning by year for transactions
- Archive old loyalty_points (> 2 years)
- Read replicas for reporting queries

---

## Related Files

- `supabase-migration.sql` - Full migration script
- `VERIFY_DATABASE.sql` - Verification queries
- `DATABASE_SETUP_GUIDE.md` - Setup instructions
- [src/lib/supabase.js](../src/lib/supabase.js) - React client config

---

**Last Updated:** 2026-06-25  
**Version:** 1.0  
**Status:** Ready for Deployment ✅
