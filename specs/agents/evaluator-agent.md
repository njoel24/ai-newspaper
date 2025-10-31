# 🧩 Evaluator Agent Specification

## 1. Purpose
The **Evaluator Agent** analyzes generated articles to assess their quality and popularity.  
It provides scores and metrics that can be used by the Planner Agent to refine future topics.

---

## 2. Responsibilities
- Read recently generated articles from the database.
- Optionally simulate article engagement (views, likes, ratings) or integrate with real analytics.
- Calculate quality metrics:
  - Readability
  - Relevance to topic
  - Engagement prediction
- Store results in the `Analytics` table.
- Provide feedback for Planner Agent (for iterative improvement).

---

## 3. Inputs

```js
[
  {
    articleId: "article_001",
    title: "The Ethical Rise of AI in Music Production",
    body: "...",
    topic: "AI Music Tools"
  }
]
