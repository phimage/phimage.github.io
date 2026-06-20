---
title: "When Agents Become Planners, What Remains of Workflow Orchestration?"
description: "AI agents don't kill workflow engines — they move the DAG down a layer. Agents become the planners; orchestrators like Airflow, Step Functions, and Temporal become the reliable executors."
pubDate: 2026-06-25
tags: ["ai", "agents", "workflow", "orchestration", "dag"]
---

For years, software automation has been built around a simple idea: define the
process, then execute it. Whether using a script, a workflow engine, or a DAG, the
principle is always the same:

```text
A → B → C → D
```

The developer knows the steps in advance.

AI agents challenge this model. Instead of defining *how* to achieve a goal, we
increasingly define *what* we want and let the agent figure out the steps.

This reminds me of the difference between traditional programming and agentic
programming.

| Traditional Programming   | Agentic Programming        |
| ------------------------- | -------------------------- |
| Define the algorithm      | Define the objective       |
| Deterministic execution   | Probabilistic execution    |
| Every path is known       | Paths emerge dynamically   |
| Optimized for reliability | Optimized for adaptability |

When the process is well known, code is often the best solution. When the process is
uncertain, constantly changing, or requires exploration, agents start to shine.

A useful way to think about it is:

```text
Known problem    → Code
Known process    → Workflow
Unknown process  → Agent
```

This is why some people argue that traditional orchestrators such as
[Apache Airflow](https://airflow.apache.org/) or
[AWS Step Functions](https://aws.amazon.com/step-functions/) are not well suited for
agentic systems. AI agents are fundamentally non-deterministic. They may decide to use
different tools, follow different paths, or even change their plan while executing it.

A static DAG cannot describe every possible future path.

But does that mean workflow orchestration is becoming obsolete?

I don't think so.

Even the most advanced agents still need:

* State persistence
* Retries
* Checkpointing
* Human approval
* Scheduling
* Audit trails
* Observability

In other words, they still need many of the things workflow engines have solved for
years.

The architecture is simply evolving.

Yesterday we had:

```text
Workflow Engine
       ↓
      Tasks
```

Tomorrow we may have:

```text
Agent
  ↓
Execution Engine
  ↓
Tools
```

The agent becomes responsible for planning. The orchestration layer becomes
responsible for reliable execution.

This is why I don't believe DAGs are disappearing. They are simply moving down a layer.

The mistake is thinking agents eliminate workflows. What they really eliminate is the
need to define every workflow in advance.

Agents are excellent planners. Workflows are excellent executors.

The future may not be *Agents vs DAGs*. It may simply be:

> Agents for planning. DAGs for execution.

## Worth reading

- [Advanced LangGraph Orchestration — Enterprise-Ready AI Workflow Management](https://dev.to/topuzas/advanced-langgraph-orchestration-enterprise-ready-ai-workflow-management-186)
- [Agentic AI and Temporal Orchestration](https://intuitionlabs.ai/articles/agentic-ai-temporal-orchestration) — pairing agents with [Temporal](https://temporal.io/) for durable execution
- [Apache Airflow](https://airflow.apache.org/) · [AWS Step Functions](https://aws.amazon.com/step-functions/) — the classic DAG-based orchestrators
- [GraphBit: A Graph-based Agentic Framework for Non-Linear Agent Orchestration](https://arxiv.org/abs/2605.13848) — agents and graphs, together
- [Observability for Delegated Execution in Agentic AI Systems](https://arxiv.org/abs/2606.09692) — the execution-layer concerns that don't go away

---

As a side project, and to better understand what happens inside a workflow engine, I'm
also experimenting with implementing a DAG engine in 4D. It started as a task scheduler
but evolved into a good opportunity to explore orchestration concepts from the inside.

The project is available here:
[mesopelagique/Scheduler — Dag.md](https://github.com/mesopelagique/Scheduler/blob/main/Documentation/Classes/Dag.md)

A quick word on where I'm coming from: my hands-on experience with DAGs proper is
limited to [Airflow](https://airflow.apache.org/) for ML pipelines — pulling data from
the data warehouse, cleaning it, transforming it, and feeding the next stage. Beyond
that, as a developer I mostly live in CI tooling —
[GitHub Actions](https://github.com/features/actions),
[GitLab CI](https://docs.gitlab.com/ee/ci/),
[TeamCity](https://www.jetbrains.com/teamcity/) — which share a lot of common ground
with workflow engines: stages and dependencies, retries, caching/artifacts,
conditional steps, and approvals. Different vocabulary, same orchestration instincts.
