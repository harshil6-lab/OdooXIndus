import { supabase } from '@/services/supabaseClient'
import { CreateReceiptInput, Receipt, StockLedgerEntry } from '@/types/inventory'

interface ReceiptResult {
  receipt: Receipt
  updatedStock: number
}

export async function createReceipt(input: CreateReceiptInput): Promise<ReceiptResult> {
  if (input.quantity <= 0) {
    throw new Error('Receipt quantity must be greater than zero.')
  }

  const { data: productRow, error: productError } = await supabase
    .from('products')
    .select('id, stock')
    .eq('id', input.productId)
    .single()

  if (productError) {
    console.error(productError)
    throw new Error(productError.message)
  }

  const currentStock = Number(productRow?.stock ?? 0)
  const updatedStock = currentStock + input.quantity

  const { error: stockUpdateError } = await supabase
    .from('products')
    .update({ stock: updatedStock })
    .eq('id', input.productId)

  if (stockUpdateError) {
    console.error(stockUpdateError)
    throw new Error(stockUpdateError.message)
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
    console.error(receiptError)
    await supabase
      .from('products')
      .update({ stock: currentStock })
      .eq('id', input.productId)

    throw new Error(receiptError.message)
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
    console.error(ledgerError)
    throw new Error(ledgerError.message)
  }

  return {
    receipt: receiptData as Receipt,
    updatedStock,
  }
}
