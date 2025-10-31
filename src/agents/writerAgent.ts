import { getLatestPlan, saveArticle } from '../data/db.js';
import { runPrompt } from '../llm/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runWriterAgent() {
  console.log('📝 WriterAgent: fetching latest plan...');
  const latestPlan = await getLatestPlan();

  if (!latestPlan) {
    console.log('⚠️ No plan found. Exiting.');
    return;
  }

  const topics = (latestPlan as any).topics?.trends || [];

  if (!topics.length) {
    console.log('⚠️ No topics in the latest plan. Exiting.');
    return;
  }

  const promptFile = path.join(__dirname, '../../llm/writer-prompt.md');

  const results: any[] = [];

  for (const t of topics) {
    try {
      console.log(`🧠 Generating article for topic: ${t.topic}`);

      const llmResponse = await runPrompt(promptFile, {
        topic: t.topic,
        angle: t.angle || '',
      });

      let articleJson;
      try {
        articleJson = JSON.parse(llmResponse);
      } catch (err) {
        console.error('❌ Failed to parse LLM output:', llmResponse);
        results.push({ success: false, error: `Invalid JSON for topic: ${t.topic}` });
        continue;
      }

      if (!articleJson.title || !articleJson.summary || !articleJson.body) {
        results.push({ success: false, error: `Missing fields for topic: ${t.topic}` });
        continue;
      }

      await saveArticle({
        topic: t.topic,
        title: articleJson.title,
        summary: articleJson.summary,
        body: articleJson.body,
        planId: (latestPlan as any).id,
        author: 'AI Writer',
      });

      console.log(`✅ Article saved: ${articleJson.title}`);
      results.push({ success: true, topic: t.topic, title: articleJson.title });
    } catch (err: any) {
      console.error('❌ Error generating article:', err);
      results.push({ success: false, error: err.message });
    }
  }

  return results;
}
