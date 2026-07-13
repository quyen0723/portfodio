import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import { asset } from '@/lib/asset'
import styles from './Beyond.module.css'

export function Beyond() {
  const { content } = useLanguage()

  return (
    <Section id="beyond" labelledBy="beyond-title">
      <Reveal className={styles.header}>
        <Eyebrow>{content.byEyebrow}</Eyebrow>
        <SectionHeading id="beyond-title" size="sm" className={styles.title}>
          {content.byTitle}
        </SectionHeading>
        <p className={styles.intro}>{content.byIntro}</p>
      </Reveal>

      <Reveal className={styles.gallery}>
        <div className={styles.tall}>
          <img src={asset('assets/run-finish.webp')} alt="" loading="lazy" />
        </div>
        <div className={styles.stack}>
          <div className={styles.cell}>
            <img src={asset('assets/hovilo-team.webp')} alt="" loading="lazy" />
          </div>
          <div className={styles.cell}>
            <img src={asset('assets/award-stage.webp')} alt="" loading="lazy" />
          </div>
        </div>
        <div className={styles.tall}>
          <img src={asset('assets/run-road.webp')} alt="" loading="lazy" />
        </div>
      </Reveal>
    </Section>
  )
}
