import { supabase } from '@/services/supabaseClient'
import { getCurrentUser } from '@/services/profileService'
import { CreateProductInput, Product } from '@/types/inventory'

export async function getProducts(): Promise<Product[]> {
  const user = await getCurrentUser()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return (data ?? []) as Product[]
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

  const { data, error } = await supabase
    .from('products')
    .update(product)
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
