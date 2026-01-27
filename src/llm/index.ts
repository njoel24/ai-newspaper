import fs from 'fs';
import path from 'path';

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'ollama';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function runPrompt(promptFile: string, variables: Record<string, unknown> = {}): Promise<string> {
  const resolved = path.isAbsolute(promptFile) ? promptFile : path.join(process.cwd(), promptFile);
  try {
    const promptTemplate = fs.readFileSync(resolved, 'utf8');
    let prompt = promptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    const startedAt = Date.now();
    console.log(`[LLM] Request -> provider=${LLM_PROVIDER} promptChars=${prompt.length}`);

    if (LLM_PROVIDER === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set');
      }
      const OpenAI = (await import('openai')).default;
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: prompt }],
      });
      const durationMs = Date.now() - startedAt;
      const content = response.choices?.[0]?.message?.content || '';
      console.log(`[LLM] Response <- provider=openai chars=${content.length} (${durationMs}ms)`);
      return content;
    }

    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Ollama error (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as { response?: string };
    if (!data.response) {
      throw new Error('Ollama response missing text');
    }

    const durationMs = Date.now() - startedAt;
    console.log(`[LLM] Response <- provider=ollama chars=${data.response.length} (${durationMs}ms)`);
    return data.response;
  } catch (err: any) {
    const status = err?.status || err?.response?.status || 500;
    const message = err?.error?.message || err?.message || 'Error in LLM adapter.';
    console.error('LLM adapter error:', {
      status,
      message,
      code: err?.code,
      type: err?.type,
    });
    throw { status, message };
  }
}
