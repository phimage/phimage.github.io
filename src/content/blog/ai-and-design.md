---
title: "AI and design: a workspace, and a contract 🎨"
description: "Two design-with-AI updates landed together. Claude Design is a workspace you design inside; Google's DESIGN.md is a file your agents read to stay on-brand. One's a destination, the other's a contract — and both touch generating 4D forms."
pubDate: 2026-04-23
tags: ["ai", "design", "tooling"]
---

Two updates about *designing with AI* dropped close together, and they're
interesting precisely because they pull in opposite directions. One gives you a new
place to design; the other gives your existing agents a way to design consistently.

## 🎨 Claude Design — a workspace

[Claude Design](https://claude.ai/design) (Anthropic Labs, research preview, powered
by the Opus 4.7 vision model) is a **standalone workspace** — its own URL, its own
canvas, its own export menu — that turns prompts into interactive prototypes, slide
decks, and marketing assets. A few things stood out using it:

- You can **draw, import images, or just prompt** — it reads visual input, not only
  text.
- Edits are **component-scoped**: you tweak a specific element instead of
  re-prompting the entire design just to nudge one button. That alone is the headline
  for me.
- **Usage is metered separately** and it's hungry — roughly three prompts ate about
  17% of my Pro allotment. Treat it as a focused tool, not a place to idle.
- It's **web-oriented** by default. To design, say, a macOS app, you have to import a
  design system first; it won't infer non-web conventions on its own.
- Versus asking Claude Code or Copilot to generate a **4D form**, a mobile screen, or
  similar UI, the noticeable win is **alignment** — elements land where they should
  instead of drifting.

So: genuinely useful for exploring directions fast, with the caveats that it leans
web and burns tokens.

## 📜 DESIGN.md — a contract

Google Labs open-sourced [**DESIGN.md**](https://github.com/google-labs-code/design.md)
(Apache 2.0, lifted out of its Stitch tool). It's the opposite move: not a tool, but
a **file your agents read** to generate consistent UI across a project. Think of it
as *semantic theming* — a single source of truth any coding agent (Claude Code,
Cursor, Copilot) can ingest.

The clever bit is its split personality:

- **YAML front matter** = the machine-readable *what* — design tokens for color,
  typography, spacing, radii, components (compatible with the W3C DTCG token format).
- **Markdown body** = the human-readable *why* — rationale, usage, accessibility
  notes, and an "Agent Prompt Guide" with explicit instructions for the AI. That last
  part is the real novelty: design systems never used to talk *to the agent*.

A stripped-down shape looks like:

```markdown
---
name: Heritage
colors:
  primary: "#1A1C1E"
  accent: "#B8422E"
  surface: "#F7F5F2"
typography:
  h1: { fontFamily: Public Sans, fontSize: 3rem }
  body: { fontFamily: Public Sans, fontSize: 1rem }
rounded: { sm: 4px, md: 8px }
---
## Overview
Architectural minimalism, journalistic gravitas. One accent, used sparingly.
```

You drop it at the repo root as `DESIGN.md` and point your `AGENTS.md` (or
`CLAUDE.md`) at it — "always consult DESIGN.md when generating UI." Most agents pick
it up automatically. There's even a linter that validates tokens and checks WCAG
contrast, emitting JSON the agent can act on. Some
[examples here](https://github.com/VoltAgent/awesome-design-md), and Google's
[overview](https://stitch.withgoogle.com/docs/design-md/overview).

## Why both matter for 4D

These solve the two halves of the same problem. Claude Design fixes *exploration* —
trying ten directions without rationing your time. DESIGN.md fixes *consistency* —
the way an agent forgets your palette between the button and the card, then ships
three slightly different greys.

For 4D specifically, the DESIGN.md angle is the one I'd reach for first: a
`DESIGN.md` in a project repo, referenced from the same `AGENTS.md`/`CLAUDE.md` I
already use, would give Claude Code or Copilot a persistent design system when
generating 4D forms — so the UI stays on-system from the first form to the last,
instead of drifting every time I prompt.

## Worth reading

- [Claude Design](https://claude.ai/design) · [the announcement](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [DESIGN.md spec](https://github.com/google-labs-code/design.md) · [overview](https://stitch.withgoogle.com/docs/design-md/overview) · [awesome-design-md](https://github.com/VoltAgent/awesome-design-md)

---

A pattern worth noticing: the same week brought a *tool* and a *standard*, and the
standard is the sneakier one. A workspace helps you; a file every agent agrees to
read helps every tool you already own. 🎨
