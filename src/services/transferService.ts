import { supabase } from '@/services/supabaseClient'
import { CreateTransferInput, ProductStock, StockLedgerEntry, Transfer } from '@/types/inventory'

interface TransferResult {
  transfer: Transfer
  sourceStockAfter: number
  destinationStockAfter: number
}

async function getWarehouseStock(productId: string, warehouseId: string): Promise<number> {
  const { data, error } = await supabase
    .from('product_stocks')
    .select('stock')
    .eq('product_id', productId)
    .eq('warehouse_id', warehouseId)
    .maybeSingle()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return Number(data?.stock ?? 0)
}

async function upsertWarehouseStock(stock: ProductStock): Promise<void> {
  const { error } = await supabase
    .from('product_stocks')
    .upsert(stock, { onConflict: 'product_id,warehouse_id' })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}

export async function createTransfer(input: CreateTransferInput): Promise<TransferResult> {
  if (input.quantity <= 0) {
    throw new Error('Transfer quantity must be greater than zero.')
  }

  if (input.sourceWarehouseId === input.destinationWarehouseId) {
    throw new Error('Source and destination warehouses must be different.')
  }

  const sourceStock = await getWarehouseStock(input.productId, input.sourceWarehouseId)

  if (sourceStock < input.quantity) {
    throw new Error('Insufficient stock in source warehouse.')
  }

  const destinationStock = await getWarehouseStock(input.productId, input.destinationWarehouseId)
  const sourceStockAfter = sourceStock - input.quantity
  const destinationStockAfter = destinationStock + input.quantity

  await upsertWarehouseStock({
    product_id: input.productId,
    warehouse_id: input.sourceWarehouseId,
    stock: sourceStockAfter,
  })

  try {
    await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.destinationWarehouseId,
      stock: destinationStockAfter,
    })
  } catch (destinationError) {
    await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.sourceWarehouseId,
      stock: sourceStock,
    })
    throw destinationError
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
    console.error(transferError)
    await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.sourceWarehouseId,
      stock: sourceStock,
    })
    await upsertWarehouseStock({
      product_id: input.productId,
      warehouse_id: input.destinationWarehouseId,
      stock: destinationStock,
    })
    throw new Error(transferError.message)
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
    console.error(ledgerError)
    throw new Error(ledgerError.message)
  }

  return {
    transfer: transferData as Transfer,
    sourceStockAfter,
    destinationStockAfter,
  }
}
