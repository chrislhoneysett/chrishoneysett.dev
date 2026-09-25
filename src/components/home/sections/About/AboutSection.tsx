import { profile } from '@/data/profile'
import { education } from '@/data/education'
import styles from './About.module.css'

export function AboutSection() {
  const foundation = education[0]

  return (
    <section className={styles.about} id='about' aria-labelledby='about-title'>
      <div>
        <p className={styles.sectionLabel}>05 / What carries through</p>
        <p className={styles.aboutAside}>
          What began as visual communication now shapes how I build software
          for the people using it.
        </p>
      </div>
      <div className={styles.aboutMain}>
        <h2 id='about-title'>
          The work is still<br />
          about <em>people.</em>
        </h2>
        <p>{profile.summary}</p>
        <div className={styles.education}>
          <span>Foundation</span>
          <p>
            <strong>{foundation.degree}</strong><br />
            Minor {foundation.minor}<br />
            {foundation.institution} · {foundation.location}
          </p>
        </div>
      </div>
    </section>
  )
}
