import { useCallback, useEffect, useState } from 'react'
import { createAdjustment } from '@/services/adjustmentService'
import { createDelivery } from '@/services/deliveryService'
import { getProducts, getProductsCount } from '@/services/productService'
import { createReceipt } from '@/services/receiptService'
import { getCurrentUser } from '@/services/profileService'
import { supabase } from '@/services/supabaseClient'
import { createTransfer } from '@/services/transferService'
import { getWarehouses, getWarehousesCount } from '@/services/warehouseService'
import {
  CreateAdjustmentInput,
  CreateDeliveryInput,
  CreateReceiptInput,
  CreateTransferInput,
  Product,
  StockLedgerEntry,
  Warehouse,
} from '@/types/inventory'

interface UseInventoryResult {
  products: Product[]
  warehouses: Warehouse[]
  ledger: StockLedgerEntry[]
  loading: boolean
  error: string | null
  refreshInventory: () => Promise<void>
  submitReceipt: (input: CreateReceiptInput) => Promise<boolean>
  submitDelivery: (input: CreateDeliveryInput) => Promise<boolean>
  submitTransfer: (input: CreateTransferInput) => Promise<boolean>
  submitAdjustment: (input: CreateAdjustmentInput) => Promise<boolean>
  productCount: number
  warehouseCount: number
  ledgerCount: number
}

interface UseInventoryOptions {
  includeWarehouses?: boolean
  includeLedger?: boolean
  includeCounts?: boolean
  productPageSize?: number
  warehousePageSize?: number
  ledgerPageSize?: number
}

interface InventoryCacheEntry {
  products: Product[]
  warehouses: Warehouse[]
  ledger: StockLedgerEntry[]
  productCount: number
  warehouseCount: number
  ledgerCount: number
  fetchedAt: number
}

const INVENTORY_CACHE_TTL_MS = 30_000
const inventoryCache = new Map<string, InventoryCacheEntry>()

export function useInventory(options: UseInventoryOptions = {}): UseInventoryResult {
  const {
    includeWarehouses = true,
    includeLedger = true,
    includeCounts = false,
    productPageSize = 50,
    warehousePageSize = 50,
    ledgerPageSize = 40,
  } = options
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [ledger, setLedger] = useState<StockLedgerEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [productCount, setProductCount] = useState(0)
  const [warehouseCount, setWarehouseCount] = useState(0)
  const [ledgerCount, setLedgerCount] = useState(0)

  const cacheKey = JSON.stringify({ includeWarehouses, includeLedger, includeCounts, productPageSize, warehousePageSize, ledgerPageSize })

  const refreshInventory = useCallback(async (force = false) => {
    const cached = inventoryCache.get(cacheKey)
    if (!force && cached && Date.now() - cached.fetchedAt < INVENTORY_CACHE_TTL_MS) {
      setProducts(cached.products)
      setWarehouses(cached.warehouses)
      setLedger(cached.ledger)
      setProductCount(cached.productCount)
      setWarehouseCount(cached.warehouseCount)
      setLedgerCount(cached.ledgerCount)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const user = await getCurrentUser()

      const [productsData, warehousesData, ledgerResult, productTotal, warehouseTotal, ledgerTotal] = await Promise.all([
        getProducts({ page: 0, pageSize: productPageSize }),
        includeWarehouses ? getWarehouses({ page: 0, pageSize: warehousePageSize }) : Promise.resolve([] as Warehouse[]),
        includeLedger
          ? supabase.from('stock_ledger').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(ledgerPageSize)
          : Promise.resolve({ data: [] as StockLedgerEntry[], error: null }),
        includeCounts ? getProductsCount() : Promise.resolve(0),
        includeCounts && includeWarehouses ? getWarehousesCount() : Promise.resolve(0),
        includeCounts && includeLedger
          ? supabase.from('stock_ledger').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count, error }) => {
              if (error) throw error
              return count ?? 0
            })
          : Promise.resolve(0),
      ])

      if (ledgerResult.error) {
        console.error(ledgerResult.error)
        throw new Error(ledgerResult.error.message)
      }

      setProducts(productsData)
      setWarehouses(warehousesData)
      setLedger((ledgerResult.data ?? []) as StockLedgerEntry[])
      setProductCount(includeCounts ? productTotal : productsData.length)
      setWarehouseCount(includeCounts ? warehouseTotal : warehousesData.length)
      setLedgerCount(includeCounts ? ledgerTotal : (ledgerResult.data ?? []).length)

      inventoryCache.set(cacheKey, {
        products: productsData,
        warehouses: warehousesData,
        ledger: (ledgerResult.data ?? []) as StockLedgerEntry[],
        productCount: includeCounts ? productTotal : productsData.length,
        warehouseCount: includeCounts ? warehouseTotal : warehousesData.length,
        ledgerCount: includeCounts ? ledgerTotal : (ledgerResult.data ?? []).length,
        fetchedAt: Date.now(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh inventory data.')
    } finally {
      setLoading(false)
    }
  }, [cacheKey, includeCounts, includeLedger, includeWarehouses, ledgerPageSize, productPageSize, warehousePageSize])

  const submitReceipt = useCallback(async (input: CreateReceiptInput): Promise<boolean> => {
    setError(null)

    try {
      await createReceipt(input)
      await refreshInventory(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create receipt.')
      return false
    }
  }, [refreshInventory])

  const submitDelivery = useCallback(async (input: CreateDeliveryInput): Promise<boolean> => {
    setError(null)

    try {
      await createDelivery(input)
      await refreshInventory(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create delivery.')
      return false
    }
  }, [refreshInventory])

  const submitTransfer = useCallback(async (input: CreateTransferInput): Promise<boolean> => {
    setError(null)

    try {
      await createTransfer(input)
      await refreshInventory(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transfer.')
      return false
    }
  }, [refreshInventory])

  const submitAdjustment = useCallback(async (input: CreateAdjustmentInput): Promise<boolean> => {
    setError(null)

    try {
      await createAdjustment(input)
      await refreshInventory(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create adjustment.')
      return false
    }
  }, [refreshInventory])

  useEffect(() => {
    void refreshInventory()
  }, [refreshInventory])

  return {
    products,
    warehouses,
    ledger,
    loading,
    error,
    refreshInventory,
    submitReceipt,
    submitDelivery,
    submitTransfer,
    submitAdjustment,
    productCount,
    warehouseCount,
    ledgerCount,
  }
}
