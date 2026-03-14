-- ============================================================
-- CoreInventory: Fix RLS insert policies and ensure required ids
-- Run after 001_ensure_schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure required id columns exist on core tables.
ALTER TABLE products ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE receipts ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE deliveries ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE transfers ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE adjustments ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();
ALTER TABLE stock_ledger ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid();

-- Replace generic FOR ALL policies with explicit policies that include WITH CHECK.
DROP POLICY IF EXISTS products_user_isolation ON products;
DROP POLICY IF EXISTS receipts_user_isolation ON receipts;
DROP POLICY IF EXISTS deliveries_user_isolation ON deliveries;
DROP POLICY IF EXISTS transfers_user_isolation ON transfers;
DROP POLICY IF EXISTS adjustments_user_isolation ON adjustments;
DROP POLICY IF EXISTS stock_ledger_user_isolation ON stock_ledger;
DROP POLICY IF EXISTS warehouses_user_isolation ON warehouses;
DROP POLICY IF EXISTS product_stocks_user_isolation ON product_stocks;

CREATE POLICY products_select_own ON products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY products_insert_own ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY products_update_own ON products FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY products_delete_own ON products FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY warehouses_select_own ON warehouses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY warehouses_insert_own ON warehouses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY warehouses_update_own ON warehouses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY warehouses_delete_own ON warehouses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY receipts_select_own ON receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY receipts_insert_own ON receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY receipts_update_own ON receipts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY receipts_delete_own ON receipts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY deliveries_select_own ON deliveries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY deliveries_insert_own ON deliveries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY deliveries_update_own ON deliveries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY deliveries_delete_own ON deliveries FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY transfers_select_own ON transfers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY transfers_insert_own ON transfers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY transfers_update_own ON transfers FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY transfers_delete_own ON transfers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY adjustments_select_own ON adjustments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY adjustments_insert_own ON adjustments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY adjustments_update_own ON adjustments FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY adjustments_delete_own ON adjustments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY stock_ledger_select_own ON stock_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY stock_ledger_insert_own ON stock_ledger FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY stock_ledger_update_own ON stock_ledger FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY stock_ledger_delete_own ON stock_ledger FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY product_stocks_select_own ON product_stocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY product_stocks_insert_own ON product_stocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY product_stocks_update_own ON product_stocks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY product_stocks_delete_own ON product_stocks FOR DELETE USING (auth.uid() = user_id);
