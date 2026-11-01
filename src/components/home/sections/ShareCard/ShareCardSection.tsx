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
      <p className={styles.sectionLabel} data-reveal>06 / Share card</p>
      <div className={styles.shareCard} data-reveal>
        <div className={styles.cardMain}>
          <p className={styles.cardKicker}>
            <span aria-hidden='true' /> Frontend &amp; mobile engineering
          </p>
          <div className={styles.cardIdentity}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.cardMark} src='/ch.svg' alt='' width='180' height='180' />
            <h2 id='share-card-title'>
              <span className={styles.taglineLine}>Chris</span>
              <span className={styles.taglineLine}>Honeysett</span>
            </h2>
          </div>
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
