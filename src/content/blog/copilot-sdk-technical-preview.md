---
title: "Copilot SDK in technical preview — and why a 4D one is within reach"
description: "The Copilot SDK gives four languages programmatic access to the Copilot CLI. Under the hood it's the same trick as MCP, LSP, and ACP — spawn the CLI, talk JSON-RPC — which means any app can host an agent."
pubDate: 2026-01-23
tags: ["ai", "agents", "copilot", "sdk"]
---

GitHub put the **Copilot SDK** into technical preview, giving you *programmatic*
access to the Copilot CLI instead of only driving it by hand in a terminal. It
ships in [four languages](https://github.blog/changelog/2026-01-14-copilot-sdk-in-technical-preview/)
out of the gate:

- **Node.js / TypeScript** — `@github/copilot-cli-sdk`
- **Python** — `copilot`
- **Go** — `github.com/github/copilot-cli-sdk-go`
- **.NET** — `GitHub.Copilot.SDK`

All four expose the same shape: **multi-turn sessions** (history kept for context),
**custom tool execution** (define tools the model can call mid-conversation), and
**full lifecycle control** over the client and its sessions. The
[getting-started guide](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)
walks through each.

## The trick is the same one, again

Here's the part worth dwelling on. An SDK in a new language sounds like a big lift,
but it isn't — because under the hood the SDK doesn't reimplement Copilot. It just
**launches the `copilot` CLI as a subprocess** (stdio, or HTTP with a port) and
talks to it over **JSON-RPC**.

If that sounds familiar, it should: it's the exact same plumbing as **MCP**, **LSP**,
and **ACP**. One process speaks a line-delimited JSON-RPC protocol; everyone else is
a client. Once you've internalized that pattern, half the modern agent/tooling
ecosystem stops looking like separate magic and starts looking like the same
Lego brick wearing different hats.

Which is also why the official four aren't the ceiling. There's already a
[community SDK org](https://github.com/orgs/copilot-community-sdk/repositories?type=source)
filling in more languages, including a [C++ one](https://github.com/0xeb/copilot-sdk-cpp).
The barrier to "language X gets a Copilot SDK" is just: can language X spawn a
process and read/write JSON? Almost all of them can.

I pulled the Python sources apart to see exactly how the wiring works and wrote it
up here: [how the Copilot SDK works](https://gist.github.com/e-marchand/af7bea888353f513ffce41d2cf7fd00f).

## So… a 4D SDK?

This is the bit I keep coming back to. If an SDK is "spawn the CLI + JSON-RPC", then
**any app can host a Copilot agent** — including a 4D application. 4D can launch
worker processes and it speaks HTTP and JSON natively, which is the whole
requirement. A small `4D-copilot` component wrapping the CLI's stdio (or HTTP)
transport would let a 4D.app — or anything built with 4D — drive an agent the same
way the Node and Python SDKs do. No reimplementation, just a transport adapter and
a thin session API.

## Worth reading

- [Copilot SDK in technical preview — changelog](https://github.blog/changelog/2026-01-14-copilot-sdk-in-technical-preview/)
- [Build an agent into any app with the Copilot SDK](https://github.blog/news-insights/company-news/build-an-agent-into-any-app-with-the-github-copilot-sdk/)
- [github/copilot-sdk](https://github.com/github/copilot-sdk) · [getting started](https://github.com/github/copilot-sdk/blob/main/docs/getting-started.md)
- [Community SDKs](https://github.com/orgs/copilot-community-sdk/repositories?type=source) · [copilot-sdk-cpp](https://github.com/0xeb/copilot-sdk-cpp)

---

The headline is "Copilot SDK ships in four languages." The more interesting story
is that, thanks to a boring shared transport, the real number is *however many
languages can run a subprocess* — and that list includes the one I write 4D in. 🧩

---

## EDIT — and then I built the 4D one

I ended this post wondering whether a 4D Copilot SDK was reachable. It was — here's
the proof, both from June 2026:

- [`mesopelagique/CopilotSDK`](https://github.com/mesopelagique/CopilotSDK) — a Copilot
  SDK for 4D, driving the CLI exactly as described above.
- [`mesopelagique/CopilotSDKToOpenAI`](https://github.com/mesopelagique/CopilotSDKToOpenAI)
  — the piece I actually wanted: it wraps that as an **OpenAI-compatible endpoint**, so
  4D AIKit can point straight at it. The "thin transport adapter" from the last section,
  made real.

Spawn the CLI, speak JSON-RPC, expose it as `/v1/chat/completions` — and 4D has a
Copilot. The boring shared transport delivered again.
