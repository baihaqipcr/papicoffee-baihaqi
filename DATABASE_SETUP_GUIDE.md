# 📚 DATABASE SETUP EXECUTION GUIDE

## Step 1: Database Setup - PapiCoffee Schema Migration

**Status:** Ready for Deployment  
**Date:** 2026-06-25  
**Files:** `supabase-migration.sql`

---

## 🚀 HOW TO EXECUTE THE MIGRATION

### Option A: Using Supabase Web UI (Recommended for Beginners)

#### 1. Open Supabase Dashboard
- Go to https://app.supabase.com
- Login dengan akun Anda
- Select project **PapiCoffee** (atau project Supabase Anda)

#### 2. Navigate to SQL Editor
- Klik **SQL Editor** di sidebar kiri
- Klik **New Query** (icon `+`)

#### 3. Copy & Paste Migration Script
- Buka file: `supabase-migration.sql` di editor
- Copy **seluruh konten** (Ctrl+A, Ctrl+C)
- Paste ke Supabase SQL Editor (Ctrl+V)

#### 4. Execute Query
- Klik tombol **RUN** atau tekan `Ctrl+Enter`
- Tunggu hingga script selesai (~2-5 detik)
- Jika tidak ada error, schema berhasil dibuat ✅

#### 5. Verify Schema
- Klik tab **Table Editor** di sidebar
- Scroll down, pastikan ada tabel:
  - `tier_rules`
  - `menus`
  - `cafe_info`
  - `customers`
  - `customer_preferences`
  - `transactions`
  - `loyalty_points`

---

### Option B: Using Supabase CLI (For Advanced Users)

#### Prerequisites
```bash
# Install Supabase CLI (jika belum)
npm install -g supabase

# Login ke Supabase
supabase login
```

#### Execute Migration
```bash
# Arahkan ke folder project
cd c:\baihaqi-praktikum

# Run migration
supabase db push supabase-migration.sql
```

---

## ⚙️ VERIFICATION CHECKLIST

### 1. Check Tables Created
Buka **SQL Editor** dan run query:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```
**Expected Result:** 7 tables harus terlihat

### 2. Check Sample Data
```sql
SELECT COUNT(*) as tier_count FROM tier_rules;
SELECT COUNT(*) as menu_count FROM menus;
SELECT COUNT(*) as cafe_count FROM cafe_info;
```
**Expected:** 4 tiers, 12 menus, 1 cafe info

### 3. Check Indexes
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('customers', 'menus', 'transactions') 
ORDER BY indexname;
```
**Expected:** ~8-10 indexes harus ada

### 4. Test React Connectivity (Opsional)
Di React app, buka console dan jalankan:
```javascript
// Di browser console
import { supabase } from './lib/supabase.js'

// Test query menus
const { data, error } = await supabase
  .from('menus')
  .select('*')
  .limit(3)

console.log(data, error)
```
**Expected:** Array dengan 3 menu items akan tampil

---

## 📋 SCHEMA OVERVIEW

### Tables Created

| Table | Purpose | Rows |
|-------|---------|------|
| `tier_rules` | Master tier system | 4 |
| `menus` | Daftar menu kafe | 12 |
| `cafe_info` | Public cafe information | 1 |
| `customers` | Main customer data | 0 (akan diisi via Auth) |
| `customer_preferences` | Customer settings | 0 |
| `transactions` | Purchase history | 0 |
| `loyalty_points` | Points ledger | 0 |

### Key Relationships

```
auth.users (Supabase Built-in)
    ↓
    └─→ customers (1:1)
         ├─→ customer_preferences (1:1)
         ├─→ transactions (1:many)
         │   └─→ menus (many:many via JSONB items)
         └─→ loyalty_points (1:many)

tier_rules (referenced by customers)
menus (public read)
cafe_info (public read)
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Column 'user_id' does not exist in referenced table"
**Cause:** `auth.users` table belum ada (jarang terjadi di Supabase)  
**Solution:** Refresh page, atau contact Supabase support

### Error: "Relation 'tier_rules' already exists"
**Cause:** Script sudah dirun sebelumnya  
**Solution:** 
- Uncomment DROP statements di awal script
- Run script lagi

### Error: "unique violation for nom_menu"
**Cause:** Mencoba insert menu dengan nama yang sama  
**Solution:** Script already has `ON CONFLICT DO NOTHING`, aman untuk rerun

### Query takes too long / timeout
**Cause:** Database sedang overload  
**Solution:** 
- Tunggu beberapa saat
- Atau run script yang lebih kecil (bagian demi bagian)

---

## 🔒 SECURITY NOTES

### RLS Status
- ✅ RLS enabled di semua tabel
- ⏳ RLS policies akan ditambahkan di **Phase 2** (Auth Integration)
- ⏳ Saat ini, hanya basic public policies untuk `menus` dan `cafe_info`

### What's NOT Protected Yet
- Customers data dapat dibaca siapa saja
- Transactions dapat ditulis tanpa auth
- Loyalty points dapat dimodifikasi tanpa validation

**→ JANGAN DEPLOY KE PRODUCTION sampai Phase 2 selesai!**

---

## 📝 SCHEMA CHANGES SUMMARY

### Tables Added
- [ ] tier_rules (4 tier levels)
- [ ] menus (12 menu items)
- [ ] cafe_info (1 cafe record)
- [ ] customers (linked to auth.users)
- [ ] customer_preferences
- [ ] transactions
- [ ] loyalty_points

### Indexes Added
- [ ] customers.user_id
- [ ] customers.tipe_pelanggan
- [ ] customers.tier_level
- [ ] customer_preferences.customer_id
- [ ] loyalty_points.customer_id
- [ ] loyalty_points.is_valid, tanggal_expired
- [ ] transactions.customer_id
- [ ] transactions.tanggal_transaksi
- [ ] menus.kategori
- [ ] menus.visible

### RLS Policies Added (Temporary)
- [ ] public_read_menus
- [ ] public_read_cafe_info
- [ ] public_read_tier_rules

---

## ✅ SIGN-OFF CHECKLIST

- [ ] Migration script sudah diexecute di Supabase
- [ ] Semua 7 tabel berhasil dibuat
- [ ] Sample data berhasil diinsert
- [ ] Indexes berhasil dibuat
- [ ] RLS enabled di semua tabel
- [ ] Verification queries semua pass
- [ ] Tidak ada error di console
- [ ] React app bisa query tabel `menus` (optional test)

---

## 🎯 NEXT STEPS

After database setup approved:
1. **Phase 2: Auth Integration** - Update Login/Register dengan Supabase Auth
2. **Phase 3: Admin Panel CRUD** - Integrasi customers table dengan form
3. **Phase 4: Member Dashboard** - Build profile & preferences
4. **Phase 5: Guest Page** - Public landing page
5. **Phase 6: Testing** - Full end-to-end testing

---

## 📞 SUPPORT

If you encounter issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Review SQL syntax at [PostgreSQL Docs](https://www.postgresql.org/docs/)
3. Contact Supabase support if database issue persists

---

**Ready? Execute the migration and report back! 🚀**
