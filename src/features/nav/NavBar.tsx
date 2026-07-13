import { Button } from '@/components/Button'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './NavBar.module.css'

export function NavBar() {
  const { content, locale, toggle } = useLanguage()

  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.inner}>
        <a href="#top" className={styles.logo}>
          Mỹ&nbsp;Quyên<span className={styles.dot}>.</span>
        </a>

        <div className={styles.links}>
          <a href="#about">{content.navAbout}</a>
          <a href="#work">{content.navWork}</a>
          <a href="#research">{content.navResearch}</a>
          <a href="#awards">{content.navAwards}</a>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.langToggle}
            onClick={toggle}
            aria-label={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            {content.langLabel}
          </button>
          <Button href="#contact" variant="dark" size="sm">
            {content.navCta}
          </Button>
        </div>
      </div>
    </nav>
  )
}
