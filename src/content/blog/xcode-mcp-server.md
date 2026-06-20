---
title: "Xcode 26.3 as an MCP server — letting agents drive Xcode"
description: "Most MCP servers give your agent access to something external. Xcode 26.3 flips it: Xcode exposes itself as a server, so an agent in VS Code (or anywhere) can discover, build, test, and preview a real Xcode project through Xcode's own machinery."
pubDate: 2026-02-04
tags: ["ai", "mcp", "xcode", "agents"]
---

Here's a fun inversion. Most MCP servers you add point *outward* — they give your
agent access to GitHub, a database, some API. **Xcode 26.3 points inward:** Xcode
itself becomes an MCP *server*, exposing its own capabilities so external agents can
operate it. Apple's doc calls it, plainly,
[giving external agents access to Xcode](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode).

The difference matters. Instead of an agent reconstructing your project by scraping
files off disk and guessing at the build system, it can just *ask Xcode*. The IDE
stops being the thing you wrestle and becomes a tool the agent calls.

## What it exposes

The server surfaces Xcode's real capabilities as tools — roughly: **project
discovery**, **file management**, **building and testing**, **graphic previews**,
**documentation access**, and more. I [dumped the full
list](https://gist.github.com/phimage/3dce85a54cb57bb73b5bcb8a93b33194?permalink_comment_id=5969534#gistcomment-5969534)
in a gist comment if you want to see everything that's on offer.

## Turn it on

It's opt-in, as it should be. Enable it in **Xcode → Settings → Intelligence →**
check **Xcode Tools**. Nothing connects until you flip that switch.

## Wire it into VS Code

If you've set up an MCP server in VS Code before, the file is familiar —
`.vscode/mcp.json` — but note the transport. A remote server like GitHub's is
`type: "http"` with a URL; Xcode is a **local `stdio`** server you launch via
`xcrun mcpbridge`:

```json
{
  "servers": {
    "Xcode": {
      "type": "stdio",
      "command": "/usr/bin/xcrun",
      "args": ["mcpbridge"]
    }
  }
}
```

`xcrun mcpbridge` is the bridge process; VS Code spawns it, speaks MCP over stdio,
and your agent gets Xcode's tools alongside whatever else you've configured. You can
keep both kinds in the same file — a remote `http` server and this local `stdio` one,
side by side.

## Why it's neat

Put it together and you can sit in VS Code — or any MCP host — and have your agent
build, test, and preview a *real* Xcode project through Xcode's own machinery, not a
reverse-engineered approximation of it. The build is the actual build; the preview is
the actual preview. The IDE as a callable tool is a genuinely different way to think
about agentic coding on Apple platforms.

## Worth reading

- [Giving external agents access to Xcode — Apple](https://developer.apple.com/documentation/xcode/giving-external-agents-access-to-xcode)
- [Full tool dump (gist comment)](https://gist.github.com/phimage/3dce85a54cb57bb73b5bcb8a93b33194?permalink_comment_id=5969534#gistcomment-5969534)

---

Two directions, one protocol: an agent can reach *into* Xcode, and — separately —
Xcode can reach *out* to agents. Same four letters doing both jobs. That's the whole
appeal of a standard. 🔧
