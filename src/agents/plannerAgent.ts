import { getTrends, savePlan } from '../data/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPrompt } from '../llm/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runPlannerAgent(trends?: any[]) {
  console.log('🧩 PlannerAgent: collecting trends...');
  
  const trendsList = trends.map((t: any) => `- ${t.topic} (${t.score.toFixed(2)})`).join('\n');
  console.log('Found trends:\n', trendsList);

  console.log('🧠 Asking LLM (via LLMChain) for article ideas...');
  const promptFile = path.join(__dirname, '../../prompts/planner-prompt.md');

  // Use central runPrompt (this is mocked in tests) to execute the prompt
  // template. We keep the PromptTemplate around for possible future
  // LangChain usage, but call runPrompt so tests can spy on it.
  const llmResponse = await runPrompt(promptFile, { trends: trendsList, analyticsSummary: '' });

  console.log('✅ Plan created:\n', llmResponse);

  await savePlan({
    topics: { trends },
    rawResponse: llmResponse,
  });

  console.log('📦 Plan saved to DB.');
}
