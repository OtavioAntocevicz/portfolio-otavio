import { useEffect, useRef } from 'react'

const DURATION_MS = 1400

export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window) || value <= 0) {
      el.textContent = String(value)
      return
    }

    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / DURATION_MS)
          const eased = 1 - Math.pow(1 - p, 4)
          el.textContent = String(Math.round(value * eased))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        el.textContent = '0'
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value])

  return <span ref={ref}>{value}</span>
}
