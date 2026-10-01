import { profile } from '@/data/profile'
import { Icon } from '@/components/Icon'
import styles from './Hero.module.css'

export function HeroSection() {
  const [role, focus] = profile.headline.split(' | ')

  return (
    <header className={styles.hero}>
      <div className={styles.heroTopline}>
        <div className={styles.profileHeadline}>
          <span>{role}</span>
          <span className={styles.headlineSeparator} aria-hidden='true' />
          <br className={styles.mobileHeadlineBreak} />
          <span>{focus}</span>
        </div>
        <span>{profile.location}</span>
      </div>
      <div className={styles.heroMain}>
        <p className={styles.kicker}>
          <span className={styles.kickerDot} /> Engineering informed by
          graphic design
        </p>
        <div className={styles.heroRow}>
        <div className={styles.heroCopy}>
          <h1>
            <span className={styles.taglineLine}>Clear vision.</span>{' '}
            <span className={styles.taglineLine}>
              Crafted <em>code.</em>
            </span>
          </h1>
        </div>
        <div className={styles.heroSupport}>
          <p className={styles.heroLead}>
            I build web and mobile products with React and React Native, taking
            responsibility from early planning through release and the
            improvements that follow. I work closely with clients, designers,
            and engineers to turn complex needs into software that is clear,
            useful, and maintainable.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href='#work'>
              View projects <Icon name='north-east' />
            </a>
            <a className={styles.secondaryLink} href='#experience'>
              Career background <span aria-hidden='true'>↓</span>
            </a>
          </div>
        </div>
        </div>
      </div>
      <div className={styles.heroFooter}>
        <div>
          <strong>
            28<span>+</span>
          </strong>
          <small>years across graphic design &amp; software development</small>
        </div>
        <div>
          <strong>
            17<span>+</span>
          </strong>
          <small>
            years guiding
            <br />
            frontend projects
          </small>
        </div>
        <div>
          <strong>Web / Mobile</strong>
          <small>
            from interface systems
            <br />
            to connected devices
          </small>
        </div>
        <a href='#work'>
          Scroll to explore <span aria-hidden='true'>↓</span>
        </a>
      </div>
    </header>
  )
}
