import { useEffect, useRef } from 'react'

/**
 * Reveal-on-scroll. All instances share one IntersectionObserver so the page
 * scales to dozens of revealed elements with a single observer allocation.
 * Respects prefers-reduced-motion (elements are shown immediately).
 */
let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
  }
  return observer
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = getObserver()
    if (reduce || !io) {
      el.classList.add('is-visible')
      return
    }
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return ref
}
