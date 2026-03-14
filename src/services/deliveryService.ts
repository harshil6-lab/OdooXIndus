import { supabase } from '@/services/supabaseClient'
import { CreateDeliveryInput, Delivery, StockLedgerEntry } from '@/types/inventory'

interface DeliveryResult {
  delivery: Delivery
  updatedStock: number
}

export async function createDelivery(input: CreateDeliveryInput): Promise<DeliveryResult> {
  if (input.quantity <= 0) {
    throw new Error('Delivery quantity must be greater than zero.')
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

  if (currentStock < input.quantity) {
    throw new Error('Insufficient stock for this delivery.')
  }

  const updatedStock = currentStock - input.quantity

  const { error: stockUpdateError } = await supabase
    .from('products')
    .update({ stock: updatedStock })
    .eq('id', input.productId)

  if (stockUpdateError) {
    console.error(stockUpdateError)
    throw new Error(stockUpdateError.message)
  }

  const { data: deliveryData, error: deliveryError } = await supabase
    .from('deliveries')
    .insert({
      product_id: input.productId,
      warehouse_id: input.warehouseId ?? null,
      quantity: input.quantity,
      customer: input.customer ?? null,
      reference: input.reference ?? null,
      note: input.note ?? null,
    })
    .select('*')
    .single()

  if (deliveryError) {
    console.error(deliveryError)
    await supabase
      .from('products')
      .update({ stock: currentStock })
      .eq('id', input.productId)

    throw new Error(deliveryError.message)
  }

  const ledgerPayload: StockLedgerEntry = {
    product_id: input.productId,
    warehouse_id: input.warehouseId ?? null,
    operation_type: 'delivery',
    quantity_delta: -input.quantity,
    balance_after: updatedStock,
    reference_id: deliveryData.id,
    reference_type: 'delivery',
    note: input.note ?? null,
  }

  const { error: ledgerError } = await supabase.from('stock_ledger').insert(ledgerPayload)

  if (ledgerError) {
    console.error(ledgerError)
    throw new Error(ledgerError.message)
  }

  return {
    delivery: deliveryData as Delivery,
    updatedStock,
  }
}
