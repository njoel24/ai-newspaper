# 🧠 LLM Layer Specification

## 1. Purpose

The **LLM Layer** provides a unified, safe, and structured interface for all agent interactions with large language models.

It acts as a “cognitive core” that:
- Formats prompts using pre-defined templates.
- Sends them to the chosen LLM provider.
- Parses and validates responses into typed JSON or text.
- Handles errors, retries, and token management.
- Enables consistent reasoning style across all agents.

---

## 2. Design Overview

All LLM interactions in the system must go through this layer.

### Architecture

+------------------------+
| Agent (e.g., Planner) |
+-----------+------------+
|
v
+-----------+------------+
| LLM Layer Interface |
| (prompt templates + |
| model client + parser)|
+-----------+------------+
|
v
+-----------+------------+
| OpenAI / Anthropic API |
+------------------------+

yaml
Copy code

---

## 3. Responsibilities

- Provide a **generic `invoke(model, promptTemplate, variables)`** interface.
- Load and render **prompt templates** dynamically from `/prompts/`.
- Support both **chat** and **completion** style APIs.
- Automatically **parse JSON outputs** when applicable.
- Handle **rate limiting, retries, and logging**.
- Support **streaming** (optional for future extensions).

---

## 4. Interfaces

### Input

```js
{
  "model": "gpt-4-turbo",
  "template": "plannerPrompt",
  "variables": {
    "trends": [...],
    "analyticsSummary": "Tech articles are performing best this week."
  },
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}