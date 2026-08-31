import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { AIProvider, AICompletionOptions } from "./ai-provider";
import { AppError } from "../errors/app-error";
import { logger } from "../logger/logger";
import { repairAndParseJson } from "./json-repair";

// Officially supported production & fast reasoning Gemini models
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.5-pro",
  "gemini-1.5-pro",
  "gemini-flash-latest",
];

function normalizeModelName(name: string): string {
  const trimmed = name?.trim() || "";
  if (trimmed === "gemini-3.6-flash" || trimmed === "gemini-3.5-flash" || trimmed === "gemini-3.7-flash") {
    return "gemini-2.5-flash";
  }
  if (trimmed === "gemini-flash-2.5" || trimmed === "gemini-2.5-flash") {
    return "gemini-2.5-flash";
  }
  if (trimmed === "gemini-1.5-flash" || trimmed === "gemini-1.5-pro") {
    return "gemini-1.5-flash";
  }
  return trimmed || "gemini-2.5-flash";
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function normalizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys);
  }
  if (obj !== null && typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = toCamelCase(key);
      result[camelKey] = normalizeKeys(value);
    }
    return result;
  }
  return obj;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GeminiProvider implements AIProvider {
  public name = "GeminiProvider";
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey?: string, modelName?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new AppError("AI_PROVIDER_ERROR", 500, "GEMINI_API_KEY environment variable is not configured.");
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.modelName = normalizeModelName(modelName || process.env.GEMINI_MODEL || "gemini-2.5-flash");
  }

  private isRetryableError(errMsg: string): boolean {
    const lower = errMsg.toLowerCase();
    return (
      lower.includes("503") ||
      lower.includes("service unavailable") ||
      lower.includes("high demand") ||
      lower.includes("overloaded") ||
      lower.includes("resource_exhausted") ||
      lower.includes("429") ||
      lower.includes("rate limit") ||
      lower.includes("quota") ||
      lower.includes("temporarily unavailable") ||
      lower.includes("fetch failed") ||
      lower.includes("econnreset") ||
      lower.includes("etimedout") ||
      lower.includes("404") ||
      lower.includes("not found") ||
      lower.includes("not supported")
    );
  }

  private async executeWithModelFallback<R>(
    fn: (modelName: string) => Promise<R>
  ): Promise<R> {
    const candidateModels = [
      this.modelName,
      ...FALLBACK_MODELS.filter((m) => m !== this.modelName),
    ];

    let lastError: unknown;

    for (const modelToTry of candidateModels) {
      // Try up to 2 retries per model with exponential backoff for 503/429 spikes
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          return await fn(modelToTry);
        } catch (err) {
          lastError = err;
          const msg = err instanceof Error ? err.message : String(err);
          const isRetryable = this.isRetryableError(msg);

          if (isRetryable && attempt < 2) {
            const backoffMs = attempt * 800 + Math.random() * 400;
            logger.warn(`Gemini '${modelToTry}' encounter '${msg.slice(0, 120)}'. Retrying in ${Math.round(backoffMs)}ms (attempt ${attempt}/2)...`);
            await sleep(backoffMs);
            continue;
          }

          if (isRetryable) {
            logger.warn(`Gemini model '${modelToTry}' unavailable after retries (${msg.slice(0, 100)}). Falling back to next available model in chain...`);
            break; // Move to next model in candidateModels
          }

          // Non-retryable syntax or logic error
          throw err;
        }
      }
    }

    throw lastError;
  }

  public async generateText(prompt: string, options: AICompletionOptions = {}): Promise<string> {
    try {
      return await this.executeWithModelFallback(async (activeModel) => {
        const model = this.genAI.getGenerativeModel({
          model: activeModel,
          systemInstruction: options.systemPrompt,
        });

        const response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: options.temperature ?? 0.2,
            maxOutputTokens: options.maxTokens ?? 32768,
          },
        });

        return response.response.text();
      });
    } catch (err) {
      logger.error("Gemini text generation failed across all models", { error: String(err) });
      throw new AppError("AI_PROVIDER_ERROR", 502, `Gemini API error: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  public async generateStructured<T>(
    prompt: string,
    schema: z.ZodType<T>,
    options: AICompletionOptions = {}
  ): Promise<T> {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return valid JSON adhering to the schema.`;

    try {
      return await this.executeWithModelFallback(async (activeModel) => {
        const model = this.genAI.getGenerativeModel({
          model: activeModel,
          systemInstruction: options.systemPrompt,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: options.temperature ?? 0.1,
            maxOutputTokens: options.maxTokens ?? 32768,
          },
        });

        const response = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: jsonPrompt }] }],
        });

        const rawText = response.response.text().trim();
        let parsed: unknown;

        try {
          parsed = repairAndParseJson(rawText);
        } catch {
          logger.error("Failed to parse Gemini JSON output", { rawText: rawText.slice(0, 500) });
          throw new AppError("AI_PROVIDER_ERROR", 502, "Gemini returned non-parseable JSON.");
        }

        const normalized = normalizeKeys(parsed);
        const validated = schema.safeParse(normalized);

        if (!validated.success) {
          logger.error("Gemini response failed schema validation", { errors: validated.error.issues, raw: normalized });
          throw new AppError("AI_PROVIDER_ERROR", 502, "Gemini structured output failed Zod schema validation.");
        }

        return validated.data;
      });
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError("AI_PROVIDER_ERROR", 502, `Gemini execution failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
