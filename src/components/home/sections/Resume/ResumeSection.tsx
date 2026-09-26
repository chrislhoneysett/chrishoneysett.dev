import { ResumeDownload } from '@/components/resume/ResumeDownload'
import styles from './Resume.module.css'

export function ResumeSection() {
  return (
    <section className={styles.section} id='resume' aria-labelledby='resume-title'>
      <ResumeDownload twoColumns />
    </section>
  )
}
