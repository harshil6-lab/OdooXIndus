import { useCallback, useEffect, useState } from 'react'
import { createProduct, getProducts, updateProduct, deleteProduct, UpdateProductInput } from '@/services/productService'
import { CreateProductInput, Product } from '@/types/inventory'

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (input: CreateProductInput) => Promise<Product | null>
  editProduct: (id: string, input: UpdateProductInput) => Promise<Product | null>
  removeProduct: (id: string) => Promise<boolean>
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products.')
    } finally {
      setLoading(false)
    }
  }, [])

  const addProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setError(null)

    try {
      const created = await createProduct(input)
      setProducts((prev) => [created, ...prev])
      return created
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product.')
      return null
    }
  }, [])

  const editProduct = useCallback(async (id: string, input: UpdateProductInput): Promise<Product | null> => {
    setError(null)

    try {
      const updated = await updateProduct(id, input)
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product.')
      return null
    }
  }, [])

  const removeProduct = useCallback(async (id: string): Promise<boolean> => {
    setError(null)

    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.')
      return false
    }
  }, [])

  useEffect(() => {
    void fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  }
}
