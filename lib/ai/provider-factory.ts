import { AIProvider } from "./ai-provider";
import { GeminiProvider } from "./gemini-provider";
import { logger } from "../logger/logger";

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    logger.warn("GEMINI_API_KEY is not configured in .env.local. Realtime AI execution requires a valid Gemini key.");
  }

  logger.info("Initializing Live Gemini AI Provider for autonomous pipeline execution.");
  return new GeminiProvider(apiKey || "");
}
