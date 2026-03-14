import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabaseClient'
import { CreateReceiptInput, Receipt, ServiceResponse, StockLedgerEntry } from '@/types/inventory'

interface ReceiptResult {
  receipt: Receipt
  updatedStock: number
}

const toError = (error: PostgrestError | Error) => ({
  message: error.message,
  code: 'code' in error ? error.code : undefined,
  details: 'details' in error ? error.details : undefined,
})

export async function createReceipt(input: CreateReceiptInput): Promise<ServiceResponse<ReceiptResult>> {
  if (input.quantity <= 0) {
    return {
      data: null,
      error: { message: 'Receipt quantity must be greater than zero.' },
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

    const currentStock = Number(productRow?.stock ?? 0)
    const updatedStock = currentStock + input.quantity

    const { error: stockUpdateError } = await supabase
      .from('products')
      .update({ stock: updatedStock })
      .eq('id', input.productId)

    if (stockUpdateError) {
      return { data: null, error: toError(stockUpdateError) }
    }

    const { data: receiptData, error: receiptError } = await supabase
      .from('receipts')
      .insert({
        product_id: input.productId,
        warehouse_id: input.warehouseId ?? null,
        quantity: input.quantity,
        supplier: input.supplier ?? null,
        reference: input.reference ?? null,
        note: input.note ?? null,
      })
      .select('*')
      .single()

    if (receiptError) {
      await supabase
        .from('products')
        .update({ stock: currentStock })
        .eq('id', input.productId)

      return { data: null, error: toError(receiptError) }
    }

    const ledgerPayload: StockLedgerEntry = {
      product_id: input.productId,
      warehouse_id: input.warehouseId ?? null,
      operation_type: 'receipt',
      quantity_delta: input.quantity,
      balance_after: updatedStock,
      reference_id: receiptData.id,
      reference_type: 'receipt',
      note: input.note ?? null,
    }

    const { error: ledgerError } = await supabase.from('stock_ledger').insert(ledgerPayload)

    if (ledgerError) {
      return { data: null, error: toError(ledgerError) }
    }

    return {
      data: {
        receipt: receiptData as Receipt,
        updatedStock,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}
