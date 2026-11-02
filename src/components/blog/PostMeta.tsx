import { formatPostDate, type Post } from '@/lib/posts'
import { TagList } from '@/components/TagList'
import styles from '@/app/blog/blog.module.css'

export function PostMeta({ post }: { post: Post }) {
  return <>
    {post.status === 'draft' && <p className={styles.draft}>Draft · Local preview</p>}
    <p className={styles.meta}>{post.author} <span aria-hidden='true'>·</span> <time dateTime={post.date}>{formatPostDate(post.date)}</time></p>
    <TagList tags={post.tags} className={styles.tags} />
  </>
}
