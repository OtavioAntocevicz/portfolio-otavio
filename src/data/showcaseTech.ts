import type { ContentListRow } from '../types/cms.ts'

/** Categorias do bloco "Ecossistema em destaque" (editável no CMS). */
export type ShowcaseCategoryDef = {
  listId: string
  id: string
  labelPt: string
  labelEn: string
  itemsPt: string[]
  itemsEn: string[]
}

export const SHOWCASE_CATEGORY_DEFS: ShowcaseCategoryDef[] = [
  {
    listId: 'showcase_cloud',
    id: 'cloud',
    labelPt: 'Cloud & deploy',
    labelEn: 'Cloud & deploy',
    itemsPt: [
      'Supabase',
      'Railway',
      'Vercel',
      'Docker',
      'Postgres / RLS',
      'Edge Functions',
    ],
    itemsEn: [
      'Supabase',
      'Railway',
      'Vercel',
      'Docker',
      'Postgres / RLS',
      'Edge Functions',
    ],
  },
  {
    listId: 'showcase_devtools',
    id: 'devtools',
    labelPt: 'DevTools, CLI & IA',
    labelEn: 'DevTools, CLI & AI',
    itemsPt: ['MCP', 'Cursor CLI', 'GitHub CLI', 'Vite 8', 'CI/CD', 'APIs REST'],
    itemsEn: ['MCP', 'Cursor CLI', 'GitHub CLI', 'Vite 8', 'CI/CD', 'REST APIs'],
  },
  {
    listId: 'showcase_security',
    id: 'security',
    labelPt: 'Cybersecurity',
    labelEn: 'Cybersecurity',
    itemsPt: ['OAuth 2.0', 'JWT', 'HTTPS / TLS', 'Secrets & env', 'OWASP', 'Auth & RLS'],
    itemsEn: ['OAuth 2.0', 'JWT', 'HTTPS / TLS', 'Secrets & env', 'OWASP', 'Auth & RLS'],
  },
]

export function getDefaultShowcaseLists(): ContentListRow[] {
  return SHOWCASE_CATEGORY_DEFS.map((def) => ({
    id: def.listId,
    label_pt: def.labelPt,
    label_en: def.labelEn,
    items_pt: def.itemsPt,
    items_en: def.itemsEn,
  }))
}

export type ShowcaseCategoryView = {
  id: string
  label: string
  items: string[]
}

export function resolveShowcaseCategories(
  lists: ContentListRow[],
  lng: 'pt' | 'en',
): ShowcaseCategoryView[] {
  const isEn = lng === 'en'
  return SHOWCASE_CATEGORY_DEFS.map((def) => {
    const row = lists.find((l) => l.id === def.listId)
    const label = isEn
      ? row?.label_en || def.labelEn
      : row?.label_pt || def.labelPt
    const items = isEn
      ? row?.items_en?.length
        ? row.items_en
        : def.itemsEn
      : row?.items_pt?.length
        ? row.items_pt
        : def.itemsPt
    return { id: def.id, label, items }
  })
}

export function mergeMarqueeSkills(base: string[], extraItems: string[]) {
  const extra = extraItems
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of [...base, ...extra]) {
    const key = item.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}
