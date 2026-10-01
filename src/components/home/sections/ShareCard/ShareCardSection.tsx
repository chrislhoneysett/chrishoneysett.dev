import { profile } from '@/data/profile'
import styles from './ShareCard.module.css'

export function ShareCardSection() {
  const [role, focus] = profile.headline.split(' | ')

  return (
    <section
      className={styles.shareSection}
      id='share-card'
      aria-labelledby='share-card-title'
    >
      <p className={styles.sectionLabel}>06 / Share card</p>
      <div className={styles.shareCard}>
        <div className={styles.cardMain}>
          <p className={styles.cardKicker}>
            <span aria-hidden='true' /> Engineering informed by graphic design
          </p>
          <h2 id='share-card-title'>
            <span className={styles.taglineLine}>Clear vision.</span>
            <span className={styles.taglineLine}>Crafted <em>code.</em></span>
          </h2>
        </div>
        <div className={styles.cardDetails}>
          <p className={styles.cardName}>{profile.name}</p>
          <p className={styles.cardRole}>{role}</p>
          <div className={styles.cardRule} aria-hidden='true' />
          <p className={styles.cardFocus}>{focus}</p>
          <p className={styles.cardLocation}>{profile.location}</p>
          <p className={styles.cardUrl}>chrishoneysett.dev</p>
        </div>
        <p className={styles.cardFooter}>Web / Mobile / BLE / NFC</p>
      </div>
    </section>
  )
}
