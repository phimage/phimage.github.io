---
title: "Reranking in RAG — the precise second pass"
description: "Embedding search is a fast first pass that's only roughly right. A reranker is the cheap precision fix: a cross-encoder that re-scores the top candidates by reading query and document together. Here's why it works and what's out there."
pubDate: 2026-02-11
tags: ["ai", "rag", "embeddings", "retrieval"]
---

In a RAG pipeline, the first thing you do is retrieve candidate documents — with
embeddings or keyword search. That's fast, but not always precise: you tend to get
back chunks that are *topically* in the neighborhood, where the genuinely
best-matching one isn't necessarily at the top.

**Reranking** is the second stage that fixes the ordering. It takes each
query–document pair and looks at it more carefully — re-scoring the candidates so the
truly relevant ones rise. It catches subtle relevance signals a plain embedding search
misses.

> Ranker = fast first pass. Reranker = precise second pass. Use both and your
> retrieval gets meaningfully more accurate.

## Why it actually works: bi-encoder vs cross-encoder

This is the part worth understanding, because it explains both the precision *and* the
cost.

Embedding models are **bi-encoders**: the query and each document are encoded
*separately* into vectors, and you compare them with cosine similarity. The win is
speed and scale — you precompute every document vector once and search millions
cheaply. The catch is that the model never sees the query and the document *together*,
so it can't reason about fine-grained interactions between them. Topically close,
sometimes literally wrong.

A reranker is a **cross-encoder**: it feeds the query and one candidate through the
model *jointly*, so self-attention can weigh every word of the query against every word
of the document. That's a much truer judgment of relevance and intent. The price: you
can't precompute anything — every query–document pair is a fresh forward pass — so it's
far too expensive to run over the whole corpus.

The resolution is the funnel. Cheap bi-encoder retrieval narrows millions of documents
to a small candidate set; the expensive cross-encoder only ever re-scores that handful.
Fast where it needs to be fast, precise where it needs to be precise.

## The usual shape of the pipeline

```text
query
  ↓  dense (embeddings) + optional sparse (BM25), merged with RRF
top 50–200 candidates
  ↓  cross-encoder reranker
top 5–10
  ↓  LLM
```

Retrieve broad, rerank narrow, hand the LLM only the few chunks that survived both
passes.

## What's out there

- **Python reference library:** [rerankers](https://github.com/answerdotai/rerankers)
  (Answer.AI) — a single interface over many reranker types, so you can swap models
  without rewriting your pipeline. Worth designing around, because this space moves fast.
- **Hosted APIs:** [Voyage AI](https://docs.voyageai.com/docs/reranker) (Anthropic's
  reference provider for embeddings — it also ships dedicated reranker models), plus
  Cohere Rerank, Pinecone, and newer entrants like ZeroEntropy's Zerank. One gap to
  note: **OpenAI's standard API has no dedicated reranker endpoint.**
- **Self-hosted:** cross-encoder models like BGE-reranker, ms-marco MiniLM, Jina, or
  mxbai, served via llama.cpp or a text-embeddings server. Some reranker models even
  show up in [ollama's search](https://ollama.com/search?q=reranker) — but heads-up,
  **ollama has no rerank endpoint**, so you'd serve them yourself rather than call a
  `/rerank` route.

A word of caution on picking one: the reranker leaderboards genuinely shuffle with
every model release, so wire yours in behind a one-line config swap and measure on
*your* data rather than trusting vendor benchmarks.

## Worth reading

- [rerankers (Answer.AI)](https://github.com/answerdotai/rerankers) — the library
- [Voyage AI reranker docs](https://docs.voyageai.com/docs/reranker)
- 🇫🇷 [Reranking : tout savoir sur cette technique du RAG — Blent](https://blent.ai/blog/a/reranking-tout-savoir)
- [What is a reranker and do I need one? — ZeroEntropy](https://www.zeroentropy.dev/articles/what-is-a-reranker-and-do-i-need-one)

---

If your RAG answers are vague even though retrieval "looks right," the fix is usually
not a fancier embedding model — it's a reranker. It's the cheapest precision upgrade in
the whole pipeline: one extra pass over a handful of candidates, and the right chunk
finally lands on top. 🎯
