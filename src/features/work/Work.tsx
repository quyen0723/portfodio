import { Section } from '@/components/Section'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { SectionHeading } from '@/components/SectionHeading'
import { MonoLabel } from '@/components/MonoLabel'
import { useLanguage } from '@/hooks/useLanguage'
import { ProjectCard } from './ProjectCard'
import { MoreWorkList } from './MoreWorkList'
import styles from './Work.module.css'

export function Work() {
  const { content } = useLanguage()
  const labels = {
    lblProblem: content.lblProblem,
    lblApproach: content.lblApproach,
    lblHighlights: content.lblHighlights,
    lblImpact: content.lblImpact,
  }

  return (
    <Section id="work" labelledBy="work-title">
      <Reveal className={styles.header}>
        <Eyebrow>{content.workEyebrow}</Eyebrow>
        <SectionHeading id="work-title" className={styles.title}>
          {content.workTitle}
        </SectionHeading>
        <p className={styles.intro}>{content.workIntro}</p>
      </Reveal>

      <div className={styles.list}>
        {content.projects.map((project) => (
          <Reveal key={project.name}>
            <ProjectCard project={project} labels={labels} />
          </Reveal>
        ))}
      </div>

      <Reveal className={styles.more}>
        <MonoLabel tone="faint" className={styles.moreLabel}>
          {content.lblMore}
        </MonoLabel>
        <MoreWorkList items={content.moreWork} />
      </Reveal>
    </Section>
  )
}
