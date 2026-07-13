import type { CSSProperties } from 'react'
import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './Contact.module.css'

const RHYTHM = { '--section-y': 'clamp(80px, 12vw, 150px)' } as CSSProperties

export function Contact() {
  const { content } = useLanguage()

  return (
    <Section id="contact" bg="darker" style={RHYTHM} labelledBy="contact-title">
      <Reveal className={styles.header}>
        <div className={styles.eyebrow}>
          <Eyebrow tone="dark" rule="none">
            {content.ctEyebrow}
          </Eyebrow>
        </div>
        <SectionHeading id="contact-title" size="lg" tone="dark">
          {content.ctTitle}
        </SectionHeading>
      </Reveal>

      <Reveal>
        <p className={styles.intro}>{content.ctIntro}</p>
      </Reveal>

      <Reveal className={styles.socials}>
        {content.socials.map((social) => {
          const external = social.href.startsWith('http')
          return (
            <a
              key={social.label}
              className={styles.social}
              href={social.href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className={styles.socialLabel}>{social.label}</span>
              <span className={styles.socialHandle}>{social.handle}</span>
            </a>
          )
        })}
      </Reveal>

      <div className={styles.footer}>
        <span className={styles.footerName}>Nguyễn Ngọc Mỹ Quyên</span>
        <span className={styles.footerNote}>{content.footNote}</span>
      </div>
    </Section>
  )
}
