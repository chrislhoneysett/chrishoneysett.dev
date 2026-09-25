import { WorkProjectGallery } from './WorkProjectGallery'
import { moreProjects, selectedProjects } from '@/data/selectedProjects'
import styles from './Work.module.css'

export function WorkSection() {
  return (
    <section className={styles.work} id='work' aria-labelledby='work-title'>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionLabel}>01 / Selected work</p>
        <div>
          <h2 id='work-title'>The pieces<br /><em>come together.</em></h2>
          <p>
            That way of working has taken different forms. Whether I am
            building a public website, an internal tool, or a mobile app for a
            connected product, I start with the people who need it and stay
            with the details that make the whole experience work.
          </p>
          <p className={styles.workNote}>
            Some project names, imagery, and details are kept general to
            respect client confidentiality.
          </p>
        </div>
      </div>
      <WorkProjectGallery projects={selectedProjects} moreProjects={moreProjects} />
    </section>
  )
}
