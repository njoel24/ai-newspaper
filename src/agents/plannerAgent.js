import { getTrends, savePlan } from '../data/db.js';
import { runPrompt } from '../llm/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPlannerAgent() {
  console.log('🧩 PlannerAgent: collecting trends...');
  const trends = await getTrends(5);

  const trendsList = trends.map((t) => `- ${t.topic} (${t.score.toFixed(2)})`).join('\n');
  console.log('Found trends:\n', trendsList);

  console.log('🧠 Asking LLM for article ideas...');
  const promptFile = path.join(__dirname, '../../llm/planner-prompt.md');

  const llmResponse = await runPrompt(promptFile, {
    trends: trendsList,
  });

  console.log('✅ Plan created:\n', llmResponse);

  await savePlan({
    topics: { trends },
    rawResponse: llmResponse,
  });

  console.log('📦 Plan saved to DB.');
}
