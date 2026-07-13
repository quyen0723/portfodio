import type { AnchorHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'solid' | 'dark' | 'outline'
type Size = 'sm' | 'md'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: Variant
  size?: Size
}

/** Pill-shaped link/button used across nav and CTAs. */
export function Button({
  children,
  variant = 'solid',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  const cls = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(' ')
  return (
    <a className={cls} {...rest}>
      {children}
    </a>
  )
}
