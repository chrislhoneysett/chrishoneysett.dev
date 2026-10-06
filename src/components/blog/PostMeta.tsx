import { formatPostDate, type Post } from '@/lib/posts'
import styles from '@/app/blog/blog.module.css'

export function PostMeta({ post }: { post: Post }) {
  return <>
    <p className={styles.meta}>{post.author} <span aria-hidden='true'>·</span> <time dateTime={post.date}>{formatPostDate(post.date)}</time></p>
    <ul className={styles.tags} aria-label='Tags'>{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
  </>
}
