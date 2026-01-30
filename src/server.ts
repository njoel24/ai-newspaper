import express from 'express';
import path from 'path';
import { runPlannerAgent } from './agents/plannerAgent.js';
import { runOrchestratorAgent } from './agents/orchestratorAgent.js';
import { clearAnalytics, clearArticles, clearTrends, getArticles, getAnalyticsSummary, getTrends } from './data/db.js';

export const app = express();
app.use(express.json());

const uiDir = path.join(process.cwd(), 'dist', 'ui');
app.use(express.static(uiDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(uiDir, 'index.html'));
});

app.use((req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
  });
  next();
});

app.get('/api/agents/planner', async (_req, res) => {
  try {
    const result = await runPlannerAgent();
    res.json(result ?? { status: 'ok' });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Planner failed' });
  }
});

app.get('/api/agents/orchestrator', async (_req, res) => {
  try {
    const result = await runOrchestratorAgent();
    res.json(result ?? { status: 'ok' });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Orchestrator failed' });
  }
});

app.get('/api/trends', async (_req, res) => {
  try {
    const trends = await getTrends(10);
    res.json(trends);
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to load trends' });
  }
});

app.post('/api/trends/clear', async (_req, res) => {
  try {
    const result = await clearTrends();
    res.json({ deleted: result.count });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to clear trends' });
  }
});

app.get('/api/articles', async (_req, res) => {
  try {
    const articles = await getArticles(20);
    res.json(articles);
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to load articles' });
  }
});

app.post('/api/articles/clear', async (_req, res) => {
  try {
    const result = await clearArticles();
    res.json({ deleted: result.count });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to clear articles' });
  }
});

app.get('/api/analytics/summary', async (_req, res) => {
  try {
    const summary = await getAnalyticsSummary();
    res.json({ summary });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to load analytics summary' });
  }
});

app.post('/api/analytics/clear', async (_req, res) => {
  try {
    const result = await clearAnalytics();
    res.json({ deleted: result.count });
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Failed to clear analytics' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('Server is ready and listening for requests...');
  });
  
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

export default app;
