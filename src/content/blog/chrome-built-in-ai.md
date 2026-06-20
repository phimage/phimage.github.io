---
title: "Chrome's built-in AI, and the CEF catch 🌐"
description: "Chrome ships on-device AI (Gemini Nano) behind Web-standard APIs — translate, summarize, prompt, all local and private. The asterisk: it leans on Google-internal code that isn't in upstream Chromium, so embedded browsers (CEF) don't get it for free."
pubDate: 2026-01-26
tags: ["ai", "chrome", "web", "cef"]
---

Chrome now has **built-in AI**: on-device models (Gemini Nano and a couple of
smaller expert models) that run *locally in the browser* and expose plain
Web-standard APIs. No API key, no cloud round-trip, no per-token bill — the model
sits on the user's machine, so you get privacy and low latency by default. The
[developer docs](https://developer.chrome.com/docs/ai/built-in) are the canonical
reference.

## The APIs

There's a family of them, each feature-detectable with a simple `'X' in self` check:

- **Translator** and **Language Detector** — backed by small expert models.
- **Summarizer**, **Writer**, **Rewriter**, **Proofreader** — text-to-text via Gemini Nano.
- **Prompt API** — the general one, with multimodal input (text, images, audio).

Availability is uneven, so check before you lean on one: Summarizer, Translator, and
Language Detector are in Chrome stable; the Prompt API is stable too but, on the web,
mostly for extensions (origin trials / Early Preview elsewhere); Writer, Rewriter,
and Proofreader are still trial-stage. It's **desktop only** — no Android, iOS, or
plain ChromeOS yet.

The calling style is about as low-friction as a web API gets:

```js
const translator = await Translator.create({
  sourceLanguage: 'en',
  targetLanguage: 'fr',
});
await translator.translate('Where is the next bus stop, please?');
// "Où est le prochain arrêt de bus, s'il vous plaît ?"
```

## Turning it on

If it's not enabled by default, two flags get you there:

```
chrome://flags/#optimization-guide-on-device-model
chrome://flags/#prompt-api-for-gemini-nano
```

The model downloads on first use (a few GB — budget for it; Chrome wants ~22 GB free
on the profile's volume and will evict the model if you drop below ~10 GB). On macOS
it lands at:

```
$HOME/Library/Application Support/Google/Chrome/OptGuideOnDeviceModel
```

And `chrome://on-device-internals` is the page for checking model size, status, and
debugging what you're actually sending to Gemini Nano.

## The catch: CEF (and anything embedding Chromium)

Here's the part that matters if you ship a native app with an embedded browser.
Chrome's built-in AI relies on **Google-internal code** — the on-device models and
the bindings around them — that **isn't fully in upstream Chromium**. So in
**CEF (Chromium Embedded Framework)** it's deactivated by default; you don't just
get `window.ai` for free inside an embedded web view.

The CEF issue thread
[#3982](https://github.com/chromiumembedded/cef/issues/3982) has the clearest
write-up of how the feature is wired and why upstream/embedded builds can't simply
flip it on. There's also a [hint](https://github.com/chromiumembedded/cef/issues/3982#issuecomment-3202480496)
that one day an OS-provided model could be the path forward instead.

The practical takeaway: built-in AI is, for now, a **top-level-Chrome** capability,
not a "Chromium" one. If your UI lives inside an embedded web area — a 4D web area, a
CEF-based shell, an Electron-adjacent stack — don't design around `window.ai` being
present there yet. Detect, degrade gracefully, and keep a server or local-model
fallback for the embedded case.

## Worth reading

- [Built-in AI — Chrome docs](https://developer.chrome.com/docs/ai/built-in)
- [Get started (availability + hardware requirements)](https://developer.chrome.com/docs/ai/get-started)
- [CEF issue #3982 — built-in AI in embedded Chromium](https://github.com/chromiumembedded/cef/issues/3982)

---

On-device, standard-API, privacy-preserving AI in the browser is a genuinely big
deal for the open web. Just remember the model that makes it work is Google's, not
Chromium's — which is the whole reason the embedded story has an asterisk. 🌐
