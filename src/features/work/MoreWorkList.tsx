import type { MoreWorkItem } from '@/i18n/types'
import styles from './Work.module.css'

interface MoreWorkListProps {
  items: MoreWorkItem[]
}

export function MoreWorkList({ items }: MoreWorkListProps) {
  return (
    <div className={styles.moreGrid}>
      {items.map((item) => (
        <div key={item.name} className={styles.moreItem}>
          <div className={styles.moreName}>{item.name}</div>
          <div className={styles.moreDesc}>{item.desc}</div>
          {item.link && (
            <a
              className={styles.moreLink}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.linkLabel} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
