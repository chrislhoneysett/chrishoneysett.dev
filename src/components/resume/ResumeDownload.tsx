import { profile } from '@/data/profile'
import { assetPath } from '@/lib/assetPath'
import styles from './ResumeDownload.module.css'

export function ResumeDownload({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel
  const pdf = assetPath('/downloads/chris-honeysett-resume.pdf')

  return (
    <div className={styles.content}>
      <p className={styles.kicker}>{profile.name} / Resume</p>
      <Heading className={styles.title} id='resume-title'>Experience,<br /><em>on paper.</em></Heading>
      <p className={styles.headline}>{profile.headline}</p>
      <p className={styles.description}>
        My experience, capabilities, education, and selected project highlights in a two-page PDF.
      </p>
      <div className={styles.actions}>
        <a className={styles.download} href={pdf} download='Chris-Honeysett-Resume.pdf'>Download resume <span aria-hidden='true'>↓</span></a>
        <a className={styles.view} href={pdf}>View PDF <span aria-hidden='true'>↗</span></a>
      </div>
      <p className={styles.detail}>PDF / 2 pages</p>
    </div>
  )
}
