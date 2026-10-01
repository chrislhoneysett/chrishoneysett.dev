import { skills } from '@/data/skills'
import styles from './Capabilities.module.css'

export function CapabilitiesSection() {
  return (
    <section
      className={styles.capabilities}
      aria-labelledby='capabilities-title'
    >
      <p className={styles.sectionLabel}>04 / Capabilities</p>
      <div>
        <h2 id='capabilities-title'>
          Technical
          <br />
          <em>strengths.</em>
        </h2>
        <p className={styles.capabilitiesIntro}>
          I build responsive interfaces, reusable components, and clear APIs
          that help teams develop and maintain products. My graphic design
          background informs the visual details; my engineering experience
          supports the structure behind them.
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
