import { ThemeToggle } from './ThemeToggle'
import { ContactDialog } from '@/components/ContactDialog'
import { profile } from '@/data/profile'
import styles from './Navigation.module.css'

export function SiteNav() {
  return (
    <nav className={styles.nav} aria-label='Main navigation'>
      <a className={styles.wordmark} href='#top' aria-label={`${profile.name}, top of page`}>
        <span className={styles.mark}>CH<span>.</span></span>
        <span>{profile.name}</span>
      </a>
      <div className={styles.navLinks}>
        <a href='#work'>Work</a>
        <a href='#experience'>Experience</a>
        <a href='#about'>About</a>
      </div>
      <div className={styles.navEnd}>
        <ThemeToggle />
        <ContactDialog id='nav-contact' email={profile.email} className={styles.navContact} label="Let's talk" />
      </div>
    </nav>
  )
}
