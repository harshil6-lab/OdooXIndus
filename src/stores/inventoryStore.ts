import { create } from 'zustand'

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  warehouse: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  reorderLevel: number
  price: number
}

export interface Receipt {
  id: string
  receiptNumber: string
  supplier: string
  date: string
  status: 'pending' | 'received' | 'verified'
  items: ReceiptItem[]
  totalItems: number
}

export interface ReceiptItem {
  productId: string
  productName: string
  quantity: number
  expectedQty: number
}

export interface DeliveryOrder {
  id: string
  orderNumber: string
  customer: string
  date: string
  status: 'pending' | 'picked' | 'packed' | 'shipped' | 'delivered'
  items: DeliveryItem[]
}

export interface DeliveryItem {
  productId: string
  productName: string
  quantity: number
  pickedQty: number
  packedQty: number
}

export interface Transfer {
  id: string
  transferNumber: string
  fromWarehouse: string
  toWarehouse: string
  date: string
  status: 'pending' | 'in-transit' | 'completed'
  items: TransferItem[]
}

export interface TransferItem {
  productId: string
  productName: string
  quantity: number
}

export interface Adjustment {
  id: string
  adjustmentNumber: string
  product: string
  location: string
  countedQty: number
  systemQty: number
  difference: number
  date: string
  status: 'pending' | 'approved'
}

export interface Movement {
  id: string
  date: string
  product: string
  operationType: 'receipt' | 'delivery' | 'transfer' | 'adjustment'
  quantity: number
  warehouse: string
  reference: string
}

export interface Warehouse {
  id: string
  name: string
  code: string
  location: string
  capacity: number
  currentUsage: number
  temperature?: string
  humidity?: string
}

interface InventoryStore {
  products: Product[]
  receipts: Receipt[]
  deliveryOrders: DeliveryOrder[]
  transfers: Transfer[]
  adjustments: Adjustment[]
  movements: Movement[]
  warehouses: Warehouse[]

  // Products
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Receipts
  addReceipt: (receipt: Receipt) => void
  updateReceipt: (id: string, receipt: Partial<Receipt>) => void

  // Delivery Orders
  addDeliveryOrder: (order: DeliveryOrder) => void
  updateDeliveryOrder: (id: string, order: Partial<DeliveryOrder>) => void

  // Transfers
  addTransfer: (transfer: Transfer) => void
  updateTransfer: (id: string, transfer: Partial<Transfer>) => void

  // Adjustments
  addAdjustment: (adjustment: Adjustment) => void
  updateAdjustment: (id: string, adjustment: Partial<Adjustment>) => void

  // Movements
  addMovement: (movement: Movement) => void

  // Warehouses
  addWarehouse: (warehouse: Warehouse) => void
  updateWarehouse: (id: string, warehouse: Partial<Warehouse>) => void
  deleteWarehouse: (id: string) => void
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  products: [
    {
      id: '1',
      name: 'Laptop Pro 15"',
      sku: 'LTP-001',
      category: 'Electronics',
      stock: 45,
      warehouse: 'Main Warehouse',
      status: 'in-stock',
      reorderLevel: 10,
      price: 1299.99,
    },
    {
      id: '2',
      name: 'USB-C Cable',
      sku: 'USB-C-01',
      category: 'Accessories',
      stock: 8,
      warehouse: 'Secondary Warehouse',
      status: 'low-stock',
      reorderLevel: 50,
      price: 12.99,
    },
    {
      id: '3',
      name: 'Wireless Mouse',
      sku: 'MOUSE-01',
      category: 'Peripherals',
      stock: 0,
      warehouse: 'Main Warehouse',
      status: 'out-of-stock',
      reorderLevel: 20,
      price: 29.99,
    },
  ],
  receipts: [
    {
      id: '1',
      receiptNumber: 'RCP-001',
      supplier: 'TechCorp Supplies',
      date: '2024-03-14',
      status: 'pending',
      items: [
        { productId: '1', productName: 'Laptop Pro 15"', quantity: 50, expectedQty: 50 },
      ],
      totalItems: 50,
    },
  ],
  deliveryOrders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customer: 'Acme Corporation',
      date: '2024-03-14',
      status: 'pending',
      items: [
        { productId: '1', productName: 'Laptop Pro 15"', quantity: 5, pickedQty: 0, packedQty: 0 },
      ],
    },
  ],
  transfers: [],
  adjustments: [],
  movements: [
    {
      id: '1',
      date: '2024-03-14',
      product: 'Laptop Pro 15"',
      operationType: 'receipt',
      quantity: 50,
      warehouse: 'Main Warehouse',
      reference: 'RCP-001',
    },
  ],
  warehouses: [
    {
      id: '1',
      name: 'Main Warehouse',
      code: 'WH-001',
      location: 'New York',
      capacity: 10000,
      currentUsage: 5230,
      temperature: '22°C',
      humidity: '45%',
    },
    {
      id: '2',
      name: 'Secondary Warehouse',
      code: 'WH-002',
      location: 'Los Angeles',
      capacity: 5000,
      currentUsage: 2100,
      temperature: '20°C',
      humidity: '40%',
    },
  ],

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addReceipt: (receipt) =>
    set((state) => ({
      receipts: [...state.receipts, receipt],
    })),

  updateReceipt: (id, updates) =>
    set((state) => ({
      receipts: state.receipts.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  addDeliveryOrder: (order) =>
    set((state) => ({
      deliveryOrders: [...state.deliveryOrders, order],
    })),

  updateDeliveryOrder: (id, updates) =>
    set((state) => ({
      deliveryOrders: state.deliveryOrders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    })),

  addTransfer: (transfer) =>
    set((state) => ({
      transfers: [...state.transfers, transfer],
    })),

  updateTransfer: (id, updates) =>
    set((state) => ({
      transfers: state.transfers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  addAdjustment: (adjustment) =>
    set((state) => ({
      adjustments: [...state.adjustments, adjustment],
    })),

  updateAdjustment: (id, updates) =>
    set((state) => ({
      adjustments: state.adjustments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  addMovement: (movement) =>
    set((state) => ({
      movements: [...state.movements, movement],
    })),

  addWarehouse: (warehouse) =>
    set((state) => ({
      warehouses: [...state.warehouses, warehouse],
    })),

  updateWarehouse: (id, updates) =>
    set((state) => ({
      warehouses: state.warehouses.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),

  deleteWarehouse: (id) =>
    set((state) => ({
      warehouses: state.warehouses.filter((w) => w.id !== id),
    })),
}))
