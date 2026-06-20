# phimage.github.io

Personal site + writing for **Eric Marchand** (`@phimage`). Built with [Astro](https://astro.build),
deployed to GitHub Pages via GitHub Actions.

Theme: *"the twilight zone"* — abyssal background, one bioluminescent cyan accent,
a sparing amber "by night" highlight, φ as the mark. Fraunces (display) + IBM Plex
Sans / Mono (body / code). Fonts are self-hosted via Fontsource (no external
requests).

## Develop

```sh
npm install      # also generates package-lock.json (needed by the CI's `npm ci`)
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serve the built ./dist locally
```

## Add a blog post

Drop a Markdown file in `src/content/blog/`. The filename becomes the URL slug
(`my-post.md` → `/blog/my-post/`). Frontmatter:

```yaml
---
title: "Your title"
description: "One-sentence summary (used on cards, SEO, and the RSS feed)."
pubDate: 2026-06-21        # YYYY-MM-DD
tags: ["ai", "swift"]      # optional
youtube: "https://..."     # optional — renders a 'Watch ▶' callout
draft: false               # optional — true hides it from the site and feed
---

Markdown body here.
```

Posts are sorted newest-first automatically and appear on both `/` and `/blog/`.

## Project layout

```
src/
  consts.ts              # name, socials, the three identities, stack list
  content.config.ts      # blog collection schema
  content/blog/          # the posts (Markdown)
  layouts/Base.astro     # <head>, fonts, header, footer
  components/            # Header, Footer
  pages/
    index.astro          # homepage: hero + identities + stack + latest writing
    blog/index.astro     # all posts
    blog/[...slug].astro # a single post
    rss.xml.js           # RSS feed
    404.astro
  styles/global.css      # all the styling + design tokens
public/favicon.svg
.github/workflows/deploy.yml
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes to GitHub Pages.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
Source** and choose **GitHub Actions**.

## Editing the front page

Most of the homepage copy lives in `src/consts.ts` (name, tagline, the three
GitHub identities, the tech list) and `src/pages/index.astro` (section headings
and the hero). Colors and type are all CSS variables at the top of
`src/styles/global.css`.
