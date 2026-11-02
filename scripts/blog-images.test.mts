import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import sharp from 'sharp'

const script = fileURLToPath(new URL('./generate-blog-images.mts', import.meta.url))

test('removes variants for deleted and replaced sources, retaining shared images and unrelated files', async () => {
  const root = mkdtempSync(path.join(tmpdir(), 'blog-images-'))
  const source = path.join(root, 'public/blog')
  const output = path.join(root, 'public/generated/blog')
  const run = () => execFileSync(process.execPath, ['--import', import.meta.resolve('tsx'), script], { cwd: root, stdio: 'pipe' })
  const files = () => readdirSync(output).filter((name) => name.endsWith('.webp')).sort()
  try {
    mkdirSync(source, { recursive: true })
    const image = await sharp({ create: { width: 400, height: 600, channels: 3, background: 'red' } }).jpeg().toBuffer()
    writeFileSync(path.join(source, 'first.jpg'), image)
    writeFileSync(path.join(source, 'shared.jpg'), image)
    run()
    const originals = files()
    assert.equal(originals.length, 2)
    writeFileSync(path.join(output, 'keep.txt'), 'unrelated')
    rmSync(path.join(source, 'first.jpg'))
    run()
    assert.deepEqual(files(), originals)
    await sharp({ create: { width: 400, height: 600, channels: 3, background: 'blue' } }).jpeg().toFile(path.join(source, 'shared.jpg'))
    run()
    assert.ok(files().every((name) => !originals.includes(name)))
    assert.equal(files().length, 2)
    // A failed generation must not prune the previous successful variants.
    const previous = files()
    writeFileSync(path.join(source, 'shared.jpg'), 'invalid image')
    assert.throws(run)
    assert.deepEqual(files(), previous)
    rmSync(path.join(source, 'shared.jpg'))
    run()
    assert.deepEqual(files(), [])
    assert.deepEqual(JSON.parse(readFileSync(path.join(output, 'manifest.json'), 'utf8')), {})
    assert.equal(readFileSync(path.join(output, 'keep.txt'), 'utf8'), 'unrelated')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
