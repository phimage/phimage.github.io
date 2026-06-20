---
title: "Spending fewer tokens with Claude Code and GitHub Copilot 🪙"
description: "An improvised, battle-tested guide to burning fewer tokens in your IDE assistants — compress terminal output, freeze build scripts, script mass edits, throw away long sessions, slim your CLAUDE.md, clean your MCP servers, and let the AI be terse."
pubDate: 2026-05-09
tags: ["ai", "tokens", "claude-code", "workflow"]
---

Using assistants like Claude Code and GitHub Copilot in our IDEs is starting to cost
more and more — or the per-window token allowance keeps shrinking, or access to
certain models like Opus quietly disappears (it happened on my open-source
contributor accounts on GitHub — I had two — and in the base premium-request counts,
with a clear drift toward pay-as-you-go). So I went looking, on my side, for ways to
consume less.

## Preamble

The longer a conversation's history gets, the higher the latency *and* the more the
model gets confused — it forgets rules, hallucinates files. Because the context is
re-evaluated **in full** on every new message, token consumption climbs more or less
quadratically. Hence this improvised guide.

## 1. Compress terminal output (RTK — and headroom)

The biggest token sink in terminal agents (like Claude Code, or anything leaning on
`bash`) is the **raw output of commands**: test logs, linters, git trees.

**[RTK](https://github.com/rtk-ai/rtk) (Rust Token Killer)** is a very fast CLI proxy
(written in Rust, &lt;10 ms overhead) that intercepts, deduplicates, and cleans terminal
output before it reaches the LLM. It strips things like loading lines and repetitive
success logs, keeping only what matters — function signatures, important error traces.
To try it, install it and just prefix your heavy tools: `rtk cargo test`,
`rtk git status`. I used it with Claude Code and `rtk gain` showed me a solid number
of tokens saved.

If you want to go further, **[headroom](https://github.com/chopratejas/headroom)** is
RTK's bigger sibling: a local "context compression layer" that compresses *everything*
the agent reads — tool outputs, logs, RAG chunks, files, and conversation history —
for a claimed 60–95% fewer tokens, same answers. The neat part: it isn't an either/or
with RTK. **Headroom actually bundles the RTK binary** for shell-output rewriting and
compresses everything downstream of it (JSON, code via AST, prose). It runs as a
library, a drop-in proxy (`headroom proxy`), an MCP server, or a one-command agent
wrap (`headroom wrap claude`), and it's reversible — originals are cached and the
model can retrieve them on demand. Bonus: it also touches two of the points below —
`headroom learn` writes corrections into your `CLAUDE.md` / `AGENTS.md` (see §5), and
its output-token shaping nudges the model to be terser (see §7).

## 2. Don't make it guess the build — freeze simple scripts

Don't let the AI guess, or hunt indefinitely, for how to compile, run, or test your
project. That generates endless trial-and-error, and it's very greedy on input tokens.

**Freeze your commands:** write trivial automation scripts at the project root
(`./dev-build.sh`, `./run-tests.sh`) — or reusable skills.
**Declare them explicitly:** state them clearly in your startup instructions so the AI
runs the script in a single command instead of going looking for the framework's
configuration.

## 3. Ask for scripts for mass edits

When you have to modify dozens of similar files (say, adding an import across 15
components, or migrating an API signature):

**Avoid step-by-step mode.** Don't let the agent open, edit, and save each file one by
one. It's extremely slow, and it saturates the context by piling up the history of
every modified file.
**The scripted solution.** Ask the AI explicitly: *"Generate me a Python or Bash script
to automate this mass change across the whole project."* Review the script, run it
locally, and just hand the final result or a condensed diff back to the AI.

Even to add an element into a big, ordered file, you're better off with a script that
inserts at the right place than letting the model run a binary search to figure out
where. And sometimes it's just faster to do it by hand with a find-and-replace.

*Exception:* renames, when available via the LSP / VS Code — it's as if we already had
refactor scripts on hand.

## 4. Disposable conversations & summaries via a local LLM

Keeping the same session open for hours is the best way to waste both time and money.
Don't mix debugging an API route with a question about CSS architecture.

**Know when to start from zero:** as soon as a task is finished, start fresh.
**The handoff, via a local LLM (or not):** if you absolutely must carry context from a
previous session, ask for a "cold" summary optimized for a *future* AI. To go further,
copy the important history, ask a local model (via Ollama or llama.cpp) to synthesize
the decisions and the final code into one short paragraph, then paste that summary to
start your new session cleanly.

## 5. Progressive disclosure — slim down CLAUDE.md / AGENTS.md

Your `CLAUDE.md` (or `.github/copilot-instructions.md`) is read at the start of every
session and weighs on every message you send. If it's 5,000 tokens, you pay that tax on
every round-trip.

**The 150-line rule:** keep your global instruction files ultra-light — key
technologies, the exact validation commands.
**Skill routing:** instead of writing all your architecture rules in one place, create
specific Markdown files (e.g. `.claude/rules/database.md`). In your root file, just
reference them: *"For any schema change, first read `.claude/rules/database.md`."* The
AI only reads that file when the task calls for it, saving thousands of tokens.

## 6. Clean up your IDE and your MCP servers

In VS Code or Cursor, active extensions and MCP servers silently inject tool
definitions and system metadata into every request.

**Disable the superfluous:** if you're coding in Rust, temporarily disable heavy
extensions for other languages (like Python, or Jupyter Notebook tooling).
**Disable unused MCP servers:** fewer declared tools means less system overhead in the
"reserved output" of your context window.
**Configure exclusions:** block the indexing of heavy, low-relevance files (big XML
build files, lockfiles like `package-lock.json` or `yarn.lock`) in your code
assistant's exclusion settings.

## 7. The Micro-Caveman Prompt — let the AI be concise

Basically, you ask the AI to be concise. There's a trendy technique for this, "caveman"
— though personally I don't read caveman English very fast.

Adding this single line to your system instructions or prompt can save tokens:

> "Respond in a primitive way, with no pleasantries, no superfluous grammatical
> articles, and no explanatory blabla: show the code directly."

You can go further by asking for no final summary when you don't want one (especially
if you never read it). Or use a micro-caveman like this:

```text
Respond like smart caveman. Cut all filler, keep technical substance.
- Drop articles (a, an, the), filler (just, really, basically, actually).
- Drop pleasantries (sure, certainly, happy to).
- Skip recaps of my query.
- No hedging. Fragments fine. Short synonyms.
- Technical terms stay exact.
- Pattern: [thing] [action] [reason]. [next step].
```

Any instruction like this can be tuned to the tool and the LLM behind it — look at what
the LLM gives you, and think about what you don't actually need.

## End

If you've got other hacks or modes for cutting tokens without losing effectiveness,
I'm all ears 🙂
