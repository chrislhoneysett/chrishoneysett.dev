import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getPosts, postHref } from '@/lib/posts'
import { blogSeries } from '@/data/blogSeries'
import { PostMeta } from '@/components/blog/PostMeta'
import { assetPath } from '@/lib/assetPath'
import styles from '../blog.module.css'

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().filter((post) => !post.externalUrl).map(({ slug }) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPosts().find((post) => post.slug === slug && !post.externalUrl)
  if (!post) notFound()
  const title = `${post.title} — ${post.author}`
  return {
    title, description: post.description, authors: [{ name: post.author }], keywords: post.tags,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: { title, description: post.description, url: `/blog/${slug}/`, type: 'article', publishedTime: post.date, authors: [post.author], tags: post.tags },
    twitter: { title, description: post.description },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const posts = getPosts()
  const post = posts.find((post) => post.slug === slug && !post.externalUrl)
  if (!post) notFound()
  const parts = post.series ? posts.filter((item) => item.series === post.series).sort((a, b) => a.seriesOrder! - b.seriesOrder!) : []
  const position = parts.findIndex((part) => part.slug === post.slug)
  const previous = parts[position - 1]
  const next = parts[position + 1]

  return <main id='top' className={styles.articleShell}>
    <Link href='/blog/' className={styles.back}>← All articles</Link>
    <article>
      <header className={styles.articleHeader}>
        {post.series && <p className={styles.label}>{blogSeries[post.series].title} · Part {post.seriesOrder}</p>}
        <h1>{post.title}</h1>
        <p className={styles.description}>{post.description}</p>
        <PostMeta post={post} />
      </header>
      {post.series && <nav className={styles.series} aria-label='Articles in this series'>
        <h2>{blogSeries[post.series].title}</h2>
        <p>{blogSeries[post.series].description}</p>
        <ol>{parts.map((part) => <li key={part.slug} value={part.seriesOrder}>
          <Link href={postHref(part)} aria-current={part.slug === slug ? 'page' : undefined}>{part.title}{part.publisher && ` (Published on ${part.publisher})`}</Link>
        </li>)}</ol>
      </nav>}
      <div className={styles.prose}>
        <Markdown remarkPlugins={[remarkGfm]} components={{
          table: ({ children }) => <div className={styles.tableScroll} tabIndex={0} role='region' aria-label='Scrollable table'><table>{children}</table></div>,
          a: ({ href, children }) => {
            const localPost = href?.match(/^(?:\.\/)?([a-z0-9-]+)\.md(#[\w-]+)?$/)
            const destination = localPost ? assetPath(`/blog/${localPost[1]}/${localPost[2] ?? ''}`) : href?.startsWith('/') ? assetPath(href) : href
            return <a href={destination}>{children}</a>
          },
        }}>{post.content}</Markdown>
      </div>
      {(previous || next) && <nav className={styles.pagination} aria-label='Continue this series'>
        <div>{previous && <Link href={postHref(previous)}><span>← Previous article</span>{previous.title}</Link>}</div>
        <div>{next && <Link href={postHref(next)}><span>Next article →</span>{next.title}</Link>}</div>
      </nav>}
    </article>
  </main>
}
