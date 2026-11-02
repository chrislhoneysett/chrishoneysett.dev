import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { assetPath } from './assetPath'

type BlogImage = { width: number; height: number; sources: { url: string; width: number }[] }

export function blogImageMetadata(url: string): BlogImage | undefined {
  const filename = path.join(process.cwd(), 'public/generated/blog/manifest.json')
  if (!existsSync(filename)) return undefined
  const manifest = JSON.parse(readFileSync(filename, 'utf8')) as Record<string, BlogImage>
  return manifest[url]
}

export function blogImageProps(url: string, width: number, height: number, sizes: string) {
  const image = blogImageMetadata(url)
  return {
    src: assetPath(image?.sources.at(-1)?.url ?? url),
    srcSet: image?.sources.map((source) => `${assetPath(source.url)} ${source.width}w`).join(', '),
    sizes,
    width: image?.width ?? width,
    height: image?.height ?? height,
  }
}
