import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { MonoLabel } from '@/components/MonoLabel'
import { useLanguage } from '@/hooks/useLanguage'
import styles from './Skills.module.css'

export function Skills() {
  const { content } = useLanguage()

  return (
    <Section id="skills" bg="surface" labelledBy="skills-title">
      <Reveal className={styles.header}>
        <Eyebrow>{content.skEyebrow}</Eyebrow>
        <SectionHeading id="skills-title" className={styles.title}>
          {content.skTitle}
        </SectionHeading>
      </Reveal>

      <div className={styles.grid}>
        {content.skills.map((group) => (
          <Reveal key={group.domain}>
            <h3 className={styles.domain}>{group.domain}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.footer}>
        <div>
          <MonoLabel className={styles.footLabel}>{content.lblCerts}</MonoLabel>
          <ul className={styles.certs}>
            {content.certs.map((cert) => (
              <li key={cert} className={styles.cert}>
                {cert}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <MonoLabel className={styles.footLabel}>{content.lblLang}</MonoLabel>
          <p className={styles.langBody}>{content.langBody}</p>
        </div>
      </Reveal>
    </Section>
  )
}
