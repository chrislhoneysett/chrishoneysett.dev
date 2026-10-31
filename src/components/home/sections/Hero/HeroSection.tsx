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
          <span className={styles.kickerDot} /> Engineering informed by graphic
          design
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
              I build reusable React foundations and take complex web and mobile
              interfaces from architecture through release. My work connects
              component systems, data-rich dashboards, and React Native apps
              with asynchronous device and cloud behavior. A graphic design
              background helps me make those systems clear to use.
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
    </header>
  )
}
