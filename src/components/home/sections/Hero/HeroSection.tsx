import Image from 'next/image'
import { profile } from '@/data/profile'
import { assetPath } from '@/lib/assetPath'
import { Arrow } from '../../Arrow'
import styles from './Hero.module.css'

export function HeroSection() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroTopline}>
        <span>{profile.headline}</span>
        <span>Kalamazoo, Michigan · Working across disciplines</span>
      </div>
      <div className={styles.heroMain}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            <span className={styles.kickerDot} /> Engineering informed by
            graphic design
          </p>
          <h1>
            Making
            <br />
            <em>complex</em>
            <br />
            feel clear<span className={styles.period}>.</span>
          </h1>
          <p className={styles.heroLead}>
            I build web and mobile products with React and React Native, taking
            responsibility from early planning through release and the
            improvements that follow. I work closely with clients, designers,
            and engineers to turn complex needs into software that is clear,
            useful, and maintainable.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryLink} href='#work'>
              View projects <Arrow />
            </a>
            <a className={styles.secondaryLink} href='#experience'>
              Career background <span aria-hidden='true'>↓</span>
            </a>
          </div>
        </div>
        <a
          className={styles.heroIllustration}
          href='#work'
          aria-label='Explore selected web, mobile, and connected projects'
        >
          <Image
            src={assetPath('/hero-device-collage.svg')}
            alt='Outline illustration of a laptop and phone linked by Bluetooth and NFC signals'
            fill
            sizes='(max-width: 760px) 100vw, (max-width: 1050px) 45vw, 40vw'
            priority
          />
        </a>
      </div>
      <div className={styles.heroFooter}>
        <div>
          <strong>
            28<span>+</span>
          </strong>
          <small>
            years across graphic design
            <br />
            &amp; software development
          </small>
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
