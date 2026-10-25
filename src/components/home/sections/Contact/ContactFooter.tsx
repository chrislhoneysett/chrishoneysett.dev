import { ContactDialog } from '@/components/ContactDialog'
import { profile } from '@/data/profile'
import { Icon } from '@/components/Icon'
import styles from './Contact.module.css'

export function ContactFooter() {
  const linkedIn = profile.links.find((link) => link.label === 'LinkedIn')

  return (
    <footer className={styles.footer}>
      <p className={styles.sectionLabel} data-reveal>Contact</p>
      <h2 data-reveal>
        Let&apos;s
        <br />
        <em>talk!</em>
      </h2>
      <p className={styles.footerIntro} data-reveal>
        Always happy to connect with people building thoughtful products and
        websites. If my experience seems like a fit for something you&apos;re
        working on, <em>I&apos;d love to hear about it.</em>
      </p>
      <div className={styles.footerLinks} data-reveal='contact'>
        <div className={styles.footerLinksContent}>
          <div className={styles.footerLinksInner}>
            <ContactDialog
              id='footer-contact'
              className={styles.footerContact}
              label='Contact me'
            />
            {linkedIn ? (
              <a href={linkedIn.url} target='_blank' rel='noopener noreferrer'>
                {linkedIn.label} <Icon name='north-east' />
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  )
}
