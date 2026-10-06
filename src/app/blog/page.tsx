import type { Metadata } from 'next'
import Link from 'next/link'
import { getPosts, postHref } from '@/lib/posts'
import { blogSeries } from '@/data/blogSeries'
import { PostMeta } from '@/components/blog/PostMeta'
import styles from './blog.module.css'

const title = 'Blog — Chris Honeysett'
const description = 'Notes and lessons from building web and mobile applications.'
export const metadata: Metadata = {
  title, description, alternates: { canonical: '/blog/' },
  openGraph: { title, description, url: '/blog/', type: 'website' },
  twitter: { title, description },
}

export default function BlogPage() {
  const posts = getPosts()
  return <main id='top' className={styles.shell}>
    <header className={styles.intro}>
      <p className={styles.label}>Notes from the work</p>
      <h1>Blog<span className={styles.accent}>.</span></h1>
      <p>{description}</p>
    </header>
    <div className={styles.posts}>
      {posts.map((post) => <article key={post.slug} className={styles.card}>
        {post.series && <p className={styles.label}>{blogSeries[post.series].title} · Part {post.seriesOrder}</p>}
        <h2><Link href={postHref(post)}>{post.title}{post.externalUrl && <span aria-hidden='true'> ↗</span>}</Link></h2>
        <p className={styles.description}>{post.description}</p>
        <PostMeta post={post} />
        {post.publisher && <p className={styles.publisher}>Published on {post.publisher}</p>}
      </article>)}
      {!posts.length && <p>Articles are on the way.</p>}
    </div>
  </main>
}
