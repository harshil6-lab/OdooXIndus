import { supabase } from '@/services/supabaseClient'
import { getCurrentUser } from '@/services/profileService'
import { CreateProductInput, Product } from '@/types/inventory'

export interface GetProductsOptions {
  page?: number
  pageSize?: number
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  const user = await getCurrentUser()
  const page = options.page ?? 0
  const pageSize = options.pageSize ?? 50
  const from = page * pageSize
  const to = from + pageSize - 1
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
}

export async function getProductsCount(): Promise<number> {
  const user = await getCurrentUser()

  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return count ?? 0
}

export async function createProduct(product: CreateProductInput): Promise<Product> {
  const user = await getCurrentUser()
  
  const payload = {
    user_id: user.id,
    name: product.name,
    sku: product.sku,
    category: product.category ?? null,
    reorder_level: product.reorder_level ?? 0,
    price: product.price ?? 0,
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

export interface UpdateProductInput {
  name?: string
  sku?: string
  category?: string | null
  stock?: number
  reorder_level?: number
  price?: number
  warehouse_id?: string | null
}

export async function updateProduct(
  id: string,
  product: UpdateProductInput
): Promise<Product> {
  const user = await getCurrentUser()

  // Only include defined fields to avoid sending undefined to Supabase
  const payload: Record<string, unknown> = {}
  if (product.name !== undefined) payload.name = product.name
  if (product.sku !== undefined) payload.sku = product.sku
  if (product.category !== undefined) payload.category = product.category
  if (product.stock !== undefined) payload.stock = product.stock
  if (product.reorder_level !== undefined) payload.reorder_level = product.reorder_level
  if (product.price !== undefined) payload.price = product.price
  if (product.warehouse_id !== undefined) payload.warehouse_id = product.warehouse_id

  if (Object.keys(payload).length === 0) {
    throw new Error('No fields to update.')
  }

  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const user = await getCurrentUser()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}
