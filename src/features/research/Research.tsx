import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import { asset, assetSize } from '@/lib/asset'
import styles from './Research.module.css'

const FIG1 = 'assets/ice-award.webp'
const FIG2 = 'assets/ice-present.webp'

export function Research() {
  const { content } = useLanguage()

  return (
    <Section id="research" bg="dark" labelledBy="research-title">
      <Reveal className={styles.header}>
        <Eyebrow tone="dark">{content.resEyebrow}</Eyebrow>
        <SectionHeading id="research-title" tone="dark" className={styles.title}>
          {content.resTitle}
        </SectionHeading>
        <p className={styles.intro}>{content.resIntro}</p>
      </Reveal>

      <Reveal className={styles.figures}>
        <figure className={styles.figure}>
          <div className={styles.figMedia}>
            <img
              src={asset(FIG1)}
              alt={content.resCap1}
              loading="lazy"
              width={assetSize(FIG1)?.width}
              height={assetSize(FIG1)?.height}
              style={{ objectPosition: '50% 38%' }}
            />
          </div>
          <figcaption className={styles.figCaption}>{content.resCap1}</figcaption>
        </figure>
        <figure className={styles.figure}>
          <div className={styles.figMedia}>
            <img
              src={asset(FIG2)}
              alt={content.resCap2}
              loading="lazy"
              width={assetSize(FIG2)?.width}
              height={assetSize(FIG2)?.height}
            />
          </div>
          <figcaption className={styles.figCaption}>{content.resCap2}</figcaption>
        </figure>
      </Reveal>

      <div className={styles.pubs}>
        {content.pubs.map((pub) => (
          <Reveal key={pub.title} className={styles.pub}>
            <div className={styles.pubMeta}>
              <span className={styles.badge}>{pub.badge}</span>
              <span className={styles.venue}>{pub.venue}</span>
            </div>
            <div className={styles.pubTitle}>{pub.title}</div>
            <div className={styles.pubFoot}>
              <span>{pub.role}</span>
              <span>{pub.date}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className={styles.orcid}>ORCID · 0009-0002-1025-2669</div>
      </Reveal>
    </Section>
  )
}
