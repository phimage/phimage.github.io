---
title: "Pipeline, Flow, or Chain? Picking the Right Tool to Wire LLM Calls Together"
description: "Once one prompt's output feeds the next, you have a workflow — and a naming problem, and a tooling choice. When do you reach for a chaining library, and when for a real orchestrator like Airflow or Step Functions?"
pubDate: 2026-06-26
tags: ["ai", "agents", "workflow", "orchestration", "llm"]
---

In the [previous post](/blog/agents-as-planners/) I argued that agents are great
*planners* and DAGs are great *executors*. This one is the practical follow-up: when
you actually sit down to wire several LLM calls together, **what tool do you reach
for?**

Because the moment one prompt's output feeds the next, you've built a workflow —
whether you call it that or not.

```text
download transcript → summarize → translate
       (tool)          (LLM)       (LLM)
```

That tiny pipeline is already the whole problem in miniature: a non-LLM step (fetch a
YouTube transcript), then a model call, then another model call that depends on the
first. Run it as one giant prompt and you lose visibility; split it into steps and you
gain debuggability — at the cost of more calls and more state to manage.

## The naming trap

Half the confusion is vocabulary. The same idea ships under a dozen labels:

| Name           | What it whispers              |
| -------------- | ----------------------------- |
| Chain          | sequential, output → input    |
| Pipeline       | stages, data flowing through  |
| Flow           | branches and conditions       |
| Workflow       | general orchestration         |
| Agent workflow | the model also *decides*      |

The word sets expectations. "Chain" promises a straight line; "agent workflow"
promises the thing might re-plan on you mid-run. Pick the label that matches how much
autonomy you're actually handing over — calling a deterministic two-step pipeline an
"agent" only invites disappointment.

## The real choice: library or orchestrator?

There are two families of tools, and they solve different problems.

**LLM-native chaining libraries** — [LangChain](https://www.langchain.com/),
[LlamaIndex Workflows](https://docs.llamaindex.ai/en/stable/module_guides/workflow/),
[Azure Prompt Flow](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/),
or visual layers like [Flowise](https://flowiseai.com/). These understand
*LLM-specific* concerns out of the box: prompt templating, passing context between
steps, token budgets, streaming, retries on a flaky model.

**General orchestrators** — [Airflow](https://airflow.apache.org/),
[Prefect](https://www.prefect.io/), [AWS Step Functions](https://aws.amazon.com/step-functions/),
[Azure Logic Apps](https://azure.microsoft.com/en-us/products/logic-apps). These treat
each LLM call as just another task in a DAG, and give you the heavyweight reliability
machinery: durable state, scheduling, checkpointing, audit trails, human approval.

The rule of thumb that falls out of the last post:

```text
Few prompts, mostly LLM glue   → chaining library
Many steps, must not fail      → orchestrator (LLM call = one task)
The model decides the path     → agent, with one of the above underneath
```

## When you don't need either

Don't reach for a framework reflexively. If the task is genuinely simple, **one
well-crafted prompt** (few-shot or chain-of-thought) often beats a three-step pipeline
— fewer calls, less latency, nothing to orchestrate. Chaining earns its keep when
subtasks are distinct enough that isolating them actually improves accuracy and lets
you debug each one independently. The cost is real: every extra hop adds latency, and a
weak early step poisons everything downstream.

## A concrete chain

To get a feel for the moving parts I built [PromptKit](https://github.com/mesopelagique/PromptKit),
a small 4D toolkit where a chain is just named prompts piped together — the YouTube
example above, minus the download step:

```4d
var $result:=$runner.newChain().prompt("summarize").prompt("translate").run($transcript)

// $result.text     -> final translated summary
// $result.outputs  -> each step's output, for inspection
```

Nothing exotic — but writing it made the trade-offs tangible: where state lives, what
happens when step two fails, how you'd add a branch. Which is really the point. You
don't pick the tool by reading the marketing; you pick it by knowing whether your
problem is *LLM glue* or *reliable execution* — and most of the time, it's a bit of
both.

---

My take: "chain vs. workflow vs. agent" is less an architecture question than an
honesty question — how deterministic is your process, really? Name it accordingly,
then pick the lightest tool that survives the day you actually need a retry.
