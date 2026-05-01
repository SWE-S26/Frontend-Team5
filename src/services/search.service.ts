import api from '@/lib/api'
import type { SearchParams } from '@/hooks/useSearch'

function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
  )
}

export const searchService = {
  // Authenticated endpoints
  search: (params: SearchParams) =>
    api.get('/api/feed/v1/search', { params: cleanParams(params as any) }),

  suggestions: (q: string) =>
    api.get('/api/feed/v1/search/suggestions', { params: { q } }),

  getHistory: () =>
    api.get('/api/feed/v1/search/history'),

  addToHistory: (item: { id: string; type: string }) =>
    api.post('/api/feed/v1/search/add-to-history', item),

  deleteHistoryItem: (historyId: string) =>
    api.delete(`/api/feed/v1/search/history/${historyId}`),

  // Public endpoints (unauthenticated)
  searchPublic: (params: SearchParams) =>
    api.get('/api/public/feed/v1/search', { params: cleanParams(params as any) }),

  suggestionsPublic: (q: string) =>
    api.get('/api/public/feed/v1/search/suggestions', { params: { q } }),
}

export default searchService