import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './About.module.css'

export function About() {
  const { content } = useLanguage()

  return (
    <Section id="about" labelledBy="about-title">
      <div className={styles.grid}>
        <Reveal>
          <Eyebrow>{content.aboutEyebrow}</Eyebrow>
          <SectionHeading id="about-title" className={styles.title}>
            {content.aboutTitle}
          </SectionHeading>
        </Reveal>
        <Reveal className={styles.body}>
          <p>{content.aboutP1}</p>
          <p>{content.aboutP2}</p>
          <p>{content.aboutP3}</p>
        </Reveal>
      </div>
    </Section>
  )
}
