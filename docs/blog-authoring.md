# Authoring the blog

Write ordinary `.md` files anywhere under `src/data/posts/`. The filename is the
URL slug, so `my-article.md` becomes `/blog/my-article/`. Filenames must be unique
across folders and use lowercase letters, numbers, and hyphens. Keep published
filenames stable so existing links continue to work.

## Local articles

```markdown
---
title: "My article"
description: "A short summary for the blog listing and sharing metadata."
author: "Chris Honeysett"
date: "2026-10-06"
tags: [React, JavaScript]
status: published
---

Start the article here. The page displays the title from frontmatter, so use
`##` for main sections rather than repeating the title as an `#` heading.
```

All the fields above are required for published entries. Quote dates and use
`YYYY-MM-DD`; dates represent publication dates and display consistently in UTC.
The initial three posts use October 6, 2026; edit these if you prefer other dates.

Files without frontmatter or without `status: published` are excluded from the
listing, generated routes, and series navigation. Use `status: draft` while
writing. Existing notes in `future/` and `twisthink/` remain unpublished. Setting
a future date does not schedule publication: the status controls visibility.

Tables, fenced code blocks, lists, links, blockquotes, and inline code work with
GitHub-flavored Markdown. Raw HTML and executable JSX are not enabled. Relative
article links such as `[Read part two](ble-byte-data.md)` are converted to blog
URLs. Put images in `public/` and reference them with `/image-name.png`.

## Series

Add a name and description to `src/data/blogSeries.ts`, then add these optional
fields to each member's frontmatter:

```yaml
series: ble-for-web-developers
seriesOrder: 4
```

Positions must be unique positive integers within a series. Published members
automatically appear in order with previous/next links. There is no fixed total
and no requirement to publish every part at once. Standalone posts omit both
fields. The listing sorts newest first, with same-date series members in order.

## Writing published elsewhere

Create a metadata-only Markdown file with the same required fields, plus:

```yaml
externalUrl: "https://example.com/articles/my-article"
publisher: "Publisher name"
```

The blog card links directly to that URL and identifies the publisher. No local
article page is generated. External entries may also include series metadata,
so series navigation can link to them. The external URL must use HTTP or HTTPS.
Any Markdown body in these entries is unused; use `description` for the summary.

## Preview and publish

Follow `docs/local-development.md` to select the Node version and use the
existing Herdr development workflow. Preview `/blog/` and your article URL.
Run `npm run build` to validate published metadata and generate the static site.
Commit content changes and deploy using the site's existing deployment workflow.
Articles are included when the site rebuilds; no database or runtime content
service is needed.
