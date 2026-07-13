import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

interface SectionHeadingProps {
  children: ReactNode
  id?: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'light' | 'dark'
  className?: string
}

/** Fraunces serif section title (h2). */
export function SectionHeading({
  children,
  id,
  size = 'md',
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const cls = [styles.heading, styles[size], tone === 'dark' && styles.dark, className]
    .filter(Boolean)
    .join(' ')
  return (
    <h2 id={id} className={cls}>
      {children}
    </h2>
  )
}
