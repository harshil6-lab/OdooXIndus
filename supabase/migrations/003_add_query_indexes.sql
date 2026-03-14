-- ============================================================
-- CoreInventory: Add indexes for common filters and sorting
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_created_at ON products(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_warehouses_user_id ON warehouses(user_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_user_created_at ON warehouses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_user_created_at ON receipts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_user_created_at ON deliveries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transfers_user_id ON transfers(user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_user_created_at ON transfers(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_adjustments_user_id ON adjustments(user_id);
CREATE INDEX IF NOT EXISTS idx_adjustments_user_created_at ON adjustments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_ledger_user_created_at ON stock_ledger(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_stocks_user_product_warehouse ON product_stocks(user_id, product_id, warehouse_id);