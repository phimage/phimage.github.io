---
title: "AGENTS.md for 4D — auto-generating a README for your AI agents"
description: "AGENTS.md is a README for AI agents: a small markdown file at the repo root that hands an LLM the project's shape so it doesn't burn tokens exploring. Here's one auto-generated for 4D projects — plus the Claude Code import trick."
pubDate: 2026-03-22
tags: ["ai", "agents", "4d", "tooling"]
---

`AGENTS.md` is, basically, a **README for AI agents** — a simple markdown file at the
repo root that gives an LLM the essential project context (structure, entry points,
commands, conventions) so it can get to work without exploring everything from
scratch. It's a real cross-tool [standard](https://agents.md) now
([agentsmd/agents.md](https://github.com/agentsmd/agents.md)), read by 30-plus agents
(Codex, Cursor, Windsurf, Gemini CLI, Copilot…) across tens of thousands of repos.

The important discipline: it should be a **small, pragmatic layer on top of the repo —
not a new source of truth.** If your coding agent doesn't already pull them in, it can
also link out to, say, a 4D-coding-instructions markdown file. But keep the file
itself lean.

## Why it helps for 4D

In our case, briefly describing the project structure can save the agent from wasting
tokens exploring it — all those `find`, `ls`, and tree-walk `bash` calls it makes just
to learn the layout it could have read in five lines.

## My experiment: auto-generating it

I've been adding a minimal `AGENTS.md` to my 4D projects, generated automatically by a
[`4d-project-info` skill](https://github.com/e-marchand/skills/tree/main/4d-project-info).
It scans the project and emits a managed block — project file, methods, classes, forms,
counts, dependencies:

```markdown
# Agent Guide

Read the managed 4D section below before browsing project files.

<!-- BEGIN 4D PROJECT INFO -->
## 4D Project

This repository is a 4D project.
- Project file: `Project/4D SVG.4DProject`
- Methods (Project/Sources/Methods/*.4dm): 00_test, Color_main, Component_*,
  PREFERENCES, Rgx_*, SVGTool_*, SVG_*, Syntax_help, Syntax_main, Viewer_main,
  _4DPopSVG, about, checkGitBranch, colors, fontReplaceArial, getDefs, syntax,
  +19 more
- Classes (Project/Sources/Classes/*.4dm): none
- Database methods (Project/Sources/DatabaseMethods/*.4dm): onStartup
- Forms (Project/Sources/Forms/*/form.4DForm + optional *.4dm): About,
  colorPalette, syntaxPalette, viewer
- Counts: methods=211, classes=0, forms=4, db_methods=1
- Dependencies: none
<!-- END 4D PROJECT INFO -->
```

The `BEGIN`/`END` comment markers are the point: the block is **regenerable**. Re-run
the skill as the project grows and it refreshes the managed section in place, without
touching anything you wrote by hand around it. The agent reads a five-line map of 211
methods and 4 forms instead of crawling the `Sources/` tree itself.

## The Claude Code catch (and the fix)

One wrinkle: **Claude Code doesn't read `AGENTS.md` natively yet** — it reads
`CLAUDE.md` (tracked in [issue #6235](https://github.com/anthropics/claude-code/issues/6235)).
My first workaround was a tiny `CLAUDE.md` that just *told* it to go read `AGENTS.md`.

The cleaner fix now exists: Claude Code supports `@path` **imports**, so a one-line
`CLAUDE.md` can pull the standard file straight in —

```markdown
@AGENTS.md
```

— and the contents expand into the session context at launch, exactly as if they were
inline (imports are even recursive). `AGENTS.md` stays the tool-agnostic source of
truth; `CLAUDE.md` shrinks to that single import plus any Claude-specific overrides.
A symlink (`ln -s AGENTS.md CLAUDE.md`) works too, but the import is the
cross-platform-safe choice.

## Worth reading

- [agents.md](https://agents.md) · [agentsmd/agents.md](https://github.com/agentsmd/agents.md)
- [My `4d-project-info` skill](https://github.com/e-marchand/skills/tree/main/4d-project-info)
- [Claude Code issue #6235 — support AGENTS.md](https://github.com/anthropics/claude-code/issues/6235)

---

This is the same token-thrift idea from the other direction: don't make the agent
*discover* what you can just *tell* it. For 4D, a generated five-line project map is
about the highest-leverage `AGENTS.md` you can ship — and regenerating it costs nothing.
🗺️
