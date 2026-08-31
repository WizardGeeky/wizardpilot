/**
 * Robust JSON extraction and repair helper for LLM responses
 */
export function repairAndParseJson(raw: string): any {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty or non-string input provided for JSON parsing.");
  }

  let cleaned = raw.trim();

  // 1. Strip markdown fences if present
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {}

  // 2. Locate starting JSON token ({ or [)
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");
  let startIdx = -1;

  if (firstBrace !== -1 && firstBracket !== -1) {
    startIdx = Math.min(firstBrace, firstBracket);
  } else if (firstBrace !== -1) {
    startIdx = firstBrace;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
  }

  if (startIdx > 0) {
    cleaned = cleaned.slice(startIdx);
  }

  try {
    return JSON.parse(cleaned);
  } catch {}

  // 3. Balance quotes, braces and brackets
  let inString = false;
  let isEscaped = false;
  const stack: string[] = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (isEscaped) {
      isEscaped = false;
      continue;
    }
    if (char === "\\") {
      isEscaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{" || char === "[") {
        stack.push(char);
      } else if (char === "}" && stack[stack.length - 1] === "{") {
        stack.pop();
      } else if (char === "]" && stack[stack.length - 1] === "[") {
        stack.pop();
      }
    }
  }

  let repaired = cleaned;
  if (inString) {
    repaired += '"';
  }

  repaired = repaired.replace(/,\s*$/, "");

  while (stack.length > 0) {
    const open = stack.pop();
    if (open === "{") repaired += "}";
    if (open === "[") repaired += "]";
  }

  try {
    return JSON.parse(repaired);
  } catch {}

  // 4. Aggressive trailing syntax cleanup
  try {
    let aggressive = repaired.replace(/,\s*"[^"]*":\s*["']?[^"'{}[\]]*$/g, "");
    aggressive = aggressive.replace(/,\s*$/g, "");

    const openBraces = (aggressive.match(/{/g) || []).length;
    const closeBraces = (aggressive.match(/}/g) || []).length;
    const openBrackets = (aggressive.match(/\[/g) || []).length;
    const closeBrackets = (aggressive.match(/\]/g) || []).length;

    for (let i = 0; i < Math.max(0, openBrackets - closeBrackets); i++) aggressive += "]";
    for (let i = 0; i < Math.max(0, openBraces - closeBraces); i++) aggressive += "}";

    return JSON.parse(aggressive);
  } catch (err) {
    throw new Error(`Failed to repair or parse LLM JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}
