import { getTrends, saveTrends } from '../data/db.js';

// Simple trend seeder/fetcher
export async function runTrendAgent(limit = 10) {
  // If there are already trends, return them
  const existing = await getTrends(limit);
  if (existing && existing.length > 0) return existing;

  // Seed some default trends when DB is empty
  const seed = [
    { topic: 'AI Music Tools', score: 0.92, source: 'seed' },
    { topic: 'Climate Protests', score: 0.85, source: 'seed' },
    { topic: 'Electric Cars', score: 0.81, source: 'seed' },
  ];

  await saveTrends(seed);
  return await getTrends(limit);
}

export default runTrendAgent;
