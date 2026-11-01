import { brandMark } from '@/data/brandMark'
import styles from './HeroMark.module.css'

/** The existing logo paths, typed as {} before crossing into the Honeysett H. */
export function HeroMark() {
  return (
    <svg className={styles.mark} viewBox='0 0 1000 1000' aria-hidden='true' focusable='false'>
      <defs>
        <pattern id='hero-monitor-dots' width='16' height='16' patternUnits='userSpaceOnUse'>
          <circle cx='8' cy='8' r='5.5' fill='white' />
        </pattern>
        <mask id='hero-monitor-mask' x='0' y='0' width='1000' height='1000' maskUnits='userSpaceOnUse'>
          <rect width='1000' height='1000' fill='url(#hero-monitor-dots)' />
        </mask>
        <filter id='hero-brace-thinning' x='-10%' y='-10%' width='120%' height='120%'>
          <feMorphology operator='erode' radius={brandMark.thinning} />
        </filter>
      </defs>
      <circle className={styles.background} cx='500' cy='500' r='500' fill={brandMark.background} />
      <g className={styles.ink} fill={brandMark.foreground}>
        <g className={styles.closingBrace}>
          <path className={`${styles.braceShape} ${styles.solid}`} d={brandMark.closingPath} />
          <g className={styles.matrix} mask='url(#hero-monitor-mask)'>
            <path className={styles.braceShape} d={brandMark.closingPath} />
          </g>
        </g>
        <g className={styles.openingBrace}>
          <path className={`${styles.braceShape} ${styles.solid}`} d={brandMark.openingPath} />
          <g className={styles.matrix} mask='url(#hero-monitor-mask)'>
            <path className={styles.braceShape} d={brandMark.openingPath} />
          </g>
        </g>
        <g className={styles.cursor}>
          <rect className={styles.cursorFade} x='300' y='720' width='200' height='46' rx='8' mask='url(#hero-monitor-mask)' />
        </g>
      </g>
    </svg>
  )
}
