import "dotenv/config";  
import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runPrompt(promptFile, variables = {}) {
  const promptTemplate = fs.readFileSync(promptFile, "utf8");

  // Simple template replacement: {{variable}}
  let prompt = promptTemplate;
  for (const [key, value] of Object.entries(variables)) {
    prompt = prompt.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
