---
title: "Loop Engineering — the newest way to burn tokens 🔥"
description: "After prompt, context, and harness engineering comes loop engineering — designing a system that keeps guiding and correcting an LLM until the task is actually done."
pubDate: 2026-06-10
tags: ["ai", "agents", "buzzwords"]
youtube: "https://www.youtube.com/watch?v=dMrm2jAyrKM"
---

After **prompt** engineering, then **context** engineering, then **harness**
engineering, here comes the next buzzword on the conveyor belt: **loop
engineering** 🔄 — arguably the best way yet to set your token budget on fire 🔥.

The one-line version is actually a good distinction:

> Prompt engineering tells an LLM what to do *once*; loop engineering designs a
> system that keeps guiding and correcting the LLM *until the task is done*.

So less "write the perfect instruction", more "build the feedback loop that keeps
the model honest until the work matches the spec." The intelligence moves out of
the single prompt and into the surrounding machinery: the checks, the re-runs, the
stopping condition.

## What it looks like in practice

The pattern is a scheduled or triggered loop that re-evaluates against a source of
truth and keeps going until it converges. With Claude Code's
[scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks), that's
literally a one-liner (note: Claude, not Copilot):

```sh
# Every 5 min: diff what we've built against the spec, keep building until it matches
/loop 5m compare what we have built with our full spec (spec.md) \
  and continue building until we complete the full spec

# Once a day: scan the changelog and draft release notes — human review only
/loop 1d run changelog-scan + draft-release-notes. \
  write RELEASE_NOTES_DRAFT.md. human review only.
```

Two things worth noticing. First, the **stopping condition** is the real design
work — "until we complete the full spec" only works if `spec.md` is something the
model can actually check itself against. Second, the second example draws a hard
line: *draft only, human review only*. A loop that can both act and approve its own
work is how you wake up to a very expensive surprise.

## Where this is heading

Push the idea far enough and the loop starts editing the thing that runs the loop —
which is the polite name for **recursive self-improvement**. Anthropic has a
readable piece on
[when AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement)
if you want the serious version of the daydream.

## Worth reading

- [What Is Loop Engineering? — Kilo](https://kilo.ai/articles/what-is-loop-engineering)
- [Loop Engineering — LoomStack](https://loomstack.co/concepts/loop-engineering/)
- [cobusgreyling/loop-engineering](https://github.com/cobusgreyling/loop-engineering) — patterns, starters, and CLI tools
- [Run prompts on a schedule — Claude Code docs](https://code.claude.com/docs/en/scheduled-tasks)

---

My take: the term is mostly a rebrand of "agent loop with a good eval", but the
rebrand is useful — it puts the attention where it belongs, on the *stopping
condition* and the *check*, not on one heroic prompt. Just keep a human on the
approval step, and keep an eye on the meter. 🔥
