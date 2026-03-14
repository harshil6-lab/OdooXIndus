import { useCallback, useEffect, useState } from 'react'
import { 
  getWarehouses, 
  createWarehouse, 
  updateWarehouse, 
  deleteWarehouse,
  CreateWarehouseInput,
  UpdateWarehouseInput
} from '@/services/warehouseService'
import { Warehouse } from '@/types/inventory'

interface UseWarehousesResult {
  warehouses: Warehouse[]
  loading: boolean
  error: string | null
  fetchWarehouses: () => Promise<void>
  addWarehouse: (input: CreateWarehouseInput) => Promise<Warehouse | null>
  editWarehouse: (id: string, input: UpdateWarehouseInput) => Promise<Warehouse | null>
  removeWarehouse: (id: string) => Promise<boolean>
}

export function useWarehouses(): UseWarehousesResult {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWarehouses = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getWarehouses()
      setWarehouses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addWarehouse = useCallback(async (input: CreateWarehouseInput): Promise<Warehouse | null> => {
    setError(null)

    try {
      const created = await createWarehouse(input)
      setWarehouses((prev) => [created, ...prev])
      return created
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create warehouse.')
      return null
    }
  }, [])

  const editWarehouse = useCallback(async (id: string, input: UpdateWarehouseInput): Promise<Warehouse | null> => {
    setError(null)

    try {
      const updated = await updateWarehouse(id, input)
      setWarehouses((prev) => prev.map((w) => (w.id === id ? updated : w)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update warehouse.')
      return null
    }
  }, [])

  const removeWarehouse = useCallback(async (id: string): Promise<boolean> => {
    setError(null)

    try {
      await deleteWarehouse(id)
      setWarehouses((prev) => prev.filter((w) => w.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete warehouse.')
      return false
    }
  }, [])

  useEffect(() => {
    void fetchWarehouses()
  }, [fetchWarehouses])

  return {
    warehouses,
    loading,
    error,
    fetchWarehouses,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
  }
}
