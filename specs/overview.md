# 🗞️ AI Newspaper System — Overview Specification

## 1. Purpose

The **AI Newspaper System** is an autonomous, agentic AI platform that creates, publishes, and learns from online articles.

Its mission:
- Discover trending topics from the web,
- Select which ones to write about based on audience interest,
- Generate high-quality short articles,
- Publish them automatically,
- Learn from article performance metrics to improve over time.

The system is built in **Node.js**, following a **spec-driven, modular, agent-based architecture**.

---

## 2. Core Architecture

The system follows a **sense → plan → act → evaluate** cycle executed periodically.

| Phase | Description | Responsible Agent |
|--------|--------------|-------------------|
| **Sense** | Gather current trending topics | Trend Agent |
| **Plan** | Choose which topics to write about | Planner Agent |
| **Act** | Write and publish articles | Writer Agent, Publisher Agent |
| **Evaluate** | Learn from article engagement metrics | Evaluator Agent |

---

## 3. High-Level Flow

1. **TrendAgent** collects trending topics (e.g., from APIs or simulated sources) and stores them.
2. **PlannerAgent** decides which topics to write about using an LLM and past engagement data.
3. **WriterAgent** generates full articles (title, summary, body).
4. **PublisherAgent** publishes content (to file system, DB, or API endpoint).
5. **EvaluatorAgent** analyzes performance and updates topic weights or preferences.

The process repeats daily or hourly via a **Scheduler**.

---

## 4. Core Modules

### A. Agents
All agents follow a common interface:

```js
{
  run(input): Promise<output>
}
