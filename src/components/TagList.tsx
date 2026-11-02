import { Badge } from '@/components/Badge'
import styles from './TagList.module.css'

export function TagList({
  tags,
  label = 'Tags',
  className,
}: {
  tags: readonly string[]
  label?: string
  className?: string
}) {
  if (!tags.length) return null

  return (
    <ul className={`${styles.tags}${className ? ` ${className}` : ''}`} aria-label={label}>
      {tags.map((tag) => (
        <li key={tag}>
          <Badge>{tag}</Badge>
        </li>
      ))}
    </ul>
  )
}
