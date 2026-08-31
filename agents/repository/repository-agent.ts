import { AIProvider } from "../../lib/ai/ai-provider";
import { RepositoryAnalysis, RepositoryAnalysisSchema } from "../../lib/ai/schemas";
import { REPOSITORY_AGENT_PROMPT } from "../../prompts";

export class RepositoryAgent {
  constructor(private ai: AIProvider) {}

  public async analyze(repoName: string, fileTree: string[]): Promise<RepositoryAnalysis> {
    const prompt = `
Analyze the repository structure for '${repoName}'.

File Tree:
${fileTree.slice(0, 80).join("\n")}
`;

    return await this.ai.generateStructured<RepositoryAnalysis>(
      prompt,
      RepositoryAnalysisSchema,
      {
        systemPrompt: REPOSITORY_AGENT_PROMPT,
        temperature: 0.1,
      }
    );
  }
}
