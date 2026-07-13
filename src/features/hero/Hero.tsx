import { Reveal } from '@/components/Reveal'
import { Chip } from '@/components/Chip'
import { Button } from '@/components/Button'
import { Eyebrow } from '@/components/Eyebrow'
import { useLanguage } from '@/hooks/useLanguage'
import { asset, assetSize } from '@/lib/asset'
import styles from './Hero.module.css'

const PORTRAIT = 'assets/hero-portrait.webp'

export function Hero() {
  const { content } = useLanguage()
  const size = assetSize(PORTRAIT)

  return (
    <header id="top" className={styles.hero}>
      <div className={styles.blob} aria-hidden="true" />

      <div className={styles.grid}>
        <Reveal className={styles.intro}>
          <Eyebrow>{content.heroEyebrow}</Eyebrow>

          <h1 className={styles.name}>
            Nguyễn Ngọc
            <br />
            Mỹ Quyên
          </h1>

          <p className={styles.tagline}>
            {content.heroTitleA} <span className={styles.taglineAccent}>{content.heroTitleB}</span>
          </p>

          <p className={styles.sub}>{content.heroSub}</p>

          <ul className={styles.chips}>
            {content.chips.map((chip) => (
              <li key={chip}>
                <Chip>{chip}</Chip>
              </li>
            ))}
          </ul>

          <div className={styles.ctas}>
            <Button href="#work" variant="solid">
              {content.ctaWork}
            </Button>
            <Button href="#contact" variant="outline">
              {content.ctaContact}
            </Button>
          </div>

          <ul className={styles.proof}>
            {content.heroProof.map((item) => (
              <li key={item} className={styles.proofItem}>
                <span className={styles.proofDot} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className={styles.figure}>
          <div className={styles.portrait}>
            <img
              src={asset(PORTRAIT)}
              alt="Nguyễn Ngọc Mỹ Quyên"
              width={size?.width}
              height={size?.height}
              fetchPriority="high"
            />
          </div>
          <div className={styles.badge}>
            <span className={styles.online} aria-hidden="true" />
            <span>{content.heroBadge}</span>
          </div>
        </Reveal>
      </div>
    </header>
  )
}
