import { runPlannerAgent } from "./plannerAgent.js";
import { runWriterAgent } from "./writerAgent.js";
import { runEvaluatorAgent } from "./evaluatorAgent.js";

export async function runOrchestratorAgent() {
  const summary = {
    planner: { success: false, topicsPlanned: 0 },
    writer: { success: false, articlesGenerated: 0 },
    evaluator: { success: false, analyticsSaved: 0 },
  };

  try {
    console.log("🚀 Orchestrator: Running Planner Agent...");
    const plannerResult = await runPlannerAgent();
    summary.planner.success = true;
    summary.planner.topicsPlanned = plannerResult?.length || 0;
  } catch (err) {
    console.error("❌ Planner Agent failed:", err);
  }

  try {
    console.log("✍️ Orchestrator: Running Writer Agent...");
    const writerResult = await runWriterAgent();
    summary.writer.success = true;
    summary.writer.articlesGenerated = writerResult?.filter(r => r.success).length || 0;
  } catch (err) {
    console.error("❌ Writer Agent failed:", err);
  }

  try {
    console.log("📊 Orchestrator: Running Evaluator Agent...");
    const evaluatorResult = await runEvaluatorAgent();
    summary.evaluator.success = true;
    summary.evaluator.analyticsSaved = evaluatorResult?.length || 0;
  } catch (err) {
    console.error("❌ Evaluator Agent failed:", err);
  }

  console.log("✅ Orchestrator run complete. Summary:", summary);
  return summary;
}
