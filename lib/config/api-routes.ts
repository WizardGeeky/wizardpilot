/**
 * Centralized API Routes Configuration
 * Modify endpoints here or update NEXT_PUBLIC_APP_URL when deploying to new domains.
 */

export const API_ROUTES = {
  AUTH: {
    GITHUB: "/api/auth/github",
    CALLBACK: "/api/auth/callback/github",
    ME: "/api/auth/me",
    LOGOUT: "/api/auth/logout",
  },
  GITHUB: {
    REPOS: "/api/github/repos",
    BRANCHES: (owner: string, repo: string) =>
      `/api/github/branches?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`,
    TREE: (owner: string, repo: string, branch: string) =>
      `/api/github/tree?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`,
  },
  PROJECTS: {
    LIST: "/api/projects",
    CREATE: "/api/projects",
    GET: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    ARCHITECTURE: (id: string) => `/api/repositories/${id}/architecture`,
  },
  RUNS: {
    CREATE: "/api/runs",
    GET: (id: string) => `/api/runs/${id}`,
    EVENTS: (id: string) => `/api/runs/${id}/events`,
    CHANGES: (id: string) => `/api/runs/${id}/changes`,
    TESTS: (id: string) => `/api/runs/${id}/tests`,
    SECURITY: (id: string) => `/api/runs/${id}/security`,
    REPORT: (id: string) => `/api/runs/${id}/report`,
    CANCEL: (id: string) => `/api/runs/${id}/cancel`,
    DELETE: (id: string) => `/api/runs/${id}`,
  },
  HEALTH: "/api/health",
} as const;

export function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In browser, relative URL works automatically across any domain / port
    return "";
  }
  // On server, use environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | { code: string; message: string };
  authenticated?: boolean;
  user?: any;
}

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${getBaseUrl()}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    return json;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network communication error",
    };
  }
}
