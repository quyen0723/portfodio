import type { CSSProperties, ReactNode } from 'react'
import { Container } from './Container'
import styles from './Section.module.css'

type Background = 'default' | 'surface' | 'dark' | 'darker' | 'gradient'
type Size = 'default' | 'narrow' | 'tight'

interface SectionProps {
  id?: string
  children: ReactNode
  bg?: Background
  size?: Size
  /** id of the heading that labels this region, for screen readers. */
  labelledBy?: string
  className?: string
  style?: CSSProperties
}

const bgClass: Record<Background, string> = {
  default: '',
  surface: styles.surface,
  dark: styles.dark,
  darker: styles.darker,
  gradient: styles.gradient,
}

/** Full-bleed section band with the standard vertical rhythm and an inner container. */
export function Section({
  id,
  children,
  bg = 'default',
  size = 'default',
  labelledBy,
  className,
  style,
}: SectionProps) {
  const cls = [styles.section, bgClass[bg], className].filter(Boolean).join(' ')
  return (
    <section id={id} className={cls} aria-labelledby={labelledBy} style={style}>
      <Container size={size}>{children}</Container>
    </section>
  )
}
