import { useEffect } from 'react'

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const { body, documentElement: html } = document
    const scrollY = window.scrollY
    const scrollbarGap = window.innerWidth - html.clientWidth
    const prevBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    }
    const prevHtmlOverflow = html.style.overflow

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`
    html.style.overflow = 'hidden'

    return () => {
      const prevScrollBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      Object.assign(body.style, prevBody)
      html.style.overflow = prevHtmlOverflow
      window.scrollTo(0, scrollY)
      html.style.scrollBehavior = prevScrollBehavior
    }
  }, [locked])
}
