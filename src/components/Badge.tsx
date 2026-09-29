import styles from './Badge.module.css'

export function Badge({
  children,
  tone = 'subtle',
  className,
}: {
  children: string
  tone?: 'subtle' | 'highlight'
  className?: string
}) {
  return (
    <span className={`${styles.badge} ${styles[tone]}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  )
}
