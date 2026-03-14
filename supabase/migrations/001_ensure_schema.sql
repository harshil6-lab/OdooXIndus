-- ============================================================
-- CoreInventory: Ensure all required columns exist
-- Run this in the Supabase SQL Editor to fix schema mismatches
-- ============================================================

-- ==================== PRODUCTS ====================
-- Required: name, sku, category, price, reorder_level, user_id, created_at
-- Also needed by app: stock, warehouse_id, updated_at
ALTER TABLE products ADD COLUMN IF NOT EXISTS name        text NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku         text NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS category    text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price       numeric NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reorder_level integer NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id     uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock       integer NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS warehouse_id uuid;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at  timestamptz DEFAULT now();

-- ==================== RECEIPTS ====================
-- Required: product_id, warehouse_id, quantity, note, user_id, created_at
-- Also needed by app: supplier, reference
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS product_id   uuid NOT NULL;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS warehouse_id  uuid;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS quantity      integer NOT NULL DEFAULT 0;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS note          text;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS user_id       uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS supplier      text;
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS reference     text;

-- ==================== DELIVERIES ====================
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS product_id   uuid NOT NULL;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS warehouse_id  uuid;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS quantity      integer NOT NULL DEFAULT 0;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS customer      text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS reference     text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS note          text;
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS user_id       uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();

-- ==================== TRANSFERS ====================
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS product_id              uuid NOT NULL;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS source_warehouse_id      uuid NOT NULL;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS destination_warehouse_id uuid NOT NULL;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS quantity                 integer NOT NULL DEFAULT 0;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS reference               text;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS note                    text;
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS user_id                 uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS created_at              timestamptz NOT NULL DEFAULT now();

-- ==================== ADJUSTMENTS ====================
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS product_id      uuid NOT NULL;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS warehouse_id     uuid;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS previous_stock   integer NOT NULL DEFAULT 0;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS new_stock        integer NOT NULL DEFAULT 0;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS difference       integer NOT NULL DEFAULT 0;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS reason           text;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS reference        text;
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS user_id          uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS created_at       timestamptz NOT NULL DEFAULT now();

-- ==================== STOCK LEDGER ====================
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS product_id      uuid NOT NULL;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS warehouse_id     uuid;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS operation_type   text NOT NULL;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS quantity_delta   integer NOT NULL DEFAULT 0;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS balance_after    integer;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS reference_id     uuid;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS reference_type   text;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS note             text;
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS user_id          uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS created_at       timestamptz NOT NULL DEFAULT now();

-- ==================== WAREHOUSES ====================
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS name          text NOT NULL DEFAULT '';
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS code          text;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS location      text;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS capacity      integer;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS current_usage integer;
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS user_id       uuid NOT NULL REFERENCES auth.users(id);
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS updated_at    timestamptz DEFAULT now();

-- ==================== PRODUCT_STOCKS (for transfers) ====================
CREATE TABLE IF NOT EXISTS product_stocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL,
  warehouse_id uuid NOT NULL,
  stock       integer NOT NULL DEFAULT 0,
  user_id     uuid NOT NULL REFERENCES auth.users(id),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(product_id, warehouse_id)
);

-- ==================== ROW LEVEL SECURITY ====================
-- Enable RLS on all tables (idempotent)
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_ledger   ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_stocks ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own rows
DO $$ BEGIN
  -- Products
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'products_user_isolation') THEN
    CREATE POLICY products_user_isolation ON products FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Receipts
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'receipts_user_isolation') THEN
    CREATE POLICY receipts_user_isolation ON receipts FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Deliveries
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'deliveries_user_isolation') THEN
    CREATE POLICY deliveries_user_isolation ON deliveries FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Transfers
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'transfers_user_isolation') THEN
    CREATE POLICY transfers_user_isolation ON transfers FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Adjustments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'adjustments_user_isolation') THEN
    CREATE POLICY adjustments_user_isolation ON adjustments FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Stock Ledger
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'stock_ledger_user_isolation') THEN
    CREATE POLICY stock_ledger_user_isolation ON stock_ledger FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Warehouses
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'warehouses_user_isolation') THEN
    CREATE POLICY warehouses_user_isolation ON warehouses FOR ALL USING (auth.uid() = user_id);
  END IF;
  -- Product Stocks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'product_stocks_user_isolation') THEN
    CREATE POLICY product_stocks_user_isolation ON product_stocks FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
