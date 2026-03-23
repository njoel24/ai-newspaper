import { runPlannerAgent } from './plannerAgent.ts';
import { runWriterAgent } from './writerAgent.ts';
import { runEvaluatorAgent } from './evaluatorAgent.ts';
import { runTrendAgent } from './trendAgent.ts';

export async function runOrchestratorAgent() {
  const summary = {
    planner: { success: false, topicsPlanned: 0 },
    writer: { success: false, articlesGenerated: 0 },
    evaluator: { success: false, analyticsSaved: 0 },
  };

  try {
    console.log('🚀 Orchestrator: Ensuring trends are available (Trend Agent)...');
    const trends = await runTrendAgent();
    console.log(`Found ${trends.length} trends.`);

    console.log('🚀 Orchestrator: Running Planner Agent...');
    const plannerResult = await runPlannerAgent(trends);
    summary.planner.success = true;
    summary.planner.topicsPlanned = (plannerResult as any)?.length || 0;
  } catch (err) {
    console.error('❌ Planner Agent failed:', err);
  }

  try {
    console.log('✍️ Orchestrator: Running Writer Agent...');
    const writerResult = await runWriterAgent();
    summary.writer.success = true;
    summary.writer.articlesGenerated = writerResult?.filter((r: any) => r.success).length || 0;
  } catch (err) {
    console.error('❌ Writer Agent failed:', err);
  }

  try {
    console.log('📊 Orchestrator: Running Evaluator Agent...');
    const evaluatorResult = await runEvaluatorAgent();
    summary.evaluator.success = true;
    summary.evaluator.analyticsSaved = evaluatorResult?.length || 0;
  } catch (err) {
    console.error('❌ Evaluator Agent failed:', err);
  }

  console.log('✅ Orchestrator run complete. Summary:', summary);
  return summary;
}
