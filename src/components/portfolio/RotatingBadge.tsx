import { ArrowDownRight } from 'lucide-react'
import { useId } from 'react'

type Props = {
  text: string
  href: string
  label: string
}

const RADIUS = 38
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function RotatingBadge({ text, href, label }: Props) {
  const pathId = `badge-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const ring = `${text} ✦ `.repeat(2)
  const fontSize = Math.min(9, (CIRCUMFERENCE / ring.length) * 1.55)

  return (
    <a className="spin-badge" href={href} aria-label={label}>
      <svg className="spin-badge__ring" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <path
            id={pathId}
            d={`M50,50 m-${RADIUS},0 a${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
          />
        </defs>
        <text style={{ fontSize }} letterSpacing="0.12em">
          <textPath href={`#${pathId}`} textLength={CIRCUMFERENCE - 2}>
            {ring}
          </textPath>
        </text>
      </svg>
      <span className="spin-badge__core" aria-hidden>
        <ArrowDownRight size={24} strokeWidth={2} />
      </span>
    </a>
  )
}
