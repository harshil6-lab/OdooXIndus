import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabaseClient'
import { CreateProductInput, Product, ServiceResponse } from '@/types/inventory'

const toError = (error: PostgrestError | Error) => ({
  message: error.message,
  code: 'code' in error ? error.code : undefined,
  details: 'details' in error ? error.details : undefined,
})

export async function getProducts(): Promise<ServiceResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: toError(error) }
    }

    return { data: (data ?? []) as Product[], error: null }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}

export async function createProduct(input: CreateProductInput): Promise<ServiceResponse<Product>> {
  try {
    const payload = {
      name: input.name,
      sku: input.sku,
      category: input.category ?? null,
      stock: input.stock ?? 0,
      reorder_level: input.reorder_level ?? 0,
      price: input.price ?? 0,
      warehouse_id: input.warehouse_id ?? null,
    }

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      return { data: null, error: toError(error) }
    }

    return { data: data as Product, error: null }
  } catch (error) {
    return { data: null, error: toError(error as Error) }
  }
}
