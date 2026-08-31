import { memoryStore } from "./client";
import { logger } from "../lib/logger/logger";

export async function seedDatabase() {
  logger.info("Initializing database with clean state (no dummy records).");
  // Clean initialization - real data will be populated by authenticated GitHub users
}
