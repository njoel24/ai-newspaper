# 🧩 Orchestrator Agent Specification

## 1. Purpose
The **Orchestrator Agent** supervises the AI Newspaper workflow.  
It ensures that the pipeline runs in order and handles errors gracefully.

---

## 2. Responsibilities
- Trigger **Planner Agent** to generate article plans.
- Trigger **Writer Agent** to generate articles based on plans.
- Trigger **Evaluator Agent** to analyze generated articles.
- Handle retries on failure or LLM errors.
- Optionally schedule recurring runs (daily, weekly).

---

## 3. Inputs
- None explicitly; it fetches data from DB and triggers agents.

---

## 4. Outputs
- Logs the progress of each agent.
- Returns a summary object:

```js
{
  planner: { success: true, topicsPlanned: 5 },
  writer: { success: true, articlesGenerated: 5 },
  evaluator: { success: true, analyticsSaved: 5 }
}
