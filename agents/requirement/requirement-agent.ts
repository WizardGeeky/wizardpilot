import { AIProvider } from "../../lib/ai/ai-provider";
import { RequirementAnalysis, RequirementAnalysisSchema } from "../../lib/ai/schemas";
import { REQUIREMENT_AGENT_PROMPT } from "../../prompts";

export class RequirementAgent {
  constructor(private ai: AIProvider) {}

  public async analyze(requirement: string): Promise<RequirementAnalysis> {
    const prompt = `
Analyze the following engineering requirement in detail:

Engineering Requirement:
${requirement}

Expected JSON Schema fields:
- "summary": string summary of the task
- "functionalRequirements": array of string functional requirements
- "nonFunctionalRequirements": array of string non-functional requirements (e.g. security, performance, idempotency)
- "acceptanceCriteria": array of measurable testable criteria
- "ambiguities": array of identified ambiguities
- "assumptions": array of explicit technical assumptions
- "edgeCases": array of potential concurrency or boundary edge cases
`;

    return await this.ai.generateStructured<RequirementAnalysis>(
      prompt,
      RequirementAnalysisSchema,
      {
        systemPrompt: REQUIREMENT_AGENT_PROMPT,
        temperature: 0.1,
      }
    );
  }
}
