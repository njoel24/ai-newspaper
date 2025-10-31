# 🧩 Writer Agent Specification

## 1. Purpose
The **Writer Agent** generates full article drafts for the AI Newspaper.  
It consumes the **Planner Agent’s topics** and produces **structured articles** with title, summary, and body text.

---

## 2. Responsibilities
- Read the latest plan from the database.
- For each topic:
  - Use the LLM Layer to generate an article.
  - Ensure proper formatting (title, summary, body).
- Save generated articles to the database (`Article` table).
- Return success/failure status per article.

---

## 3. Inputs

```js
{
  planId: "plan_2025_10_21",
  topics: [
    {
      topic: "AI Music Tools",
      angle: "How creators are using AI ethically in music production",
      priority: 0.95
    },
    {
      topic: "Electric Cars",
      angle: "Why affordable EVs are finally becoming mainstream",
      priority: 0.88
    }
  ]
}
