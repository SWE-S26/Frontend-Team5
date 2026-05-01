import axios from 'axios'
import { useCallback, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { searchService } from '@/services/search.service'

const useAuthState = () =>
  useAppSelector((s) => s.auth.isAuthenticated && s.auth.hasHydrated)

const ALLOWED = {
  type:      new Set(['everything','tracks', 'users', 'playlists', 'albums']),
  dateRange: new Set(['hour', 'day', 'week', 'month', 'year', 'all']),
  duration:  new Set(['lt2', '2to10', '10to30', 'gt30', 'all']),
  usage:     new Set(['commercial', 'modify', 'share', 'listen']),
} as const

export interface SearchParams {
  q: string
  type?: string
  dateRange?: string
  duration?: string
  usage?: string
  tag?: string
  location?: string
  offset?: number
  limit?: number
}

function sanitizeParams(raw: Record<string, any>): SearchParams | null {
  const q = String(raw.q ?? '').trim()
  if (!q) return null

  const params: any = { q }

  if (raw.type && ALLOWED.type.has(String(raw.type))) {
    params.type = String(raw.type)
  }
  if (raw.dateRange && ALLOWED.dateRange.has(String(raw.dateRange))) {
    params.dateRange = String(raw.dateRange)
  }
  if (raw.duration && ALLOWED.duration.has(String(raw.duration))) {
    params.duration = String(raw.duration)
  }
  if (raw.usage && ALLOWED.usage.has(String(raw.usage))) {
    params.usage = String(raw.usage)
  }
  if (raw.tag && String(raw.tag).trim()) {
    params.tag = String(raw.tag).trim()
  }
  if (raw.location && String(raw.location).trim()) {
    params.location = String(raw.location).trim()
  }

  if (raw.offset !== undefined && raw.offset !== null) {
    params.offset = Number(raw.offset)
  }
  if (raw.limit !== undefined && raw.limit !== null) {
    params.limit = Number(raw.limit)
  }

  return params as SearchParams
}

function isEnumValidationError(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false
  if (err.response?.status !== 400) return false
  const errors = err.response?.data?.errors
  return (
    Array.isArray(errors) &&
    errors.some((e: any) => String(e.field ?? '').startsWith('query.'))
  )
}

export function useSearch() {
  const isAuthenticated = useAuthState()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  // Suggestions

  const getSuggestions = useCallback(
    async (q: string) => {
      const trimmed = q.trim()
      if (!trimmed) return null

      setLoading(true)
      setError(null)
      try {
        const res = isAuthenticated
          ? await searchService.suggestions(trimmed)
          : await searchService.suggestionsPublic(trimmed)
        return res.data ?? null
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? 'Something went wrong'
            : 'Something went wrong'
        )
        return null
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated]
  )

  // Search

  const search = useCallback(
    async (rawParams: Record<string, any>) => {
      const params = sanitizeParams(rawParams)
      if (!params) return null

      setLoading(true)
      setError(null)

      try {

        if (isAuthenticated) {
          try {
            const res = await searchService.search(params)
            return res.data ?? null
          } catch (err) {
            if (!isEnumValidationError(err)) throw err
            try {
              const res = await searchService.searchPublic(params)
              return res.data ?? null
            } catch (err2) {
              if (!isEnumValidationError(err2)) throw err2
              const reduced: SearchParams = { q: params.q }
              if (params.type) reduced.type = params.type
              const res = await searchService.searchPublic(reduced)
              return res.data ?? null
            }
          }
        } else {
          const res = await searchService.searchPublic(params)
          return res.data ?? null
        }
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? 'Something went wrong'
            : 'Something went wrong'
        )
        return null
      } finally {
        setLoading(false)
      }
    },
    [isAuthenticated]
  )

  // History

  const getHistory = useCallback(async () => {
    setError(null)
    try {
      const res = await searchService.getHistory()
      return res.data ?? null
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Something went wrong'
          : 'Something went wrong'
      )
      return null
    }
  }, [])

  const addToHistory = useCallback(async (item: { id: string; type: string }) => {
    try {
      return await searchService.addToHistory(item)
    } catch {
      return null
    }
  }, [])

  const deleteHistoryItem = useCallback(async (historyId: string) => {
    setError(null)
    try {
      return await searchService.deleteHistoryItem(historyId)
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? 'Something went wrong'
          : 'Something went wrong'
      )
      return null
    }
  }, [])

  return {
    getSuggestions,
    search,
    addToHistory,
    getHistory,
    deleteHistoryItem,
    loading,
    error,
  }
}

export default useSearch