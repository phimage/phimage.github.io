---
title: "acpdbg: let the agent sit at the debugger 🐛"
description: "LLM agents are great at static analysis — I keep pasting crash stacks into their context. So why not let the agent read the lldb data itself over ACP, and even drive the debugger? It's a try."
pubDate: 2026-07-11
tags: ["ai", "agents", "acp", "lldb", "debugging", "open-source"]
---

I had an idea, and it starts from a habit.

LLM agents are genuinely good at **static analysis**: give them a backtrace and
the source around it, and they usually spot the bad pointer before I do. So what
do I actually do when a native program crashes? I copy the stack trace from the
debugger, paste it into the agent's context, then copy the source of the
functions involved, paste again… I'm the transport layer between two programs
that both live on my machine.

That's the idea: **why not let the agent look at the lldb debug data itself —
and even control the debugging?**

I already wrote about [ACP, the Agent Client Protocol](/blog/acp-copilot-xcode) —
the standard that lets any agent talk to any client. Usually the client is an
editor. But nothing says it has to be. A debugger is a perfectly good ACP client
too. So I built one.

## acpdbg

[**acpdbg**](https://github.com/phimage/acpdbg) is an LLDB assistant. When your
C/C++/Rust/Swift program stops — crash, signal, or breakpoint — it captures an
enriched snapshot (backtrace, every frame's live arguments, surrounding source)
and hands it to your coding agent over ACP: GitHub Copilot CLI, Gemini CLI, or
Claude Code through its ACP adapter.

The part I like most: the agent doesn't just read a frozen report. Through a
small MCP tool bridge it can run *live* debugger commands against the stopped
process — `bt`, `frame variable`, `p some_expr` — to confirm its hypothesis
instead of guessing. And with the opt-in **control mode**, it gets `step_over`,
`continue_execution`, `set_breakpoint`… so it can debug like a human would:
set a breakpoint, run to it, step, watch the state evolve.

## Try it fast

The whole loop works offline with a bundled mock agent, nothing else to install:

```bash
pip install acpdbg
git clone https://github.com/phimage/acpdbg && cd acpdbg/samples
make                # builds ./crash with -g
acpdbg -- ./crash   # runs it; on the crash the agent explains
```

Swap in a real agent for real analysis:

```bash
acpdbg --agent copilot -- ./crash
```

Real output from that command:

```
acpdbg → copilot (investigating…)

Confirmed live: `s` is 0x0000000000000000 — a NULL pointer — right where
strlen(s) dereferences it.

Root cause: in main, `name` is NULL when the program runs with no arguments,
and describe() hands it to strlen() with no check.

One-line fix: return s ? strlen(s) : 0;
```

## Inside lldb — and inside Xcode

It's also a plain LLDB plugin. Install it once:

```bash
acpdbg --install-lldbinit --agent copilot
```

and every lldb session — including **Xcode's debugger console** — gets new
commands. Stop anywhere (a crash, a breakpoint, a watchpoint) and just type:

```lldb
(lldb) ask why is `retry_count` already 3 here?
(lldb) copilot in one sentence, why did this stop?
(lldb) claude what would you change to fix it?
```

Each installed agent gets its own command, so you can get a second opinion from
another model without touching the config.

## It's a try

I don't claim this is *the* way to debug. It's an experiment: the interesting
part for me is that ACP made it cheap to build — I wrote a client once, and
every ACP-speaking agent works with it, today's and tomorrow's. The same
N×M collapse I liked about the protocol in editors, applied to a debugger.

Code, docs, and caveats: [github.com/phimage/acpdbg](https://github.com/phimage/acpdbg).
Tell me where it breaks. 🐛
