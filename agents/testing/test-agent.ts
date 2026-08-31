import { AIProvider } from "../../lib/ai/ai-provider";
import { SandboxExecutor, ExecutionResult } from "../../lib/sandbox/sandbox-executor";
import { TestAgentOutput, TestAgentOutputSchema } from "../../lib/ai/schemas";
import { TEST_AGENT_PROMPT } from "../../prompts";

export class TestAgent {
  constructor(private ai: AIProvider, private sandbox: SandboxExecutor) {}

  public async runTests(testCommand: string = "mvn test"): Promise<{
    rawResult: ExecutionResult;
    analyzed: TestAgentOutput;
  }> {
    const rawResult = await this.sandbox.execute(testCommand);

    const prompt = `
Analyze the sandbox test execution output:

Command: ${testCommand}
Exit Code: ${rawResult.exitCode}
Stdout:
${rawResult.stdout}

Stderr:
${rawResult.stderr}
`;

    const analyzed = await this.ai.generateStructured<TestAgentOutput>(
      prompt,
      TestAgentOutputSchema,
      {
        systemPrompt: TEST_AGENT_PROMPT,
        temperature: 0.1,
      }
    );

    return { rawResult, analyzed };
  }
}
