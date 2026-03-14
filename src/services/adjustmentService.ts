import { supabase } from '@/services/supabaseClient'
import { getCurrentUser } from '@/services/profileService'
import { Adjustment, CreateAdjustmentInput, StockLedgerEntry } from '@/types/inventory'

interface AdjustmentResult {
  adjustment: Adjustment
  difference: number
}

export async function createAdjustment(input: CreateAdjustmentInput): Promise<AdjustmentResult> {
  if (input.countedStock < 0) {
    throw new Error('Counted stock cannot be negative.')
  }

  const user = await getCurrentUser()

  const { data: productRow, error: productError } = await supabase
    .from('products')
    .select('id, stock')
    .eq('id', input.productId)
    .eq('user_id', user.id)
    .single()

  if (productError) {
    console.error(productError)
    throw new Error(productError.message)
  }

  const previousStock = Number(productRow?.stock ?? 0)
  const difference = input.countedStock - previousStock

  const { error: stockUpdateError } = await supabase
    .from('products')
    .update({ stock: input.countedStock })
    .eq('id', input.productId)
    .eq('user_id', user.id)

  if (stockUpdateError) {
    console.error(stockUpdateError)
    throw new Error(stockUpdateError.message)
  }

  const { data: adjustmentData, error: adjustmentError } = await supabase
    .from('adjustments')
    .insert({
      user_id: user.id,
      product_id: input.productId,
      warehouse_id: input.warehouseId ?? null,
      previous_stock: previousStock,
      new_stock: input.countedStock,
      difference,
      reason: input.reason ?? null,
      reference: input.reference ?? null,
    })
    .select('*')
    .single()

  if (adjustmentError) {
    console.error(adjustmentError)
    await supabase
      .from('products')
      .update({ stock: previousStock })
      .eq('id', input.productId)
      .eq('user_id', user.id)

    throw new Error(adjustmentError.message)
  }

  const ledgerPayload: StockLedgerEntry = {
    user_id: user.id,
    product_id: input.productId,
    warehouse_id: input.warehouseId ?? null,
    operation_type: 'adjustment',
    quantity_delta: difference,
    balance_after: input.countedStock,
    reference_id: adjustmentData.id,
    reference_type: 'adjustment',
    note: input.reason ?? null,
  }

  const { error: ledgerError } = await supabase.from('stock_ledger').insert(ledgerPayload)

  if (ledgerError) {
    console.error(ledgerError)
    throw new Error(ledgerError.message)
  }

  return {
    adjustment: adjustmentData as Adjustment,
    difference,
  }
}
