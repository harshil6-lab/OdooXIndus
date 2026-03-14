import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabaseClient'
import { Adjustment, CreateAdjustmentInput, ServiceResponse, StockLedgerEntry } from '@/types/inventory'

interface AdjustmentResult {
  adjustment: Adjustment
  difference: number
}

const toError = (error: PostgrestError | Error) => ({
  message: error.message,
  code: 'code' in error ? error.code : undefined,
  details: 'details' in error ? error.details : undefined,
})

export async function createAdjustment(input: CreateAdjustmentInput): Promise<ServiceResponse<AdjustmentResult>> {
  if (input.countedStock < 0) {
    return {
      data: null,
      error: { message: 'Counted stock cannot be negative.' },
    }
  }

  try {
    const { data: productRow, error: productError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', input.productId)
      .single()

    if (productError) {
      return { data: null, error: toError(productError) }
    }

    const previousStock = Number(productRow?.stock ?? 0)
    const difference = input.countedStock - previousStock

    const { error: stockUpdateError } = await supabase
      .from('products')
      .update({ stock: input.countedStock })
      .eq('id', input.productId)

    if (stockUpdateError) {
      return { data: null, error: toError(stockUpdateError) }
    }

    const { data: adjustmentData, error: adjustmentError } = await supabase
      .from('adjustments')
      .insert({
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
      await supabase
        .from('products')
        .update({ stock: previousStock })
        .eq('id', input.productId)

      return { data: null, error: toError(adjustmentError) }
    }

    const ledgerPayload: StockLedgerEntry = {
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
      return { data: null, error: toError(ledgerError) }
    }

    return {
      data: {
        adjustment: adjustmentData as Adjustment,
        difference,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}
