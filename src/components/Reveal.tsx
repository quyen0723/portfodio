import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

interface RevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/** Generic block that fades/slides in when scrolled into view. */
export function Reveal({ children, className, style }: RevealProps) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={['reveal', className].filter(Boolean).join(' ')} style={style}>
      {children}
    </div>
  )
}
