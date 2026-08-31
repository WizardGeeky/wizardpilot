import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:Microsoft%401234@localhost:5432/wizardpilot";

let dbInstance: any = null;
let isPostgresHealthy = false;

export async function getDb() {
  if (!dbInstance && typeof window === "undefined") {
    try {
      const { drizzle } = await import("drizzle-orm/postgres-js");
      const postgres = (await import("postgres")).default;
      const client = postgres(connectionString, {
        max: 10,
        idle_timeout: 20,
        connect_timeout: 2,
        onnotice: () => {},
      });
      dbInstance = drizzle(client, { schema });
      isPostgresHealthy = true;
    } catch {
      isPostgresHealthy = false;
      dbInstance = null;
    }
  }
  return dbInstance;
}

export function checkDbHealth(): boolean {
  return isPostgresHealthy;
}

// In-Memory Repository Store for live data persistence
class MemoryStore {
  users = new Map<string, any>();
  projects = new Map<string, any>();
  agentRuns = new Map<string, any>();
  agentTasks = new Map<string, any[]>();
  agentEvents = new Map<string, any[]>();
  repositoryFiles = new Map<string, any[]>();
  repositoryNodes = new Map<string, any[]>();
  repositoryEdges = new Map<string, any[]>();
  fileChanges = new Map<string, any[]>();
  testRuns = new Map<string, any[]>();
  securityFindings = new Map<string, any[]>();
  engineeringReports = new Map<string, any>();
}

// Singleton global memory store
const globalForStore = globalThis as unknown as { memoryStore: MemoryStore };
export const memoryStore = globalForStore.memoryStore || new MemoryStore();
if (process.env.NODE_ENV !== "production") globalForStore.memoryStore = memoryStore;
