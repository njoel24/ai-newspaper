# 🧩 Planner Agent Specification

## 1. Purpose

The **Planner Agent** acts as the **editor-in-chief** of the AI Newspaper.  
It decides which trending topics the system should cover next.

It analyzes:
- Current trending topics (from Trend Agent),
- Historical performance data (from Evaluator Agent / Analytics),
- Diversity requirements (avoid repetition or oversaturation),
- Predicted engagement value.

Then it produces a ranked list of **2–3 topics** with specific editorial angles and priorities.

---

## 2. Responsibilities

- Fetch the latest trending topics from the database.  
- Fetch analytics summary (top-performing categories, topics).  
- Use the LLM Layer to evaluate trends and generate a plan.  
- Output a structured list of `Topic Plans` to be used by the Writer Agent.  
- Store the plan in the database for reference.

---

## 3. Inputs

```js
{
  "trends": [
    { "topic": "AI Music Tools", "score": 0.92 },
    { "topic": "Climate Protests", "score": 0.85 },
    { "topic": "Electric Cars", "score": 0.81 }
  ],
  "analyticsSummary": "Tech and sustainability articles performed best last week. Readers showed high interest in creative AI tools and green mobility."
}