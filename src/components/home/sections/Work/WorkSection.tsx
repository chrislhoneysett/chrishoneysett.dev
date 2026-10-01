import { WorkProjectGallery } from './WorkProjectGallery'
import { moreProjects, selectedProjects } from '@/data/selectedProjects'
import styles from './Work.module.css'

export function WorkSection() {
  return (
    <section className={styles.work} id='work' aria-labelledby='work-title'>
      <div className={styles.sectionHeader}>
        <p className={styles.sectionLabel}>01 / Selected work</p>
        <div>
          <h2 id='work-title'>
            The pieces
            <br />
            come <em>together.</em>
          </h2>
          <p>
            Across public websites, internal tools, and connected mobile apps, I
            turn project goals into practical interface decisions. These
            projects show how I bring design, reusable code, and the details of
            implementation together.
          </p>
          <p className={styles.workNote}>
            Some project names, imagery, and details are kept general to respect
            client confidentiality.
          </p>
        </div>
      </div>
      <WorkProjectGallery
        projects={selectedProjects}
        moreProjects={moreProjects}
      />
    </section>
  )
}
