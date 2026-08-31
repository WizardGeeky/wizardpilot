type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  requestId?: string;
  userId?: string;
  runId?: string;
  projectId?: string;
  agent?: string;
  event?: string;
  durationMs?: number;
  [key: string]: unknown;
}

const SENSITIVE_PATTERNS = [
  /bearer\s+[a-zA-Z0-9_\-\.]+/gi,
  /ghp_[a-zA-Z0-9]{36}/gi,
  /gho_[a-zA-Z0-9]{36}/gi,
  /github_pat_[a-zA-Z0-9_]{82}/gi,
  /AIza[0-9A-Za-z\-_]{35}/gi,
  /password\s*[:=]\s*["'][^"']+["']/gi,
  /secret\s*[:=]\s*["'][^"']+["']/gi,
  /api[_-]?key\s*[:=]\s*["'][^"']+["']/gi,
];

export function redactSecrets(content: string): string {
  let redacted = content;
  for (const pattern of SENSITIVE_PATTERNS) {
    redacted = redacted.replace(pattern, "[REDACTED_SECRET]");
  }
  return redacted;
}

export class StructuredLogger {
  private baseContext: LogContext = {};

  constructor(context: LogContext = {}) {
    this.baseContext = context;
  }

  public child(context: LogContext): StructuredLogger {
    return new StructuredLogger({ ...this.baseContext, ...context });
  }

  private log(level: LogLevel, message: string, meta: LogContext = {}) {
    const timestamp = new Date().toISOString();
    const payload = {
      timestamp,
      level,
      message: redactSecrets(message),
      ...this.baseContext,
      ...meta,
    };

    const output = JSON.stringify(payload);
    if (level === "error") {
      process.stderr.write(output + "\n");
    } else {
      process.stdout.write(output + "\n");
    }
  }

  public debug(message: string, meta?: LogContext) {
    this.log("debug", message, meta);
  }

  public info(message: string, meta?: LogContext) {
    this.log("info", message, meta);
  }

  public warn(message: string, meta?: LogContext) {
    this.log("warn", message, meta);
  }

  public error(message: string, meta?: LogContext) {
    this.log("error", message, meta);
  }
}

export const logger = new StructuredLogger({ service: "forgepilot-engine" });
