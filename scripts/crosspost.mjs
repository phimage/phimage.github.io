#!/usr/bin/env node
// Cross-post blog posts from src/content/blog to dev.to (via API, as drafts)
// and prepare clean copies for Medium's "Import a story" tool.
//
// Usage:
//   node scripts/crosspost.mjs                     # last 3 posts, prep only (no network calls)
//   node scripts/crosspost.mjs --slug=agents-as-planners
//   DEVTO_API_KEY=xxx node scripts/crosspost.mjs --publish-devto   # also push drafts to dev.to
//
// Notes:
// - dev.to drafts are created with published:false. Review and publish manually
//   at https://dev.to/dashboard before they go live.
// - Medium has no public API for new integration tokens anymore, so this script
//   only prepares a ready-to-import markdown file per post (with canonical_url
//   noted at the top) — use Medium's Stories > Import a story with the live
//   phimage.github.io URL, or paste the content manually.

import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE = "https://phimage.github.io";
const BLOG_DIR = join(__dirname, "..", "src", "content", "blog");
const OUT_DIR = join(__dirname, "..", ".crosspost-out");

function parsePost(filename) {
  const raw = readFileSync(join(BLOG_DIR, filename), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter found in ${filename}`);
  const [, fm, body] = match;

  const title = fm.match(/^title:\s*"(.*)"\s*$/m)?.[1] ?? "";
  const description = fm.match(/^description:\s*"(.*)"\s*$/m)?.[1] ?? "";
  const pubDate = fm.match(/^pubDate:\s*(\S+)\s*$/m)?.[1] ?? "";
  const tagsRaw = fm.match(/^tags:\s*\[(.*)\]\s*$/m)?.[1] ?? "";
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim().replace(/^"(.*)"$/, "$1"))
    .filter(Boolean);

  const slug = filename.replace(/\.md$/, "");
  const canonicalUrl = `${SITE}/blog/${slug}/`;

  // Resolve site-relative links/images to absolute URLs so they work off-site.
  const absoluteBody = body.replace(
    /(\]\()(\/[^)]*)(\))/g,
    (_, pre, path, post) => `${pre}${SITE}${path}${post}`
  );

  return { slug, title, description, pubDate, tags, body: absoluteBody, canonicalUrl };
}

function listPostsByDate() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parsePost)
    .sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));
}

function devtoTags(tags) {
  // dev.to: max 4 tags, alphanumeric only, no spaces/hyphens.
  return tags
    .map((t) => t.replace(/[^a-zA-Z0-9]/g, ""))
    .filter(Boolean)
    .slice(0, 4);
}

async function pushToDevto(post, publish) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    console.log(`  [dev.to] skipped (no DEVTO_API_KEY set) — ${post.slug}`);
    return;
  }
  const res = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      article: {
        title: post.title,
        published: !!publish,
        body_markdown: post.body,
        tags: devtoTags(post.tags),
        canonical_url: post.canonicalUrl,
        description: post.description,
      },
    }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error(`  [dev.to] FAILED (non-JSON response, status ${res.status}) — ${post.slug}: ${text.slice(0, 200)}`);
    return;
  }
  if (!res.ok) {
    console.error(`  [dev.to] FAILED — ${post.slug}:`, json);
    return;
  }
  console.log(`  [dev.to] created (${publish ? "published" : "draft"}) — ${json.url}`);
}

function writeMediumCopy(post) {
  mkdirSync(OUT_DIR, { recursive: true });
  const header = [
    `<!--`,
    `  Ready for Medium's "Import a story" tool: https://medium.com/p/import`,
    `  Import from: ${post.canonicalUrl}`,
    `  (Medium's importer auto-sets the canonical link back to the original.)`,
    ``,
    `  If pasting manually instead, canonical URL: ${post.canonicalUrl}`,
    `-->`,
    ``,
    `# ${post.title}`,
    ``,
    `*${post.description}*`,
    ``,
  ].join("\n");
  const outPath = join(OUT_DIR, `${post.slug}.medium.md`);
  writeFileSync(outPath, header + post.body, "utf8");
  return outPath;
}

async function main() {
  const args = process.argv.slice(2);
  const publishDevto = args.includes("--publish-devto");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const countArg = Number(args.find((a) => a.startsWith("--count="))?.split("=")[1]) || 3;

  const all = listPostsByDate();
  const posts = slugArg ? all.filter((p) => p.slug === slugArg) : all.slice(0, countArg);

  if (posts.length === 0) {
    console.error("No matching posts found.");
    process.exit(1);
  }

  for (const post of posts) {
    console.log(`\n${post.title} (${post.pubDate})`);
    const mediumPath = writeMediumCopy(post);
    console.log(`  [medium] prepared -> ${mediumPath}`);
    await pushToDevto(post, publishDevto);
    // dev.to rate-limits article creation; space out requests.
    await new Promise((r) => setTimeout(r, 2000));
  }
}

main();
