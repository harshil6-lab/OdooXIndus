import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCurrentUser } from '@/services/profileService'
import { supabase } from '@/services/supabaseClient'

interface UsePaginatedTableResult<T> {
  items: T[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  refresh: () => Promise<void>
  hasMore: boolean
}

interface TableCacheEntry<T> {
  items: T[]
  page: number
  hasMore: boolean
  fetchedAt: number
}

const TABLE_CACHE_TTL_MS = 30_000
const tableCache = new Map<string, TableCacheEntry<unknown>>()

export function usePaginatedTable<T extends { id: string }>(tableName: string, pageSize = 20): UsePaginatedTableResult<T> {
  const cacheKey = useMemo(() => `${tableName}:${pageSize}`, [pageSize, tableName])
  const [items, setItems] = useState<T[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async (nextPage: number, reset = false) => {
    if (reset) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const user = await getCurrentUser()
      const from = nextPage * pageSize
      const to = from + pageSize - 1
      const { data, error: queryError } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (queryError) {
        console.error(queryError)
        throw new Error(queryError.message)
      }

      const nextItems = (data ?? []) as T[]
      const merged = reset
        ? nextItems
        : [...items, ...nextItems.filter((item) => !items.some((existing) => existing.id === item.id))]

      setItems(merged)
      setPage(nextPage)
      setHasMore(nextItems.length === pageSize)
      tableCache.set(cacheKey, {
        items: merged,
        page: nextPage,
        hasMore: nextItems.length === pageSize,
        fetchedAt: Date.now(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${tableName}.`)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [cacheKey, items, pageSize, tableName])

  const refresh = useCallback(async () => {
    await fetchPage(0, true)
  }, [fetchPage])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return
    await fetchPage(page + 1)
  }, [fetchPage, hasMore, loading, loadingMore, page])

  useEffect(() => {
    const cached = tableCache.get(cacheKey) as TableCacheEntry<T> | undefined
    if (cached && Date.now() - cached.fetchedAt < TABLE_CACHE_TTL_MS) {
      setItems(cached.items)
      setPage(cached.page)
      setHasMore(cached.hasMore)
      return
    }

    void refresh()
  }, [cacheKey, refresh])

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
    items,
    loading,
    loadingMore,
    error,
    refresh,
    hasMore,
  }
}