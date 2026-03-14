import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabaseClient'
import { CreateDeliveryInput, Delivery, ServiceResponse, StockLedgerEntry } from '@/types/inventory'

interface DeliveryResult {
  delivery: Delivery
  updatedStock: number
}

const toError = (error: PostgrestError | Error) => ({
  message: error.message,
  code: 'code' in error ? error.code : undefined,
  details: 'details' in error ? error.details : undefined,
})

export async function createDelivery(input: CreateDeliveryInput): Promise<ServiceResponse<DeliveryResult>> {
  if (input.quantity <= 0) {
    return {
      data: null,
      error: { message: 'Delivery quantity must be greater than zero.' },
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

    if (currentStock < input.quantity) {
      return {
        data: null,
        error: { message: 'Insufficient stock for this delivery.' },
      }
    }

    const updatedStock = currentStock - input.quantity

    const { error: stockUpdateError } = await supabase
      .from('products')
      .update({ stock: updatedStock })
      .eq('id', input.productId)

    if (stockUpdateError) {
      return { data: null, error: toError(stockUpdateError) }
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
      await supabase
        .from('products')
        .update({ stock: currentStock })
        .eq('id', input.productId)

      return { data: null, error: toError(deliveryError) }
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
      return { data: null, error: toError(ledgerError) }
    }

    return {
      data: {
        delivery: deliveryData as Delivery,
        updatedStock,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}
