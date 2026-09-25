import type { ResumeProject } from '@/data/projects'
import styles from './WorkProjectGallery.module.css'
import Image from 'next/image'
import { Arrow } from '../../Arrow'
import { assetPath } from '@/lib/assetPath'

type WorkProject = ResumeProject & { employer: string }

export const WorkProjectCard = ({
  project,
  index,
  onClick,
}: {
  project: WorkProject
  index: number
  onClick: () => void
}) => (
  <article className={styles.card} id={`project-${project.id}`}>
    <div
      className={`${styles.visual} ${styles[`visual${(index % 3) + 1}`]} ${project.heroImage?.kind === 'illustration' ? styles.withIllustration : project.heroImage ? styles.withScreenshot : ''}`}
      aria-hidden='true'
    >
      {project.heroImage ? (
        <Image
          className={
            project.heroImage.kind === 'illustration'
              ? styles.heroIllustration
              : styles.heroScreenshot
          }
          src={assetPath(project.heroImage.src)}
          alt=''
          unoptimized={project.heroImage.src.endsWith('-card.webp')}
          width={500}
          height={300}
        />
      ) : null}
      <span className={styles.visualType}>{project.type}</span>
      <span className={styles.shape} />
      {project.projectOrigin ? (
        <span className={styles.originBanner}>{project.projectOrigin}</span>
      ) : null}
    </div>
    <div className={styles.cardBody}>
      <div className={styles.meta}>
        <span>{project.employer}</span>
        <span>{project.type}</span>
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <ul className={styles.tags} aria-label='Technologies used'>
        {project.technologies.map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <button className={styles.openButton} type='button' onClick={onClick}>
        View project <Arrow />
      </button>
    </div>
  </article>
)
