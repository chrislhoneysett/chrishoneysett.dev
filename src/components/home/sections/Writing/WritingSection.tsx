import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { assetPath } from '@/lib/assetPath'
import { formatPostDate, getPosts, postHref } from '@/lib/posts'
import styles from './Writing.module.css'

export function WritingSection() {
  const post = getPosts().find((post) => post.status === 'published')
  if (!post) return null

  return (
    <section className={styles.section} id='writing' aria-labelledby='writing-title'>
      <h2 className={styles.label} id='writing-title'>Latest writing</h2>
      <article className={styles.article}>
        <Link className={styles.articleLink} href={postHref(post)}>
          {post.image && (
            <Image className={styles.image} src={assetPath(post.image.url)} alt='' width={post.image.width} height={post.image.height} sizes='64px' />
          )}
          <div className={styles.content}>
            <time className={styles.date} dateTime={post.date}>{formatPostDate(post.date)}</time>
            <h3>{post.title}</h3>
            {post.publisher && <p className={styles.date}>Published on {post.publisher}</p>}
          </div>
        </Link>
      </article>
      <Link className={styles.allPosts} href='/blog/'>All writing <Icon name='north-east' /></Link>
    </section>
  )
}
