import type { SyntheticEvent } from 'react'

const PROJECT_FALLBACK_IMAGE = '/Img-projetos/placeholder.svg'

export function onProjectImageError(e: SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget
  if (el.src.includes('placeholder.svg')) return
  el.src = PROJECT_FALLBACK_IMAGE
}
