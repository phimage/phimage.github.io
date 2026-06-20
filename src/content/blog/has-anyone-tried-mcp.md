---
title: "Has anyone tried MCP? — and what it could mean for 4D"
description: "March 2025: MCP is only a few months old and not yet a standard, but people are already building real things on it. Here's the pitch — and a first sketch of what an MCP server for 4D could look like."
pubDate: 2025-03-04
tags: ["ai", "mcp", "4d", "agents"]
---

*Has anyone here actually tried the Model Context Protocol yet?* It only shipped in
**November 2024**, so it's far too young to call an industry standard — but I keep
running into people building genuinely useful things on top of it: database access,
custom business logic, IDE assistants. Worth a look before it's everywhere.

## What it is, quickly

[MCP](https://www.anthropic.com/news/model-context-protocol) is a standard way for
an AI model to reach **external tools, resources, and context** through one
consistent interface — instead of every app inventing its own glue. The moving parts
are roughly: **tools** (functions the model can call — a DB search, an API call, a
computation), **resources** (documents, tables, knowledge the agent can reference),
and **context/prompts** (session state and reusable templates that keep behavior
predictable). The payoff is the usual one for a good standard: add a capability once,
and any MCP-speaking client can use it.

The [reference implementations](https://github.com/modelcontextprotocol) are on
GitHub, and the "awesome" lists are already filling up fast
([punkpeye](https://github.com/punkpeye/awesome-mcp-servers),
[appcypher](https://github.com/appcypher/awesome-mcp-servers)).

## Why I'm interested: 4D

I wrote up a (yes, *too verbose* 😅) [exploration doc](https://gist.github.com/e-marchand/297d16f0f7d3bbdd4ad095654955b69f)
thinking through what MCP could be for **4D**. Two directions stood out.

**1. A developer assistant for the 4D IDE.** An MCP server that exposes 4D-aware
tools to an agent: code generation and completion that understands 4D syntax,
methods, and classes; debugging help; database-structure management; form-design
support; documentation generation. This is the shape the JetBrains MCP plugin already
takes for IntelliJ — read the open file, search the project, run a configuration — so
the pattern is proven, just not yet pointed at 4D.

**2. Business-logic tools for end apps.** The more interesting one for our customers.
You register your own 4D operations as tools — `CreateInvoice`, `SearchCustomer`,
`ScheduleDelivery` — and expose specific tables or views as resources, with session
and permission context around them. A 4D application then becomes a **bridge** between
an AI agent and your business logic, your data, and your external APIs. Users ask in
natural language; the agent calls the right registered operation; your code stays in
control of what's allowed.

## The bet

If MCP does become the standard it looks like it might, the win is that a 4D app
could expose its logic to *any* MCP-speaking agent without a bespoke integration per
tool. That's a future worth getting ahead of — which is why I'm poking at it now,
while it's still early enough that "has anyone tried this?" is a reasonable question.

## Worth reading

- [Introducing the Model Context Protocol — Anthropic](https://www.anthropic.com/news/model-context-protocol)
- [modelcontextprotocol on GitHub](https://github.com/modelcontextprotocol)
- awesome-mcp-servers: [punkpeye](https://github.com/punkpeye/awesome-mcp-servers) · [appcypher](https://github.com/appcypher/awesome-mcp-servers)
- [My MCP-for-4D exploration (verbose, sorry)](https://gist.github.com/e-marchand/297d16f0f7d3bbdd4ad095654955b69f)

---

Ask me again in a year whether MCP became a standard. My bet is yes — and that the
4D apps which expose their logic through it will look a lot smarter for having started
early. 🔌

---

## EDIT — I stopped wondering and started building

A while after writing this, I did roughly what I'd sketched above — in both languages.

- **Swift MCP** — I forked the official MCP Swift SDK as
  [`phimage/swift-sdk`](https://github.com/phimage/swift-sdk) (Apr 2025) to experiment
  with a **child-process transport**: spawn a server, talk to it over stdio. That
  "spawn a process, speak JSON-RPC" shape is the one I've kept running into everywhere
  since.
- **4D MCP** — then the 4D side: an MCP server,
  [`mesopelagique/MCP`](https://github.com/mesopelagique/MCP), built on a small
  JSON-RPC core, [`mesopelagique/JSONRPC`](https://github.com/mesopelagique/JSONRPC).

So: *yes, I tried MCP* — in Swift and in 4D — and the bet from this post still looks
good.
