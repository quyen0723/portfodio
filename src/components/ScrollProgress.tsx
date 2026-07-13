import { useScrollProgress } from '@/hooks/useScrollProgress'
import styles from './ScrollProgress.module.css'

/** Thin accent bar pinned to the top, tracking reading progress. */
export function ScrollProgress() {
  const progress = useScrollProgress()
  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.bar} style={{ width: `${progress}%` }} />
    </div>
  )
}
