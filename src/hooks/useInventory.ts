import { useCallback, useEffect, useState } from 'react'
import { createAdjustment } from '@/services/adjustmentService'
import { createDelivery } from '@/services/deliveryService'
import { getProducts } from '@/services/productService'
import { createReceipt } from '@/services/receiptService'
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

    const [productsResult, warehousesResult, ledgerResult] = await Promise.all([
      getProducts(),
      supabase.from('warehouses').select('*').order('created_at', { ascending: false }),
      supabase.from('stock_ledger').select('*').order('created_at', { ascending: false }).limit(100),
    ])

    if (productsResult.error) {
      setError(productsResult.error.message)
      setLoading(false)
      return
    }

    if (warehousesResult.error) {
      setError(warehousesResult.error.message)
      setLoading(false)
      return
    }

    if (ledgerResult.error) {
      setError(ledgerResult.error.message)
      setLoading(false)
      return
    }

    setProducts(productsResult.data ?? [])
    setWarehouses((warehousesResult.data ?? []) as Warehouse[])
    setLedger((ledgerResult.data ?? []) as StockLedgerEntry[])
    setLoading(false)
  }, [])

  const submitReceipt = useCallback(async (input: CreateReceiptInput): Promise<boolean> => {
    setError(null)
    const result = await createReceipt(input)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    await refreshInventory()
    return true
  }, [refreshInventory])

  const submitDelivery = useCallback(async (input: CreateDeliveryInput): Promise<boolean> => {
    setError(null)
    const result = await createDelivery(input)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    await refreshInventory()
    return true
  }, [refreshInventory])

  const submitTransfer = useCallback(async (input: CreateTransferInput): Promise<boolean> => {
    setError(null)
    const result = await createTransfer(input)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    await refreshInventory()
    return true
  }, [refreshInventory])

  const submitAdjustment = useCallback(async (input: CreateAdjustmentInput): Promise<boolean> => {
    setError(null)
    const result = await createAdjustment(input)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    await refreshInventory()
    return true
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
