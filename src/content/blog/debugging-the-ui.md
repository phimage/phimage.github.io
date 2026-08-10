---
title: "Debugging is also clicking 🖱️"
description: "Stepping through code is only half of debugging — the other half is driving the interface. Web is easy (Playwright); native apps mean screenshots and OCR, unless you expose an accessibility tree. Which turns out to be faire d'une pierre deux coups: the same work that lets an agent click your UI lets assistive tech read it."
pubDate: 2026-08-10
tags: ["ai", "agents", "debugging", "accessibility", "macos", "4d"]
---

In the last couple of posts I let agents debug over [DAP](/blog/dap-for-agents) —
breakpoints, step over, continue. That's real debugging. But it's only half of it.
When I debug something for real, I also *click*: I press the button and watch what
happens, read the dialog, notice the toggle is greyed out. No backtrace ever tells
you the **Save** button never enabled. So — can the agent do that half too?

## The web is the easy case

Browsers are automatable by design. Most agent tools ship their own browser or
drive an external one; point [Playwright](https://playwright.dev) at a page and
every element has a stable, queryable handle. The DOM *is* an accessibility tree
wearing a different hat — roles, labels, structure, all there for the reading. For
the web, this half of debugging is close to solved.

## Native apps are another game

There's no DOM. When the agent has nothing to go on, it falls back to the eyeball
approach: take a screenshot, let the model look, maybe run OCR or a pre-analysis
pass to label what's on screen. It works — and sometimes it's the only option — but
it's brittle (a few pixels off and the click misses) and it burns tokens describing
pictures.

I ran into this by accident. I once wrote a tiny skill whose only job was to
screenshot a running 4D form and stitch an animated GIF for a README —
[4d-capture-gif](https://github.com/e-marchand/skills/blob/main/4d-capture-gif/SKILL.md).
Then I noticed Claude Code reaching for it to *debug*: the skill also reports a bit
of the form's structure — where the buttons are — so the agent knows where to
click. For simple cases it genuinely works. But screenshots-plus-coordinates is not
the thing I want to build on.

## The cleaner path: read the tree, don't look at pixels

Instead of staring at the screen, read the UI tree directly. On macOS you can
script the Accessibility API from Python (pyobjc), and there are automation
libraries to help. Now you're clicking *element #37, the "Save" button* instead of
*coordinate (412, 260), and hope*.

A couple of open-source tools are pushing exactly here:

- [**agent-desktop**](https://github.com/lahfir/agent-desktop) — a native CLI that
  exposes any app's accessibility tree as `snapshot` / `click` / `type` / `press`
  with structured JSON. No screenshots, precise element references. Its *progressive
  skeleton* mode drills down the hierarchy instead of dumping it whole, cutting
  prompt tokens dramatically (they cite 78–96% on dense apps). And it ships a C-ABI
  library, so Python, Swift, Go or Node can call it in-process instead of shelling
  out per action. (macOS today, more platforms in progress; needs Accessibility and
  Screen Recording permissions.)
- [**Open Interface**](https://github.com/AmberSahdev/Open-Interface) — the other end
  of the spectrum: an LLM (GPT-4o/4V, Gemini…) reads your request, drives the real
  mouse and keyboard, and re-screenshots to course-correct. Demos include solving
  Wordle and editing a Google Doc. End-to-end agentic desktop use, screenshots in
  the loop.

## Faire d'une pierre deux coups

Here's the thing I keep circling back to. If you build a native macOS or iOS app and
you *draw your own components*, there's nothing underneath them — the agent has no
tree to grab, so it's back to pixels. But if you implement the accessibility tree
for those custom components, you get *faire d'une pierre deux coups* — kill two birds
with one stone:

1. an AI agent can drive your UI by real element references, and
2. — the one that actually matters — people using VoiceOver, Switch Control or Voice
   Control can use your app.

The automation win comes for free, riding on the accessibility win. That's a rare
kind of alignment: the boring, decades-old right-thing-to-do turns out to be the
same work that makes your app agent-ready.

And Apple already tells you how, for Cocoa, UIKit and even SwiftUI. The WWDC26
session [*Refine accessibility for custom controls*](https://developer.apple.com/videos/play/wwdc2026/220)
walks through labels, values, adjustable actions and custom actions for exactly this
case — their example turns a custom coffee-dispenser control that assistive tech
could only read as a bare "button" into an adjustable one you swipe to change.
There's written guidance too — AppKit's
[custom controls documentation](https://developer.apple.com/documentation/appkit/custom-controls) —
and a whole [library of accessibility sessions](https://developer.apple.com/videos/accessibility-inclusion/)
behind it.

A 4D aside, and a note to self: I suspect that in 4D a form window is drawn as
essentially one big view, with no accessibility tree exposed underneath — which
would explain why the agent has to fall back to screenshots. That's something I want
to investigate.

## Something will emerge

LLM-driven desktop automation is a moving space — open tooling and academic interest
are both growing, and I'd bet the right abstraction hasn't shown up yet. Something
will. Meanwhile, if you're drawing custom UI, the move is clear enough: give it an
accessibility tree. The people who rely on it need it — and it happens to be exactly
what an agent needs to help you debug your own app. 🖱️
