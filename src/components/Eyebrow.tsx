import styles from './Eyebrow.module.css'

interface EyebrowProps {
  children: string
  align?: 'start' | 'center'
  tone?: 'light' | 'dark'
  /** 'single' = leading rule, 'double' = rule on both sides, 'none' = text only. */
  rule?: 'single' | 'double' | 'none'
}

/** The recurring mono, letter-spaced section label with an accent rule. */
export function Eyebrow({
  children,
  align = 'start',
  tone = 'light',
  rule = 'single',
}: EyebrowProps) {
  const cls = [styles.eyebrow, align === 'center' && styles.center, tone === 'dark' && styles.dark]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls}>
      {rule !== 'none' && <span className={styles.line} aria-hidden="true" />}
      <span className={styles.label}>{children}</span>
      {rule === 'double' && <span className={styles.line} aria-hidden="true" />}
    </div>
  )
}
