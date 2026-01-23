import fs from 'fs';
import path from 'path';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

export async function runPrompt(promptFile: string, variables: Record<string, unknown> = {}): Promise<string> {
  const resolved = path.isAbsolute(promptFile) ? promptFile : path.join(process.cwd(), promptFile);
  try {
    const promptTemplate = fs.readFileSync(resolved, 'utf8');
    let prompt = promptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }

    const startedAt = Date.now();
    console.log(`[LLM] Request -> model=${OLLAMA_MODEL} promptChars=${prompt.length}`);

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
    console.log(`[LLM] Response <- chars=${data.response.length} (${durationMs}ms)`);
    return data.response;
  } catch (err: any) {
    console.error('LLM adapter error:', err?.message || err);
    throw { status: 500, message: 'Error in LLM adapter.' };
  }
}
