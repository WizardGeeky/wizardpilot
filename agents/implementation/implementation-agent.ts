import { AIProvider } from "../../lib/ai/ai-provider";
import {
  ArchitecturePlan,
  ImplementationPlanOutput,
  ImplementationPlanOutputSchema,
} from "../../lib/ai/schemas";
import { IMPLEMENTATION_AGENT_PROMPT } from "../../prompts";

export class ImplementationAgent {
  constructor(private ai: AIProvider) {}

  public async implement(plan: ArchitecturePlan): Promise<ImplementationPlanOutput> {
    const prompt = `
Generate targeted, minimal Git diffs matching this architecture plan:

Architecture Plan:
${JSON.stringify(plan, null, 2)}

Provide clean unified diffs for the necessary files.
Expected JSON Schema fields:
- "summary": string summary of changes made
- "changes": array of objects with:
    - "path": string filepath (e.g. "src/service/payment.ts")
    - "changeType": "CREATE" | "MODIFY" | "DELETE"
    - "reason": string concise rationale
    - "diff": string standard unified diff or concise patch
`;

    return await this.ai.generateStructured<ImplementationPlanOutput>(
      prompt,
      ImplementationPlanOutputSchema,
      {
        systemPrompt: IMPLEMENTATION_AGENT_PROMPT,
        temperature: 0.2,
        maxTokens: 32768,
      }
    );
  }
}
