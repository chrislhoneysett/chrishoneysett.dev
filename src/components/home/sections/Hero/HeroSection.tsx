import { HeroMark } from './HeroMark'
import { profile } from '@/data/profile'
import { Icon } from '@/components/Icon'
import { ContactDialog } from '@/components/ContactDialog'
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
        <div className={styles.heroRow}>
          <div className={styles.heroCopy}>
            <div className={styles.identity}>
              <HeroMark />
              <div className={styles.identityCopy}>
                <h1 className={styles.name}>
                  <span>Chris</span>
                  <span className={styles.lastName}>Honeysett</span>
                </h1>
                <p className={styles.role}>
                  <span>Frontend &amp; Mobile</span>
                  <span>Engineering</span>
                </p>
                <p className={styles.identityLocation}>{profile.location}</p>
              </div>
            </div>
          </div>
          <div className={styles.heroSupport}>
            <p className={styles.heroLead}>
              I build reusable React foundations and take complex web and mobile
              interfaces from architecture through release. My work connects
              component systems, data-rich dashboards, and React Native apps
              with asynchronous device and cloud behavior. My background in print
              design gives me an eye for typography, layout, and visual consistency.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primaryLink} href='#work'>
                View projects <Icon name='north-east' />
              </a>
              <ContactDialog
                id='hero-contact'
                className={styles.secondaryLink}
                label='Contact me'
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
