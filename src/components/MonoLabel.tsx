import type { ReactNode } from 'react'
import styles from './MonoLabel.module.css'

interface MonoLabelProps {
  children: ReactNode
  tone?: 'label' | 'faint' | 'accent'
  className?: string
}

/** Small mono, uppercase, letter-spaced field label. */
export function MonoLabel({ children, tone = 'label', className }: MonoLabelProps) {
  const cls = [styles.mono, styles[tone], className].filter(Boolean).join(' ')
  return <div className={cls}>{children}</div>
}
