---
title: "Apple's Foundation Models — an on-device LLM in a few lines of Swift 🧠"
description: "At WWDC 2025 Apple opened the on-device model behind Apple Intelligence to developers via the Foundation Models framework. The API is tiny — and I wrapped it in a CLI and an MCP server to see how far it goes."
pubDate: 2025-06-13
tags: ["ai", "apple", "swift", "foundation-models"]
---

At [WWDC 2025](https://developer.apple.com/videos/play/wwdc2025/286/) Apple did the
thing everyone wanted: it opened the **on-device large language model** behind Apple
Intelligence to developers, through the new **Foundation Models** framework. Ships
with macOS Tahoe (26) beta and Xcode 26, runs locally — so the usual privacy story,
no API key, no cloud cost, no network needed.

The part that surprised me is how *small* the API is. Here's a working session,
start to finish:

```swift
let session = LanguageModelSession(instructions: """
    You are a motivational workout coach that provides quotes to inspire \
    and motivate athletes.
    """
)

let prompt = "Generate a motivational quote for my next workout."
let response = try await session.respond(to: prompt)
print("\(response.content)")
```

That's it. An instructions string, a prompt, an `await`. No model loading, no
tokenizer wrangling, no server. For something that's a full LLM running on the
machine, the ergonomics are hard to beat.

## My experiments

I poked at it from a couple of angles:

- **[FoundationModelCli](https://github.com/phimage/FoundationModelCli/)** — a small
  command-line app, just to confirm the thing works outside an app target and to feel
  out the API. (Spoiler: see the snippet above — it really is that simple.)
- **[mcp-foundation-models](https://github.com/phimage/mcp-foundation-models/)** — an
  MCP server that wraps the framework, so any MCP client can reach Apple's *local*
  model. That's the one I find most interesting: a private, on-device model exposed
  over a standard protocol that the wider agent ecosystem already speaks.
- **[foundation-models-plugin](https://github.com/mesopelagique/foundation-models-plugin)** —
  a 4D plugin giving 4D code a direct path to the on-device model. Rougher than the
  other two, but it closes the loop: Swift, the MCP ecosystem, *and* 4D can now all
  reach the same local LLM.

## Why this matters

The framework itself is the headline, but the second-order effect is the fun one.
Once a private on-device model has a clean API, you can put it behind whatever
transport you like — a CLI, an HTTP server, an MCP server — and suddenly your
existing tools can use a model that never phones home. Small API, big surface area.

## Worth reading

- [Meet the Foundation Models framework — WWDC 2025 session 286](https://developer.apple.com/videos/play/wwdc2025/286/)
- [Foundation Models — framework documentation](https://developer.apple.com/documentation/foundationmodels)

---

Apple shipping a usable, on-device LLM API with no key and no bill is a quietly big
deal — and the moment it exists, wrapping it in a CLI or an MCP server is almost
irresistible. 🧠

---

## EDIT — and a year later, Apple shipped *its* `fm`

Looking back: putting the on-device model behind a CLI, an MCP server, and a 4D plugin
turned out to be the whole story — "small API, big surface area" held up. The punchline
came a year on, when macOS 27 shipped a command-line tool called `fm`… the same name
I'd given mine. [The full tale is here.](/blog/macos-27-ai-dev-ecosystem/) 🧠
