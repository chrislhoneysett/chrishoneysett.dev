import { Icon } from '@/components/Icon'
import { profile } from '@/data/profile'
import { assetPath } from '@/lib/assetPath'
import styles from './ResumeDownload.module.css'

export function ResumeDownload({ headingLevel = 'h2', twoColumns = false }: { headingLevel?: 'h1' | 'h2'; twoColumns?: boolean }) {
  const Heading = headingLevel
  const pdf = assetPath('/downloads/chris-honeysett-resume.pdf')

  return (
    <div className={`${styles.content}${twoColumns ? ` ${styles.twoColumns}` : ''}`}>
      <div>
        <p className={styles.kicker}>{twoColumns ? '06 / RESUME' : `${profile.name} / Resume`}</p>
        <Heading className={styles.title} id='resume-title'>Experience,<br /><em>on paper.</em></Heading>
      </div>
      <div className={styles.details}>
        <p className={styles.headline}>{profile.headline}</p>
        <p className={styles.description}>
          My experience, capabilities, education, and selected project highlights in a two-page PDF.
        </p>
        <div className={styles.actions}>
          <a className={styles.download} href={pdf} download='Chris-Honeysett-Resume.pdf'>Download resume <Icon name='arrow-downward' /></a>
          <a className={styles.view} href={pdf} target='_blank' rel='noopener noreferrer'>View PDF <Icon name='north-east' /></a>
        </div>
        <p className={styles.detail}>PDF / 2 pages</p>
      </div>
    </div>
  )
}
