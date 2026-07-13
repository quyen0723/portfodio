import type { CSSProperties } from 'react'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './Philosophy.module.css'

// Philosophy uses a taller rhythm than the default section band.
const RHYTHM = { '--section-y': 'clamp(84px, 13vw, 160px)' } as CSSProperties

export function Philosophy() {
  const { content } = useLanguage()

  return (
    <Section id="philosophy" bg="gradient" size="narrow" style={RHYTHM} className={styles.section}>
      <div className={styles.inner}>
        <Reveal className={styles.eyebrow}>
          <Eyebrow align="center" rule="double">
            {content.philEyebrow}
          </Eyebrow>
        </Reveal>
        <div className={styles.lines}>
          {content.philLines.map((line) => (
            <Reveal key={line}>
              <p className={styles.line}>{line}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className={styles.attribution}>— Mỹ Quyên</div>
        </Reveal>
      </div>
    </Section>
  )
}
