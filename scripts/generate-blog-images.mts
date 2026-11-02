import { createHash } from 'node:crypto'
import { readdir, readFile, mkdir, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.join(process.cwd(), 'public')
const output = path.join(root, 'generated/blog')
const manifest: Record<string, { width: number; height: number; sources: { url: string; width: number }[] }> = {}
async function walk(directory: string): Promise<string[]> {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(filename) : /\.(jpe?g|png|webp)$/i.test(entry.name) ? [filename] : []
  }))).flat()
}
await mkdir(output, { recursive: true })
for (const filename of await walk(path.join(root, 'blog'))) {
  const input = await readFile(filename)
  const hash = createHash('sha256').update(input).update('webp-quality-80-v1').digest('hex').slice(0, 16)
  const metadata = await sharp(input).metadata()
  const { width, height } = metadata.autoOrient
  const widths = [...new Set([320, 640, 960, 1280, 1600].map((size) => Math.min(size, width)))]
  const sources = []
  for (const size of widths) {
    const name = `${hash}-${size}.webp`
    await sharp(input).rotate().resize({ width: size, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(output, name))
    sources.push({ url: `/generated/blog/${name}`, width: size })
  }
  manifest[`/${path.relative(root, filename).split(path.sep).join('/')}`] = { width, height, sources }
}
await writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
const currentFiles = new Set(Object.values(manifest).flatMap((image) => image.sources.map((source) => path.basename(source.url))))
let removed = 0
for (const entry of await readdir(output, { withFileTypes: true })) {
  if (entry.isFile() && /^[a-f0-9]{16}-\d+\.webp$/.test(entry.name) && !currentFiles.has(entry.name)) {
    await unlink(path.join(output, entry.name))
    removed++
  }
}
console.log(`Optimized ${Object.keys(manifest).length} blog images.`)
console.log(`Removed ${removed} stale image variants.`)
