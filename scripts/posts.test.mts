import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import { getPosts, postHref, formatPostDate } from '../src/lib/posts'

test('published content, draft isolation, series ordering, and external links', () => {
  const original = process.cwd()
  const root = mkdtempSync(path.join(tmpdir(), 'blog-content-'))
  const directory = path.join(root, 'src/data/posts')
  mkdirSync(path.join(directory, 'future'), { recursive: true })
  const entry = (extra = '', date = '2026-10-06') => `---\ntitle: Test\ndescription: Summary\nauthor: Chris\ndate: "${date}"\ntags: [BLE]\nstatus: published\n${extra}---\n\nContent\n`
  const write = (name: string, content: string) => writeFileSync(path.join(directory, name), content)
  try {
    process.chdir(root)
    write('future/notes.md', '# Unpublished notes')
    write('future/draft.md', '---\nstatus: draft\n---\nPrivate draft')
    write('second.md', entry('series: ble-for-web-developers\nseriesOrder: 2\n'))
    write('first.md', entry('series: ble-for-web-developers\nseriesOrder: 1\n'))
    write('external.md', entry('externalUrl: "https://example.com/article"\npublisher: Example\n', '2026-10-07'))
    assert.deepEqual(getPosts().map((post) => post.slug), ['external', 'first', 'second'])
    assert.equal(postHref(getPosts()[0]), 'https://example.com/article')
    assert.equal(postHref(getPosts()[1]), '/blog/first/')
    assert.equal(formatPostDate('2026-10-06'), 'October 6, 2026')
    write('future/first.md', entry())
    assert.throws(getPosts, /Duplicate published post slug/)
    rmSync(path.join(directory, 'future/first.md'))
    write('third.md', entry('series: ble-for-web-developers\nseriesOrder: 2\n'))
    assert.throws(getPosts, /Duplicate series position/)
    rmSync(path.join(directory, 'third.md'))
    write('invalid.md', entry('', '2026-02-30'))
    assert.throws(getPosts, /valid quoted YYYY-MM-DD/)
    write('invalid.md', entry('externalUrl: "javascript:alert(1)"\npublisher: Example\n'))
    assert.throws(getPosts, /HTTP or HTTPS/)
    write('invalid.md', entry('series: missing\nseriesOrder: 1\n'))
    assert.throws(getPosts, /Unknown series/)
  } finally {
    process.chdir(original)
    rmSync(root, { recursive: true, force: true })
  }
})
