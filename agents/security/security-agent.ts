import { AIProvider } from "../../lib/ai/ai-provider";
import { FileChange, SecurityReport, SecurityReportSchema } from "../../lib/ai/schemas";
import { scanCodeForVulnerabilities } from "../../lib/security/scanner";
import { SECURITY_AGENT_PROMPT } from "../../prompts";

export class SecurityAgent {
  constructor(private ai: AIProvider) {}

  public async review(changes: FileChange[]): Promise<SecurityReport> {
    // Perform deterministic static scanning on diffs
    const staticFindings = changes.flatMap((c) =>
      scanCodeForVulnerabilities(c.path, c.diff)
    );

    const prompt = `
Perform security audit on these code modifications:

Changes:
${JSON.stringify(changes, null, 2)}

Static Scanner Pre-filter Findings:
${JSON.stringify(staticFindings, null, 2)}
`;

    return await this.ai.generateStructured<SecurityReport>(
      prompt,
      SecurityReportSchema,
      {
        systemPrompt: SECURITY_AGENT_PROMPT,
        temperature: 0.1,
      }
    );
  }
}
