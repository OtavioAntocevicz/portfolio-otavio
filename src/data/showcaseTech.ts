/** Itens extras no front (teste visual) — não vêm do CMS. */
export type ShowcaseCategory = {
  id: string
  labelPt: string
  labelEn: string
  items: string[]
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  {
    id: 'cloud',
    labelPt: 'Cloud & deploy',
    labelEn: 'Cloud & deploy',
    items: [
      'Supabase',
      'Railway',
      'Vercel',
      'Docker',
      'Postgres / RLS',
      'Edge Functions',
    ],
  },
  {
    id: 'devtools',
    labelPt: 'DevTools, CLI & IA',
    labelEn: 'DevTools, CLI & AI',
    items: [
      'MCP',
      'Cursor CLI',
      'GitHub CLI',
      'Vite 8',
      'CI/CD',
      'APIs REST',
    ],
  },
  {
    id: 'security',
    labelPt: 'Cybersecurity',
    labelEn: 'Cybersecurity',
    items: [
      'OAuth 2.0',
      'JWT',
      'HTTPS / TLS',
      'Secrets & env',
      'OWASP',
      'Auth & RLS',
    ],
  },
]

export function showcaseItems() {
  return SHOWCASE_CATEGORIES.flatMap((c) => c.items)
}

export function mergeMarqueeSkills(base: string[], _lng: 'pt' | 'en') {
  const extra = showcaseItems()
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
