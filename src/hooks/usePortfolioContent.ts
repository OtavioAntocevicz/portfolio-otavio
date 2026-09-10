import { useCallback, useEffect, useState } from 'react'
import { getFallbackView } from '../data/fallbackContent.ts'
import { fetchPortfolioView } from '../services/portfolioService.ts'
import type { PortfolioView } from '../types/cms.ts'

export function usePortfolioContent(lng: 'pt' | 'en') {
  const [content, setContent] = useState<PortfolioView>(() => getFallbackView(lng))
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const view = await fetchPortfolioView(lng)
      setContent(view)
    } catch {
      setContent(getFallbackView(lng))
    } finally {
      setLoading(false)
    }
  }, [lng])

  useEffect(() => {
    void reload()
  }, [reload])

  return { content, loading, reload }
}
