---
title: "Context engineering — yes it's a buzzword, but this one's real"
description: "Context engineering is the step past prompt-writing: assembling everything the model needs — instructions, data, code, memory, tools — in the right format at the right time. A rebrand, sure, but one that points at where the real leverage is."
pubDate: 2025-07-04
tags: ["ai", "agents", "context-engineering", "buzzwords"]
---

Another week, another buzzword: **context engineering**. But this one earns its keep
— it names something real that "prompt engineering" was always too small for.

The idea: context engineering is the practice of **carefully assembling all the
information a model needs** — instructions, data, code, memory, tool definitions — to
do a task well. It goes beyond writing a clever sentence. You're structuring the entire
*context window* so the model actually has everything required, and not a pile of
things that get in the way.

## The shift from prompt to context

Prompt engineering optimizes the *wording* of a single request. Context engineering
optimizes *what's in the window at all* — what you retrieve, what you remember from
earlier, which tools you expose, how you format and order it. The realization that
drove the rename: once you're building agents rather than chatting, most failures
aren't "bad prompt." They're **wrong context, missing context, or too much context.**

The canonical one-liner has stuck for a reason — context engineering is about providing
the *right information and tools, in the right format, at the right time.* Four knobs:
right info, right tools, right format, right timing. Get those, and the prompt almost
writes itself.

## Why it surfaced now: agents

A single chat turn is an easy context problem. An **agent** is a hard one: it loops,
accumulates history, calls tools, reads files — and every step is a fresh assembly
problem. Feed it too little and it guesses (hallucinated files, forgotten rules); feed
it too much and it drowns, gets slower, and costs more. Sitting in the middle of that,
deciding what belongs in the window at each step, *is* the engineering.

## Worth reading (and watching)

- [Philipp Schmid — Context Engineering](https://www.philschmid.de/context-engineering)
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) ([talk](https://www.youtube.com/watch?v=4GiqzUHD5AA))
- [davidkimai/Context-Engineering](https://github.com/davidkimai/Context-Engineering)
- [12-Factor Agents — "Everything is Context Engineering"](https://youtu.be/8kMaTybvDUw?t=613) (saw this one at breakfast ☕️)

---

My take: it's a rebrand, yes. But a useful one — it drags attention away from "the
perfect prompt" and toward "the right window," which is where the leverage actually
lives the moment you stop chatting and start building. Context engineering is the new
skill in AI; the prompt was only ever the visible tip of it. ☕️
