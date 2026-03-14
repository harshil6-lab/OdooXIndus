import { useCallback, useEffect, useState } from 'react'
import { createProduct, getProducts } from '@/services/productService'
import { CreateProductInput, Product } from '@/types/inventory'

interface UseProductsResult {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (input: CreateProductInput) => Promise<Product | null>
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await getProducts()

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    setProducts(result.data ?? [])
    setLoading(false)
  }, [])

  const addProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setError(null)

    const result = await createProduct(input)

    if (result.error || !result.data) {
      setError(result.error?.message ?? 'Failed to create product.')
      return null
    }

    setProducts((prev) => [result.data as Product, ...prev])
    return result.data
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
  }
}
