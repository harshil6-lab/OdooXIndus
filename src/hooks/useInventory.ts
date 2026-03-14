import { useCallback, useEffect, useState } from 'react'
import { createAdjustment } from '@/services/adjustmentService'
import { createDelivery } from '@/services/deliveryService'
import { getProducts } from '@/services/productService'
import { createReceipt } from '@/services/receiptService'
import { getCurrentUser } from '@/services/profileService'
import { supabase } from '@/services/supabaseClient'
import { createTransfer } from '@/services/transferService'
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
}

export function useInventory(): UseInventoryResult {
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [ledger, setLedger] = useState<StockLedgerEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const refreshInventory = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const user = await getCurrentUser()

      const [productsData, warehousesResult, ledgerResult] = await Promise.all([
        getProducts(),
        supabase.from('warehouses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('stock_ledger').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
      ])

      if (warehousesResult.error) {
        console.error(warehousesResult.error)
        throw new Error(warehousesResult.error.message)
      }

      if (ledgerResult.error) {
        console.error(ledgerResult.error)
        throw new Error(ledgerResult.error.message)
      }

      setProducts(productsData)
      setWarehouses((warehousesResult.data ?? []) as Warehouse[])
      setLedger((ledgerResult.data ?? []) as StockLedgerEntry[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh inventory data.')
    } finally {
      setLoading(false)
    }
  }, [])

  const submitReceipt = useCallback(async (input: CreateReceiptInput): Promise<boolean> => {
    setError(null)

    try {
      await createReceipt(input)
      await refreshInventory()
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
      await refreshInventory()
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
      await refreshInventory()
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
      await refreshInventory()
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
  }
}
