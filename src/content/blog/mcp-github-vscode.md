---
title: "MCP, in practice: GitHub in VS Code — checked in for the team"
description: "Eight months after wondering whether anyone had tried MCP, here it is running for real: the GitHub MCP server in VS Code, wired to our issues, projects, and test cases — with the config committed to the repo so the whole team gets it on checkout."
pubDate: 2025-10-31
tags: ["ai", "mcp", "github"]
---

A while back I asked whether anyone had actually *tried* MCP. Update: I have, and it
stuck. The most useful day-to-day version so far is the **GitHub MCP server in VS
Code** — so the agent can work directly with our issues, projects, pull requests,
and test cases instead of me copy-pasting context into a chat.

## The whole setup is one file

Drop a `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

That's it. You point VS Code at GitHub's **remote** MCP server, authenticate once
with OAuth (VS Code 1.101+), toggle Agent mode, and the tools show up. No Docker, no
personal access token to babysit, nothing to install.

## What it can actually do

The default toolsets cover most of what you'd want, and you can trim or extend them
with an `X-MCP-Toolsets` header (or flip the whole thing read-only for safety):

- **Repos** — search code and read files without a local clone.
- **Issues & pull requests** — file, triage, label, review, even merge from a prompt.
- **Projects** — manage items and summarize progress (added to the server in October).
- **Actions** — inspect CI/CD runs, fetch logs, re-run failed jobs.
- **Code security** — surface code-scanning and Dependabot alerts.

```json
      "headers" : {
        "X-MCP-Toolsets": "context,issues,labels,orgs,projects,users"
      }
```

A late-October update also added
[**server instructions**](https://github.blog/changelog/2025-10-29-github-mcp-server-now-comes-with-server-instructions-better-tools-and-more/)
— think of it as a system prompt baked into the server itself, telling the model how
to use the tools in the right order (e.g. the proper sequence for reviewing a PR).
In practice the agent got noticeably better at issue and PR workflows, and the team
consolidated several narrow tools into fewer, more capable ones to keep the context
window lean.

## PS — it doesn't have to be per-project

`.vscode/mcp.json` is the per-repo route, which is what I wanted here so it travels
with my project. But you can also install MCP servers
[globally in your VS Code user profile](https://code.visualstudio.com/docs/copilot/customization/mcp-servers),
or let them be discovered from a Claude config — handy for servers you want
everywhere, not just in one repo.

## Worth reading

- [github/github-mcp-server](https://github.com/github/github-mcp-server) — the official server + toolset reference
- [Server instructions & better tools (Oct 29, 2025)](https://github.blog/changelog/2025-10-29-github-mcp-server-now-comes-with-server-instructions-better-tools-and-more/)
- [Add and manage MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)

---

This is the "has anyone tried MCP?" question answered the only way that counts: a
one-file config in a shared repo, and a team that can now talk to its own issues and
projects in plain language. The protocol bet is starting to pay rent. 🔌
