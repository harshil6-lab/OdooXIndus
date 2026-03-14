import { supabase } from '@/services/supabaseClient'
import { getCurrentUser } from '@/services/profileService'
import { Warehouse } from '@/types/inventory'

export interface CreateWarehouseInput {
  name: string
  location?: string | null
  capacity?: number | null
}

export interface UpdateWarehouseInput {
  name?: string
  location?: string | null
  capacity?: number | null
}

export async function getWarehouses(): Promise<Warehouse[]> {
  const user = await getCurrentUser()
  
  const { data, error } = await supabase
    .from('warehouses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return (data ?? []) as Warehouse[]
}

export async function createWarehouse(input: CreateWarehouseInput): Promise<Warehouse> {
  const user = await getCurrentUser()
  
  const payload = {
    user_id: user.id,
    name: input.name,
    location: input.location ?? null,
    capacity: input.capacity ?? null,
  }

  const { data, error } = await supabase
    .from('warehouses')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return data as Warehouse
}

export async function updateWarehouse(
  id: string,
  input: UpdateWarehouseInput
): Promise<Warehouse> {
  const user = await getCurrentUser()

  const { data, error } = await supabase
    .from('warehouses')
    .update(input)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  return data as Warehouse
}

export async function deleteWarehouse(id: string): Promise<void> {
  const user = await getCurrentUser()

  const { error } = await supabase
    .from('warehouses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }
}
