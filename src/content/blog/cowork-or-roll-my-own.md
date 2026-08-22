---
title: "Cowork, or roll my own? ☁️"
description: "Cowork has been out a while: managed cloud sessions for Claude Code, even a desktop an agent can drive. I keep trying it and drifting back, because I already run the stack it packages. So do I actually need it? The one thing I can't cheaply reproduce is a session that runs online while my laptop's shut."
pubDate: 2026-08-22
tags: ["ai", "agents", "cowork", "claude", "orchestration"]
---

**Cowork** has been around a while now: Claude Code with the plumbing handled for
you — sessions that run in the cloud, connectors and plugins already wired up, an
isolated place (a whole desktop, even) to let an agent loose. I've kicked the
tyres a few times. I've never actually stuck with it. Which leaves a question I
keep not answering: do I need it?

Because I already run most of this myself.

## What I already have

I've spent a while building the stack Cowork packages. Scheduled loops that
re-run a prompt against a spec until it converges — that's
[loop engineering](/blog/loop-engineering), and on my machine it's a cron line
and a stopping condition. Orchestration for when the steps have to be reliable —
[agents as planners](/blog/agents-as-planners) sitting on top of boring, durable
executors. And when I want a fleet instead of one session, there's a whole
self-hosted crowd to pick from — OpenHands, Hermes, openclaw, take your pick —
running on hardware I control.

None of that came free. It's evenings of yak-shaving. But it exists, it's mine,
and I understand every moving part, which was the point of building it.

## The isolated-environment argument

The strongest case for Cowork, for me, is the sandbox — and its sharper cousin, a
whole *desktop* the agent can drive, not just a shell. Somewhere it can open apps,
click around, and `rm -rf` its own mistakes while I don't flinch.

That last part lands close to home. The last few posts have been me coming at app
control from the other side: teaching an agent to
[drive a native UI by its accessibility tree](/blog/debugging-the-ui) and to
[debug over DAP](/blog/dap-for-agents), on my own machine. Cowork rents the machine
and the environment; I've been building the part that makes an agent useful once
it's inside one. Different halves of the same problem — and I care more about the
half I don't get handed.

The environment itself, though, is reproducible. A Docker container, a fresh VM,
a disposable branch — I can hand an agent somewhere it can't hurt anything. On a
Mac there's an even neater option now: Apple's own
[`container`](https://github.com/apple/container) runs each Linux image in its own
lightweight VM. More effort than clicking a button, sure. But not a capability
I'm missing.

## The part that's actually annoying to reproduce

The session runs *online*, on someone else's hardware, and keeps going after I
close the lid. That's the piece I can't cheaply fake.

My local setup has a tax I rarely mention: the tool calls run on *my* machine.
The model thinks in the cloud, but every `bash`, every file read, every build
happens in front of me — so the laptop has to stay awake and reachable for the
loop to make any progress. Cowork moves the whole thing off my desk. Kick off a
task, walk away, shut the lid, come back to a result. Reproducing that isn't a
weekend project; it's standing up real remote workers and keeping them alive.

## So who's it for?

Not me, mostly — at least not for the small stuff. I'm the person who *wants* to
play with the stack and know it, and I've already paid that tuition. Cowork
doesn't sell me a capability I lack; it sells convenience I chose to build
instead.

The target — la cible — is whoever doesn't want any of that. Who'd rather not
learn what a stopping condition is, keep a VM warm, or babysit a self-hosted
orchestrator at 1am. For them the managed infra isn't a nice-to-have, it's the
whole reason to show up. Fair product.

So: do I need Cowork? For little things, not today — I'm not the cible. But I
keep opening it, and I expect I'll keep trying: the day I want a dozen sessions
running online while my laptop's shut, the maths tips over. More a bookmark than
a verdict. Ask me again when I'm tired of keeping the machine awake. ☁️
