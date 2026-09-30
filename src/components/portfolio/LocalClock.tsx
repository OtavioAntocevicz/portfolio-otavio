import { useEffect, useState } from 'react'

const TIME_ZONE = 'America/Sao_Paulo'

export function LocalClock({ locale }: { locale: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  const time = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  }).format(now)

  return (
    <time dateTime={now.toISOString()}>
      {time} · BRT (GMT-3)
    </time>
  )
}
