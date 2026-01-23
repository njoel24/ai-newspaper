import { getTrends, saveTrends } from '../data/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPrompt } from '../llm/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TRENDS_TTL_HOURS = Number(process.env.TRENDS_TTL_HOURS || '24');

function getNewestTimestampMs(trends: any[]): number | null {
  const times = trends
    .map((t) => (t?.timestamp ? new Date(t.timestamp).getTime() : NaN))
    .filter((t) => Number.isFinite(t));
  if (times.length === 0) return null;
  return Math.max(...times);
}

function extractJsonArray(text: string): any[] {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON array found in LLM output');
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function runTrendAgent(limit = 10) {
  const existing = await getTrends(limit);

  if (existing && existing.length > 0) {
    const newestMs = getNewestTimestampMs(existing);
    const maxAgeMs = TRENDS_TTL_HOURS * 60 * 60 * 1000;
    if (newestMs && Date.now() - newestMs < maxAgeMs) {
      return existing;
    }
  }

  try {
    const promptFile = path.join(__dirname, '../../prompts/trend-prompt.md');
    const llmResponse = await runPrompt(promptFile, { count: limit });
    let parsed: any[];

    try {
      parsed = JSON.parse(llmResponse);
    } catch (err) {
      parsed = extractJsonArray(llmResponse);
    }

    if (!Array.isArray(parsed)) {
      throw new Error('LLM response is not an array');
    }

    const trendsToSave = parsed.map((t, i) => ({
      topic: t?.topic || t?.title || t?.name || `Trend ${i + 1}`,
      score: Number.isFinite(Number(t?.score)) ? Number(t.score) : 0.5,
      source: t?.source || 'TrendAgent',
    }));

    await saveTrends(trendsToSave);
    return await getTrends(limit);
  } catch (err) {
    console.error('❌ Trend Agent failed:', err);
    return existing || [];
  }
}

export default runTrendAgent;
