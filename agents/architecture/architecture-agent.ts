import { AIProvider } from "../../lib/ai/ai-provider";
import {
  RequirementAnalysis,
  RepositoryAnalysis,
  ArchitecturePlan,
  ArchitecturePlanSchema,
} from "../../lib/ai/schemas";
import { ARCHITECTURE_AGENT_PROMPT } from "../../prompts";

export class ArchitectureAgent {
  constructor(private ai: AIProvider) {}

  public async plan(
    req: RequirementAnalysis,
    repo: RepositoryAnalysis
  ): Promise<ArchitecturePlan> {
    const prompt = `
Create an architecture plan based on:

Requirement Analysis:
${JSON.stringify(req, null, 2)}

Repository Analysis:
${JSON.stringify(repo, null, 2)}
`;

    return await this.ai.generateStructured<ArchitecturePlan>(
      prompt,
      ArchitecturePlanSchema,
      {
        systemPrompt: ARCHITECTURE_AGENT_PROMPT,
        temperature: 0.1,
      }
    );
  }
}
