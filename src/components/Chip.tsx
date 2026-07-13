import styles from './Chip.module.css'

interface ChipProps {
  children: string
}

/** Bordered pill used for the hero fact chips. */
export function Chip({ children }: ChipProps) {
  return <span className={styles.chip}>{children}</span>
}
