import { supabase } from '@/services/supabaseClient'
import { CreateProductInput, Product } from '@/types/inventory'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  const payload = {
    name: product.name,
    sku: product.sku,
    category: product.category ?? null,
    stock: product.stock ?? 0,
    reorder_level: product.reorder_level ?? 0,
    price: product.price ?? 0,
    warehouse_id: product.warehouse_id ?? null,
  }

  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return data as Product
}
