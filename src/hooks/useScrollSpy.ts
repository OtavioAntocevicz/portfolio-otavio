import { useEffect, useState } from 'react'

/** Retorna o id da seção visível no meio da viewport (`null` no topo/hero). */
export function useScrollSpy(ids: readonly string[], topId: string) {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    const targets = [topId, ...key.split('|')]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0 || !('IntersectionObserver' in window)) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          setActive(id === topId ? null : id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key, topId])

  return active
}
