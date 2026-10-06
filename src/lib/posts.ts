import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { blogSeries } from '@/data/blogSeries'

export type Post = {
  slug: string
  title: string
  description: string
  author: string
  date: string
  tags: string[]
  series?: string
  seriesOrder?: number
  externalUrl?: string
  publisher?: string
  content: string
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? markdownFiles(filename) : entry.isFile() && entry.name.endsWith('.md') ? [filename] : []
  })
}

export function getPosts(): Post[] {
  const posts = markdownFiles(path.join(process.cwd(), 'src/data/posts')).flatMap((filename): Post[] => {
    const source = readFileSync(filename, 'utf8')
    // Unmarked notes and drafts never enter the public content pipeline.
    if (!matter.test(source)) return []
    const { data, content } = matter(source)
    if (data.status !== 'published') return []
    const fail = (message: string): never => { throw new Error(`${filename}: ${message}`) }
    const text = (key: string): string => typeof data[key] === 'string' && data[key].trim() ? data[key].trim() : fail(`Missing or invalid ${key}`)
    const date = text('date')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) fail('date must be a valid quoted YYYY-MM-DD date')
    if (!Array.isArray(data.tags) || !data.tags.length || data.tags.some((tag: unknown) => typeof tag !== 'string' || !tag.trim())) fail('tags must be a nonempty list of strings')
    const slug = path.basename(filename, '.md')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail('Filename must be a lowercase URL slug')
    const series = data.series === undefined ? undefined : text('series')
    if (series && !Object.hasOwn(blogSeries, series)) fail('Unknown series')
    if (series && (!Number.isInteger(data.seriesOrder) || data.seriesOrder < 1)) fail('seriesOrder must be a positive integer')
    if (!series && data.seriesOrder !== undefined) fail('seriesOrder requires a series')
    const externalUrl = data.externalUrl === undefined ? undefined : text('externalUrl')
    if (externalUrl) {
      let url: URL
      try { url = new URL(externalUrl) } catch { return fail('Invalid externalUrl') }
      if (!['https:', 'http:'].includes(url.protocol)) fail('externalUrl must use HTTP or HTTPS')
    }
    if (!externalUrl && !content.trim()) fail('Local articles must have Markdown content')
    return [{ slug, title: text('title'), description: text('description'), author: text('author'), date,
      tags: data.tags.map((tag: string) => tag.trim()), series, seriesOrder: series ? data.seriesOrder : undefined,
      externalUrl, publisher: externalUrl ? text('publisher') : undefined, content }]
  })
  const slugs = new Set<string>()
  const positions = new Set<string>()
  for (const post of posts) {
    if (slugs.has(post.slug)) throw new Error(`Duplicate published post slug: ${post.slug}`)
    slugs.add(post.slug)
    if (post.series) {
      const position = `${post.series}:${post.seriesOrder}`
      if (positions.has(position)) throw new Error(`Duplicate series position: ${position}`)
      positions.add(position)
    }
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || (a.series === b.series ? (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0) : 0) || a.slug.localeCompare(b.slug))
}

export function postHref(post: Post): string {
  return post.externalUrl ?? `/blog/${post.slug}/`
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
}
