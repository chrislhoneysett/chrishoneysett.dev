import { skills } from '@/data/skills'
import styles from './Capabilities.module.css'

export function CapabilitiesSection() {
  return (
    <section className={styles.capabilities} aria-labelledby='capabilities-title'>
      <p className={styles.sectionLabel}>04 / Capabilities</p>
      <div>
        <h2 id='capabilities-title'>Technical<br /><em>strengths.</em></h2>
        <p className={styles.capabilitiesIntro}>
          The tools have changed as the work has grown. I use them together to
          build interfaces people can use and systems another engineer can
          keep improving.
        </p>
      </div>
      <div className={styles.skillList}>
        {skills.map((group) => (
          <div key={group.id}>
            <h3>{group.label}</h3>
            <p>{group.items.join(' · ')}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
