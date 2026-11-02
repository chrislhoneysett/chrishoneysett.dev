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

Label fenced code blocks with a language, such as `typescript`, `tsx`, or
`javascript`, to enable syntax highlighting in both light and dark themes.
Use `text` for plain output; unlabeled blocks remain plain text.

For an article banner and social link preview, place an image in
`public/` and explicitly reference it in frontmatter:

```yaml
image: "/blog/my-article/banner.jpg"
imageAlt: "A description of the image"
```

The path is relative to `public/` and must point to an existing file. The filename
is your choice; images are only included when `image` is set. The article displays it
below the title and metadata and uses it for Open Graph and Twitter previews.
Keep the full composition visible rather than making a separate shallow crop.
Add `imageAlt: "A description of the image"` to frontmatter for descriptive
alternative text; otherwise the article title is used. Articles without an `image` field
retain the site's default share image. A draft's image can be prepared in advance;
adding its folder does not publish the article.

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

## Image optimization

`npm run build` and `npm run dev` generate responsive WebP variants for JPEG, PNG,
and WebP files under `public/blog/`. Keep originals there and reference their
original paths in frontmatter or Markdown. Actual dimensions are read automatically;
landscape images around 1600 × 838 work best for social previews. Variants preserve
aspect ratio, never enlarge originals, and use widths up to 1600 pixels.

Generated files live in `public/generated/blog/` and are ignored by Git. Each
successful generation removes obsolete variants from deleted or replaced source
images. After adding or replacing an image while the dev server is running,
run `npm run images`.
The browser selects an appropriate size for blog cards, banners, and inline images.
Social previews reference the original image.
