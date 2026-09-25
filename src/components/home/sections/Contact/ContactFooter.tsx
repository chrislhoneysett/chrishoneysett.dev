import { ContactDialog } from '@/components/ContactDialog'
import { profile } from '@/data/profile'
import { Arrow } from '../../Arrow'
import styles from './Contact.module.css'

export function ContactFooter() {
  const linkedIn = profile.links.find((link) => link.label === 'LinkedIn')

  return (
    <footer className={styles.footer}>
      <p className={styles.sectionLabel}>Contact</p>
      <h2>Let&apos;s stay<br /><em>connected.</em></h2>
      <p className={styles.footerIntro}>
        If you&apos;re hiring for a full-time senior frontend role and think
        my experience could fit your team, I&apos;d be glad to talk.
      </p>
      <div className={styles.footerLinks}>
        <ContactDialog id='footer-contact' email={profile.email} className={styles.footerContact} label='Contact me' />
        {linkedIn ? <a href={linkedIn.url} target='_blank' rel='noopener noreferrer'>{linkedIn.label} <Arrow /></a> : null}
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  )
}
