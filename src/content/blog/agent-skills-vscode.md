---
title: "Agent Skills in VS Code — capabilities that load only when needed"
description: "Agent Skills landed in VS Code: folders of instructions and scripts an agent loads on demand. The clever part is a three-level progressive loading scheme, so you can keep dozens installed and pay tokens only for the one that's relevant."
pubDate: 2026-01-10
tags: ["ai", "skills", "copilot", "tooling"]
---

VS Code picked up a feature I'd been waiting to see there: **Agent Skills** (added in
1.108, currently experimental). It's worth a look — partly for what it does, but mostly
for *how cheaply* it does it.

Enable it with the `chat.useAgentSkills` setting (still in preview), and the
[docs](https://code.visualstudio.com/docs/copilot/customization/agent-skills) cover
the rest.

## What are Agent Skills?

Originally developed by Anthropic for Claude, Agent Skills are now an **open standard**
([agentskills.io](https://agentskills.io)) adopted across multiple tools — including
GitHub Copilot in VS Code, the Copilot CLI, and the Copilot coding agent. Like MCP,
it's a way to extend an LLM's capabilities. The difference in emphasis: MCP gives an
agent new *tools*; a skill gives it new *know-how* — specialized instructions plus the
resources to act on them.

## How it works

A skill is, refreshingly, just a folder with a `SKILL.md` file containing:

- detailed instructions,
- optional scripts,
- examples,
- and any additional resources.

The agent loads these dynamically, on demand, based on the conversation. Where do they
live? This is in slight flux right now: the open spec defaults to **`.agents/skills/`**,
while VS Code currently auto-detects **`.github/skills/`** in your workspace (and
**`.claude/skills/`** for backwards compatibility), with personal skills in your user
directory. (So yes — the newer `.agents/skills/` location is the standard one to know.)

## Why it costs fewer tokens

This is the part that makes it more than a renamed instructions file. Unlike custom
instructions or MCP tool definitions — which are *always* injected into context —
skills use a **three-level progressive loading** scheme:

1. **Discovery** — only the `name` and `description` (a few lines of YAML frontmatter)
   are permanently loaded. That's all the agent needs to know a skill *exists*.
2. **Instructions** — the body of `SKILL.md` is loaded only when the skill is judged
   relevant to what you're doing.
3. **Resources** — extra files (scripts, examples, references) load only when explicitly
   referenced.

The result: you can have **dozens of skills installed without wasting tokens.** Only
what's relevant to the current task ever enters the context window. If you've read my
note on [spending fewer tokens](/blog/optimizing-tokens/), this is the automatic,
structured version of the "skill routing" trick — instead of you hand-writing
"read `database.md` for schema changes," the discovery layer does that routing for you.

## Where to find skills

- **Anthropic (official):** [anthropics/skills](https://github.com/anthropics/skills) —
  reference skills including document creation (docx, pdf, pptx, xlsx) and a
  `skill-creator`.
- **Community marketplaces:** [SkillsMP](https://skillsmp.com) and
  [Smithery](https://smithery.ai/skills), each listing tens of thousands of community
  skills (treat the counts as marketing, the good ones as gold).

## Build your own

The real value is custom skills tailored to your team. Follow the
[specification](https://agentskills.io/specification) (and VS Code's
[create-a-skill guide](https://code.visualstudio.com/docs/copilot/customization/agent-skills#_create-a-skill)),
and let Anthropic's
[skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
scaffold the boilerplate. Keep the main `SKILL.md` lean and push detail into a
`references/` folder.

Good candidates are anything you explain repeatedly:

- how to implement feature flags in your codebase,
- how to write and run tests following your conventions,
- how to document code/APIs to your standards,
- deployment procedures and checklists,
- code-review guidelines,
- spinning up a new project from your boilerplate.

Basically: **anything you find yourself explaining over and over to the team can become
a skill.** That's exactly what I've been doing on the 4D side — small skills for project
info, scaffolding a project, running a method — and the progressive loading is what
makes keeping a whole shelf of them painless: they cost nothing until the task calls
one up.

## Worth reading

- [Use Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [agentskills.io](https://agentskills.io) · [specification](https://agentskills.io/specification)
- [Claude skills docs](https://code.claude.com/docs/en/skills) · [anthropics/skills](https://github.com/anthropics/skills)

---

Two ways to extend an agent, same shared-standard energy: MCP for tools, Skills for
know-how — and Skills come with a built-in answer to the question every one of these
features eventually runs into, *"won't this blow up my context?"* No: it loads three
lines until it needs more. 📜
