// helpers.js
export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON block inside text (attempt)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch {}
    }
    return null;
  }
}

export function splitSentences(text) {
  // Simple sentence splitter. Good enough for English PDF text.
  return text
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}
