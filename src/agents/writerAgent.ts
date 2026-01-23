import { getLatestPlan, saveArticle } from '../data/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPrompt } from '../llm/index.js';

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

  // Build a simple PromptTemplate for the writer. We keep this small and
  // explicit to avoid coupling to file-system templates in tests.
  const promptFile = path.join(__dirname, '../../prompts/writer-prompt.md');

  const results: any[] = [];

  const normalizeJson = (text: string) => {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
    cleaned = cleaned.replace(/"body"\s*:\s*`([\s\S]*?)`/g, (_match, body) => {
      return `"body": ${JSON.stringify(body)}`;
    });
    return cleaned;
  };

  const extractJson = (text: string) => {
    const normalized = normalizeJson(text);
    const start = normalized.indexOf('{');
    const end = normalized.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON object found in LLM output');
    }
    return JSON.parse(normalized.slice(start, end + 1));
  };

  for (const t of topics) {
    try {
      console.log(`🧠 Generating article for topic: ${t.topic}`);

  const llmResponse = await runPrompt(promptFile, { topic: t.topic, angle: t.angle || '' });

      let articleJson;
      try {
        articleJson = JSON.parse(normalizeJson(llmResponse));
      } catch (err) {
        try {
          articleJson = extractJson(llmResponse);
        } catch (extractErr) {
          console.error('❌ Failed to parse LLM output:', llmResponse);
          results.push({ success: false, error: `Invalid JSON for topic: ${t.topic}` });
          continue;
        }
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
