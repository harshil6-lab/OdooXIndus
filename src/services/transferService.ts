import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabaseClient'
import { CreateTransferInput, ProductStock, ServiceResponse, StockLedgerEntry, Transfer } from '@/types/inventory'

interface TransferResult {
  transfer: Transfer
  sourceStockAfter: number
  destinationStockAfter: number
}

const toError = (error: PostgrestError | Error) => ({
  message: error.message,
  code: 'code' in error ? error.code : undefined,
  details: 'details' in error ? error.details : undefined,
})

async function getWarehouseStock(productId: string, warehouseId: string): Promise<ServiceResponse<number>> {
  const { data, error } = await supabase
    .from('product_stocks')
    .select('stock')
    .eq('product_id', productId)
    .eq('warehouse_id', warehouseId)
    .maybeSingle()

  if (error) {
    return { data: null, error: toError(error) }
  }

  return { data: Number(data?.stock ?? 0), error: null }
}

async function upsertWarehouseStock(stock: ProductStock): Promise<ServiceResponse<true>> {
  const { error } = await supabase
    .from('product_stocks')
    .upsert(stock, { onConflict: 'product_id,warehouse_id' })

  if (error) {
    return { data: null, error: toError(error) }
  }

  return { data: true, error: null }
}

export async function createTransfer(input: CreateTransferInput): Promise<ServiceResponse<TransferResult>> {
  if (input.quantity <= 0) {
    return {
      data: null,
      error: { message: 'Transfer quantity must be greater than zero.' },
    }
  }

  if (input.sourceWarehouseId === input.destinationWarehouseId) {
    return {
      data: null,
      error: { message: 'Source and destination warehouses must be different.' },
    }
  }

  try {
    const sourceResult = await getWarehouseStock(input.productId, input.sourceWarehouseId)

    if (sourceResult.error || sourceResult.data === null) {
      return { data: null, error: sourceResult.error }
    }

    if (sourceResult.data < input.quantity) {
      return {
        data: null,
        error: { message: 'Insufficient stock in source warehouse.' },
      }
    }

    const destinationResult = await getWarehouseStock(input.productId, input.destinationWarehouseId)

    if (destinationResult.error || destinationResult.data === null) {
      return { data: null, error: destinationResult.error }
    }

    const sourceStockAfter = sourceResult.data - input.quantity
    const destinationStockAfter = destinationResult.data + input.quantity

    const sourceUpsert = await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.sourceWarehouseId,
      stock: sourceStockAfter,
    })

    if (sourceUpsert.error) {
      return { data: null, error: sourceUpsert.error }
    }

    const destinationUpsert = await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.destinationWarehouseId,
      stock: destinationStockAfter,
    })

    if (destinationUpsert.error) {
      await upsertWarehouseStock({
        product_id: input.productId,
        warehouse_id: input.sourceWarehouseId,
        stock: sourceResult.data,
      })

      return { data: null, error: destinationUpsert.error }
    }

    const { data: transferData, error: transferError } = await supabase
      .from('transfers')
      .insert({
        product_id: input.productId,
        source_warehouse_id: input.sourceWarehouseId,
        destination_warehouse_id: input.destinationWarehouseId,
        quantity: input.quantity,
        reference: input.reference ?? null,
        note: input.note ?? null,
      })
      .select('*')
      .single()

    if (transferError) {
      await upsertWarehouseStock({
        product_id: input.productId,
        warehouse_id: input.sourceWarehouseId,
        stock: sourceResult.data,
      })
      await upsertWarehouseStock({
        product_id: input.productId,
        warehouse_id: input.destinationWarehouseId,
        stock: destinationResult.data,
      })

      return { data: null, error: toError(transferError) }
    }

    const transferLedgerRows: StockLedgerEntry[] = [
      {
        product_id: input.productId,
        warehouse_id: input.sourceWarehouseId,
        operation_type: 'transfer',
        quantity_delta: -input.quantity,
        balance_after: sourceStockAfter,
        reference_id: transferData.id,
        reference_type: 'transfer_out',
        note: input.note ?? null,
      },
      {
        product_id: input.productId,
        warehouse_id: input.destinationWarehouseId,
        operation_type: 'transfer',
        quantity_delta: input.quantity,
        balance_after: destinationStockAfter,
        reference_id: transferData.id,
        reference_type: 'transfer_in',
        note: input.note ?? null,
      },
    ]

    const { error: ledgerError } = await supabase.from('stock_ledger').insert(transferLedgerRows)

    if (ledgerError) {
      return { data: null, error: toError(ledgerError) }
    }

    return {
      data: {
        transfer: transferData as Transfer,
        sourceStockAfter,
        destinationStockAfter,
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}
