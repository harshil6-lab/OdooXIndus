export type InventoryOperationType = 'receipt' | 'delivery' | 'transfer' | 'adjustment'

export interface Product {
  id: string
  user_id: string
  name: string
  sku: string
  category: string | null
  stock: number
  reorder_level: number
  price: number
  warehouse_id: string | null
  created_at?: string
  updated_at?: string
}

export interface Warehouse {
  id: string
  user_id: string
  name: string
  code: string
  location: string | null
  capacity: number | null
  current_usage: number | null
  created_at?: string
  updated_at?: string
}

export interface Receipt {
  id: string
  user_id: string
  product_id: string
  warehouse_id: string | null
  quantity: number
  supplier: string | null
  reference: string | null
  note: string | null
  created_at?: string
}

export interface Delivery {
  id: string
  user_id: string
  product_id: string
  warehouse_id: string | null
  quantity: number
  customer: string | null
  reference: string | null
  note: string | null
  created_at?: string
}

export interface Transfer {
  id: string
  user_id: string
  product_id: string
  source_warehouse_id: string
  destination_warehouse_id: string
  quantity: number
  reference: string | null
  note: string | null
  created_at?: string
}

export interface Adjustment {
  id: string
  user_id: string
  product_id: string
  warehouse_id: string | null
  previous_stock: number
  new_stock: number
  difference: number
  reason: string | null
  reference: string | null
  created_at?: string
}

export interface StockLedgerEntry {
  id?: string
  user_id: string
  product_id: string
  warehouse_id: string | null
  operation_type: InventoryOperationType
  quantity_delta: number
  balance_after: number | null
  reference_id: string | null
  reference_type: string | null
  note: string | null
  created_at?: string
}

export interface ProductStock {
  product_id: string
  warehouse_id: string
  stock: number
  updated_at?: string
}

export interface CreateProductInput {
  name: string
  sku: string
  category?: string | null
  stock?: number
  reorder_level?: number
  price?: number
  warehouse_id?: string | null
}

export interface CreateReceiptInput {
  productId: string
  warehouseId?: string | null
  quantity: number
  supplier?: string | null
  reference?: string | null
  note?: string | null
}

export interface CreateDeliveryInput {
  productId: string
  warehouseId?: string | null
  quantity: number
  customer?: string | null
  reference?: string | null
  note?: string | null
}

export interface CreateTransferInput {
  productId: string
  sourceWarehouseId: string
  destinationWarehouseId: string
  quantity: number
  reference?: string | null
  note?: string | null
}

export interface CreateAdjustmentInput {
  productId: string
  warehouseId?: string | null
  countedStock: number
  reason?: string | null
  reference?: string | null
}

export interface ServiceError {
  message: string
  code?: string
  details?: string
}

export interface ServiceResponse<T> {
  data: T | null
  error: ServiceError | null
}

// User Profile Types
export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  role: string | null
  created_at?: string
  updated_at?: string
}

export interface CreateProfileInput {
  id: string
  email: string
  full_name?: string | null
  company_name?: string | null
  role?: string | null
}

export interface UpdateProfileInput {
  full_name?: string | null
  company_name?: string | null
  role?: string | null
}

export interface UserAccount {
  user: {
    id: string
    email: string
  } | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
}
