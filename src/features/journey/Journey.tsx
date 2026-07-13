import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './Journey.module.css'

export function Journey() {
  const { content } = useLanguage()

  return (
    <Section id="journey" bg="surface" labelledBy="journey-title">
      <Reveal className={styles.header}>
        <Eyebrow>{content.journeyEyebrow}</Eyebrow>
        <SectionHeading id="journey-title" className={styles.title}>
          {content.journeyTitle}
        </SectionHeading>
      </Reveal>

      <div className={styles.list}>
        {content.journey.map((item) => (
          <Reveal key={`${item.year}-${item.title}`} className={styles.item}>
            <div className={styles.year}>{item.year}</div>
            <div>
              <div className={styles.itemTitle}>{item.title}</div>
              <div className={styles.desc}>{item.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
