// llm.js
import OpenAI from "openai";
import { safeJsonParse } from "./helpers.js";

function getOpenAIClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function askModelForRuleEval(modelName, rule, pages, localEvidence) {
  const openai = getOpenAIClient();
  if (!openai) {
    // No API key configured — gracefully skip model call
    return null;
  }
  // Build prompt that asks for JSON-only output
  const pagesText = pages.map(p => `[Page ${p.page}]\n${p.text}`).join("\n\n");
  const prompt = `
You are a strict document-checker assistant. 
Input:
1) Rule: "${rule}"
2) Document pages below (page number + text).

Guidelines:
- Output JSON ONLY (no explanation) with keys: rule, status, evidence, reasoning, confidence.
- "status" must be either "pass" or "fail".
- "evidence" must be a single short sentence or note and include the page number (e.g. "page 2: '...'" or "page 2: No evidence found").
- "reasoning" must be 1-2 sentences max.
- "confidence" must be an integer 0-100.

LocalEvidence: ${localEvidence ? JSON.stringify(localEvidence) : "None"}

Document pages:
${pagesText}

Return the JSON only.
`;

  const response = await openai.chat.completions.create({
    model: modelName || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0.0
  });

  const text = response.choices?.[0]?.message?.content ?? "";
  const parsed = safeJsonParse(text);
  if (parsed) return parsed;

  // If the model didn't return parseable JSON, try to extract JSON or fallback:
  // Build deterministic fallback
  return null;
}
