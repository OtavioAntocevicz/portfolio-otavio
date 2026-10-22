import { getFallbackBundle, bundleToView } from '../data/fallbackContent.ts'
import { isSupabaseConfigured, supabase } from '../lib/supabase.ts'
import type { ContentListRow, PortfolioBundle, PortfolioView } from '../types/cms.ts'

function mergeContentLists(dbLists: ContentListRow[], fallbackLists: ContentListRow[]) {
  const map = new Map(fallbackLists.map((l) => [l.id, { ...l }]))
  for (const row of dbLists) {
    const base = map.get(row.id)
    map.set(row.id, base ? { ...base, ...row } : row)
  }
  return Array.from(map.values())
}

function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  return []
}

export async function fetchPortfolioBundle(): Promise<PortfolioBundle> {
  const fallback = getFallbackBundle()

  if (!isSupabaseConfigured || !supabase) {
    return fallback
  }

  try {
    const [settingsRes, experiencesRes, listsRes, projectsRes] = await Promise.all([
      supabase.from('portfolio_settings').select('*').eq('id', 'main').maybeSingle(),
      supabase.from('experience_entries').select('*').order('sort_order'),
      supabase.from('content_lists').select('*'),
      supabase.from('projects').select('*').order('sort_order'),
    ])

    if (settingsRes.error) throw settingsRes.error
    if (!settingsRes.data) return fallback

    const experiences = (experiencesRes.data ?? []).map((row) => ({
      ...row,
      items_pt: parseJsonArray(row.items_pt),
      items_en: parseJsonArray(row.items_en),
    }))

    const lists = (listsRes.data ?? []).map((row) => ({
      ...row,
      items_pt: parseJsonArray(row.items_pt),
      items_en: parseJsonArray(row.items_en),
    }))

    const projects = (projectsRes.data ?? []).map((row) => ({
      ...row,
      languages: parseJsonArray(row.languages),
    }))

    return {
      settings: settingsRes.data,
      experiences: experiences.length ? experiences : fallback.experiences,
      lists: mergeContentLists(lists, fallback.lists),
      projects: projects.length ? projects : fallback.projects,
    }
  } catch {
    return fallback
  }
}

export async function fetchPortfolioView(lng: 'pt' | 'en'): Promise<PortfolioView> {
  const bundle = await fetchPortfolioBundle()
  const view = bundleToView(bundle, lng)
  const usedCms =
    isSupabaseConfigured &&
    bundle.settings.id === 'main' &&
    bundle.projects.length > 0
  return { ...view, source: usedCms ? 'cms' : 'fallback' }
}
