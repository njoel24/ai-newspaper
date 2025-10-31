# 🧱 Data Layer Specification

## 1. Purpose

The **Data Layer** is the unified interface for storing, retrieving, and updating data across the AI Newspaper system.

It ensures that all **agents** (Trend, Planner, Writer, Evaluator, Orchestrator) share a consistent view of data.

It abstracts away the underlying database (can start with a simple local SQLite or MongoDB).

---

## 2. Responsibilities

- Provide **CRUD access** to all entities: Trends, Plans, Articles, Analytics.
- Offer **query helpers** for common operations (e.g., get latest trends, save plan, fetch top articles).
- Handle **schema validation** and **error resilience**.
- Be **decoupled** from agents — exposed only through exported functions.

---

## 3. Chosen Stack

- **Database**: SQLite (via Prisma ORM) for simplicity and single-developer setup.  
  *(You can easily swap for Postgres later — same schema.)*
- **ORM / Client**: Prisma (for typed access, migrations, and simplicity).
- **Directory**: `/src/data/`

---

## 4. Database Schema (Initial)

### Table: `Trend`
| Field | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `topic` | string | Trending topic name |
| `score` | float | Popularity score (0–1) |
| `source` | string | API or dataset name |
| `timestamp` | datetime | When it was recorded |

### Table: `Plan`
| Field | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `createdAt` | datetime | Timestamp of creation |
| `topics` | JSON | Array of `{ topic, angle, priority }` |
| `rawResponse` | text | Raw JSON from LLM |
| `source` | string | Agent name or run ID |

### Table: `Article`
| Field | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `topic` | string | The main topic or headline |
| `title` | string | Article title |
| `summary` | text | Short abstract |
| `body` | text | Main content |
| `author` | string | "AI Writer" or similar |
| `createdAt` | datetime | Creation date |
| `planId` | string | FK → Plan.id |

### Table: `Analytics`
| Field | Type | Description |
|--------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `articleId` | string | FK → Article.id |
| `views` | integer | Number of views (simulated or real) |
| `likes` | integer | Engagement metric |
| `rating` | float | Average rating (0–5) |
| `timestamp` | datetime | Recorded date |

---

## 5. Data Access API

All database logic should live in `/src/data/db.js` and `/src/data/models/*.js`.

### Exposed functions (from `/src/data/db.js`):

```js
// Trend operations
export async function getTrends(limit = 10) {}
export async function saveTrends(trendsArray) {}

// Planner operations
export async function savePlan(planData) {}
export async function getLatestPlan() {}

// Article operations
export async function saveArticle(articleData) {}
export async function getArticles(limit = 10) {}

// Analytics operations
export async function saveAnalytics(record) {}
export async function getAnalyticsSummary() {}
