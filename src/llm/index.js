import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import localAdapter from './localAdapter.js';

// pluggable LLM layer: by default use localAdapter. If you want to
// use OpenAI (or other providers), implement another adapter and
// switch based on an environment variable.

const USE_LOCAL = process.env.USE_LOCAL_LLM !== 'false';

export async function runPrompt(promptFile, variables = {}) {
  // Normalize promptFile to an absolute path if needed
  const resolved = path.isAbsolute(promptFile)
    ? promptFile
    : path.join(process.cwd(), promptFile);

  if (USE_LOCAL) {
    return localAdapter.runPrompt(resolved, variables);
  }

  // Fallback behavior: if OPENAI_API_KEY is available, attempt to use OpenAI
  // Note: keep the import dynamic to avoid requiring the package when unused.
  if (process.env.OPENAI_API_KEY) {
    try {
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const promptTemplate = fs.readFileSync(resolved, 'utf8');
      let prompt = promptTemplate;
      for (const [key, value] of Object.entries(variables)) {
        prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error('OpenAI adapter error:', err?.message || err);
      throw { status: 500, message: 'Error in OpenAI adapter.' };
    }
  }

  // If no adapter is available, fail fast
  throw { status: 500, message: 'No LLM adapter configured. Set USE_LOCAL_LLM=true or provide OPENAI_API_KEY.' };
}
