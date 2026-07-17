import { MonoLabel } from '@/components/MonoLabel'
import type { PortfolioContent, Project } from '@/i18n/types'
import styles from './Work.module.css'

interface ProjectCardProps {
  project: Project
  labels: Pick<
    PortfolioContent,
    'lblProblem' | 'lblApproach' | 'lblHighlights' | 'lblImpact'
  >
}

export function ProjectCard({ project, labels }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.tag}>{project.tag}</span>
        <span className={styles.year}>{project.year}</span>
      </div>

      <h3 className={styles.name}>{project.name}</h3>
      <div className={styles.subRow}>
        <span className={styles.sub}>{project.sub}</span>
        {project.link && (
          <a
            className={styles.projectLink}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.linkLabel} <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>

      <div className={styles.pa}>
        <div>
          <MonoLabel>{labels.lblProblem}</MonoLabel>
          <p className={styles.paText}>{project.problem}</p>
        </div>
        <div>
          <MonoLabel>{labels.lblApproach}</MonoLabel>
          <p className={styles.paText}>{project.approach}</p>
        </div>
      </div>

      <div className={styles.highlights}>
        <MonoLabel className={styles.highlightsLabel}>{labels.lblHighlights}</MonoLabel>
        <ul className={styles.highlightList}>
          {project.highlights.map((h) => (
            <li key={h} className={styles.highlightItem}>
              <span className={styles.bullet} aria-hidden="true" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className={styles.stack}>
        {project.stack.map((s) => (
          <li key={s} className={styles.stackTag}>
            {s}
          </li>
        ))}
      </ul>

      <div className={styles.impact}>
        <MonoLabel className={styles.impactLabel}>{labels.lblImpact}</MonoLabel>
        <span className={styles.impactValue}>{project.impact}</span>
      </div>
    </article>
  )
}
