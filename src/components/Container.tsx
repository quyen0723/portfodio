import type { CSSProperties, ReactNode } from 'react'
import styles from './Container.module.css'

type Size = 'default' | 'narrow' | 'tight'

interface ContainerProps {
  children: ReactNode
  size?: Size
  /** Adds the standard vertical section rhythm. */
  padY?: boolean
  className?: string
  style?: CSSProperties
}

const sizeClass: Record<Size, string> = {
  default: styles.default,
  narrow: styles.narrow,
  tight: styles.tight,
}

export function Container({
  children,
  size = 'default',
  padY = false,
  className,
  style,
}: ContainerProps) {
  const cls = [styles.container, sizeClass[size], padY && styles.padY, className]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}
