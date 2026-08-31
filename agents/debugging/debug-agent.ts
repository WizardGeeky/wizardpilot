import { AIProvider } from "../../lib/ai/ai-provider";
import {
  TestAgentOutput,
  FileChange,
  ArchitecturePlan,
  DebugAnalysis,
  DebugAnalysisSchema,
} from "../../lib/ai/schemas";
import { DEBUG_AGENT_PROMPT } from "../../prompts";

export class DebugAgent {
  constructor(private ai: AIProvider) {}

  public async debug(
    testOutput: TestAgentOutput,
    currentChanges: FileChange[],
    archPlan: ArchitecturePlan,
    attemptNumber: number
  ): Promise<DebugAnalysis> {
    const prompt = `
A test suite failed after applying changes (Attempt #${attemptNumber}/3).

Test Failure Output:
${testOutput.stdout}
${testOutput.stderr}

Applied Changes:
${JSON.stringify(currentChanges, null, 2)}

Architecture Plan:
${JSON.stringify(archPlan, null, 2)}

Determine root cause and provide a targeted minimal fix patch.
`;

    return await this.ai.generateStructured<DebugAnalysis>(
      prompt,
      DebugAnalysisSchema,
      {
        systemPrompt: DEBUG_AGENT_PROMPT,
        temperature: 0.1,
      }
    );
  }
}
