export interface SecurityRuleMatch {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  description: string;
  recommendation: string;
  cwe: string;
  pattern: RegExp;
}

const STATIC_SECURITY_RULES: SecurityRuleMatch[] = [
  {
    severity: "CRITICAL",
    title: "Hardcoded API Key / Secret Token",
    description: "Detected a potentially hardcoded private key, token, or AWS/Stripe secret in source code.",
    recommendation: "Move sensitive credentials to secure environment variables or vault secret manager.",
    cwe: "CWE-798",
    pattern: /(sk_live_[0-9a-zA-Z]{24}|ghp_[a-zA-Z0-9]{36}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----)/,
  },
  {
    severity: "HIGH",
    title: "Potential SQL Injection Vulnerability",
    description: "Detected dynamic string concatenation within SQL query construction.",
    recommendation: "Use parameterized queries or ORM type-safe query builders rather than string interpolation.",
    cwe: "CWE-89",
    pattern: /(SELECT\s+.*FROM\s+.*WHERE\s+.*["']\s*\+|executeQuery\s*\(|rawQuery\s*\(|prepareStatement\s*\(\s*["'].*\+)/i,
  },
  {
    severity: "HIGH",
    title: "Unsafe Command Execution / Process Spawn",
    description: "Detected shell execution with dynamic or unvalidated arguments.",
    recommendation: "Avoid invoking system shells; validate commands against a strict allowlist.",
    cwe: "CWE-78",
    pattern: /(Runtime\.getRuntime\(\)\.exec|child_process\.exec|execSync|ProcessBuilder)\s*\(/,
  },
  {
    severity: "HIGH",
    title: "Path Traversal Risk",
    description: "Direct user-supplied input may be concatenated directly into filesystem paths.",
    recommendation: "Normalize paths using `path.resolve` and verify they reside within the designated root directory.",
    cwe: "CWE-22",
    pattern: /(new File\([^,]+,\s*[^)]+\)|fs\.readFile\s*\(\s*req\.)/,
  },
  {
    severity: "MEDIUM",
    title: "Sensitive Credential or Token Logging",
    description: "Detected potential logging of authorization headers, tokens, or passwords.",
    recommendation: "Mask sensitive fields before dispatching log records to log sinks.",
    cwe: "CWE-532",
    pattern: /(log\.(info|debug|warn)\(.*(password|token|secret|authorization|bearer).*)/i,
  },
];

export interface ScannedFinding {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  filePath?: string;
  lineNumber?: number;
  title: string;
  description: string;
  recommendation: string;
  cwe: string;
}

export function scanCodeForVulnerabilities(filePath: string, content: string): ScannedFinding[] {
  const findings: ScannedFinding[] = [];
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    for (const rule of STATIC_SECURITY_RULES) {
      if (rule.pattern.test(line)) {
        findings.push({
          severity: rule.severity,
          filePath,
          lineNumber: index + 1,
          title: rule.title,
          description: rule.description,
          recommendation: rule.recommendation,
          cwe: rule.cwe,
        });
      }
    }
  });

  return findings;
}
