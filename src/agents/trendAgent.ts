import { getTrends, saveTrends } from '../data/db.js';

export async function runTrendAgent(limit = 10) {
  const existing = await getTrends(limit);
  if (existing && existing.length > 0) return existing;

  const seed = [
    { topic: 'AI Music Tools', score: 0.92, source: 'seed' },
    { topic: 'Climate Protests', score: 0.85, source: 'seed' },
    { topic: 'Electric Cars', score: 0.81, source: 'seed' },
  ];

  await saveTrends(seed);
  return await getTrends(limit);
}

export default runTrendAgent;
