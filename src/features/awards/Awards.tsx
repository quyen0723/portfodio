import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import { asset, assetSize } from '@/lib/asset'
import styles from './Awards.module.css'

export function Awards() {
  const { content } = useLanguage()

  return (
    <Section id="awards" labelledBy="awards-title">
      <Reveal className={styles.header}>
        <Eyebrow>{content.awEyebrow}</Eyebrow>
        <SectionHeading id="awards-title" className={styles.title}>
          {content.awTitle}
        </SectionHeading>
        <p className={styles.intro}>{content.awIntro}</p>
      </Reveal>

      <div className={styles.grid}>
        {content.awards.map((award) => {
          const size = award.img ? assetSize(award.img) : undefined
          return (
            <Reveal key={award.title} className={styles.cardWrap}>
              <article className={styles.card}>
                {award.img && (
                  <div className={styles.media}>
                    <img
                      src={asset(award.img)}
                      alt={award.title}
                      loading="lazy"
                      width={size?.width}
                      height={size?.height}
                    />
                  </div>
                )}
                <div className={styles.body}>
                  <div className={styles.org}>{award.org}</div>
                  <div className={styles.cardTitle}>{award.title}</div>
                  <div className={styles.why}>{award.why}</div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      {content.awFootnote && (
        <Reveal>
          <div className={styles.footnote}>{content.awFootnote}</div>
        </Reveal>
      )}
    </Section>
  )
}
