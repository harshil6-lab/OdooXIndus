import { useCallback, useEffect, useState } from 'react'
import { createProduct, getProducts, getProductsCount, updateProduct, deleteProduct, UpdateProductInput } from '@/services/productService'
import { CreateProductInput, Product } from '@/types/inventory'

interface UseProductsResult {
  products: Product[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  loadMore: () => Promise<void>
  addProduct: (input: CreateProductInput) => Promise<Product | null>
  editProduct: (id: string, input: UpdateProductInput) => Promise<Product | null>
  removeProduct: (id: string) => Promise<boolean>
  hasMore: boolean
  totalCount: number
}

const PRODUCTS_PAGE_SIZE = 20
const PRODUCTS_CACHE_TTL_MS = 30_000

let productsCache: {
  items: Product[]
  page: number
  hasMore: boolean
  totalCount: number
  fetchedAt: number
} | null = null

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const fetchProductsPage = useCallback(async (nextPage: number, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const [data, count] = await Promise.all([
        getProducts({ page: nextPage, pageSize: PRODUCTS_PAGE_SIZE }),
        reset ? getProductsCount() : Promise.resolve(totalCount),
      ])

      const merged = reset ? data : [...products, ...data.filter((item) => !products.some((existing) => existing.id === item.id))]
      setProducts(merged)
      setPage(nextPage)
      setHasMore(data.length === PRODUCTS_PAGE_SIZE)
      setTotalCount(count)
      productsCache = {
        items: merged,
        page: nextPage,
        hasMore: data.length === PRODUCTS_PAGE_SIZE,
        totalCount: count,
        fetchedAt: Date.now(),
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [products, totalCount])

  const fetchProducts = useCallback(async () => {
    await fetchProductsPage(0, true)
  }, [fetchProductsPage])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return
    await fetchProductsPage(page + 1)
  }, [fetchProductsPage, hasMore, loading, loadingMore, page])

  const addProduct = useCallback(async (input: CreateProductInput): Promise<Product | null> => {
    setError(null)

    try {
      const created = await createProduct(input)
      setProducts((prev) => [created, ...prev])
      setTotalCount((prev) => prev + 1)
      productsCache = null
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
      productsCache = null
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
      setTotalCount((prev) => Math.max(0, prev - 1))
      productsCache = null
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.')
      return false
    }
  }, [])

  useEffect(() => {
    if (productsCache && Date.now() - productsCache.fetchedAt < PRODUCTS_CACHE_TTL_MS) {
      setProducts(productsCache.items)
      setPage(productsCache.page)
      setHasMore(productsCache.hasMore)
      setTotalCount(productsCache.totalCount)
      return
    }

    void fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loading || loadingMore) return
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 320) {
        void loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, loadMore, loading, loadingMore])

  return {
    products,
    loading,
    loadingMore,
    error,
    fetchProducts,
    loadMore,
    addProduct,
    editProduct,
    removeProduct,
    hasMore,
    totalCount,
  }
}
