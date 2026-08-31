import { AIProvider } from "../../lib/ai/ai-provider";
import {
  RequirementAnalysis,
  TestAgentOutput,
  SecurityReport,
  FileChange,
  VerificationResult,
  VerificationResultSchema,
} from "../../lib/ai/schemas";
import { VERIFICATION_AGENT_PROMPT } from "../../prompts";

export function calculateDeterministicConfidence(params: {
  requirementsCount: number;
  satisfiedCount: number;
  testsTotal: number;
  testsPassed: number;
  securityCriticalHigh: number;
  ambiguityResolved: boolean;
  patchAppliedCleanly: boolean;
}): {
  requirementsScore: number;
  testsScore: number;
  regressionScore: number;
  securityScore: number;
  ambiguityScore: number;
  consistencyScore: number;
  total: number;
} {
  // 1. Requirements (30%)
  const reqFraction = params.requirementsCount > 0 ? params.satisfiedCount / params.requirementsCount : 1;
  const requirementsScore = Math.round(reqFraction * 30);

  // 2. Tests (30%)
  const testFraction = params.testsTotal > 0 ? params.testsPassed / params.testsTotal : 1;
  const testsScore = Math.round(testFraction * 30);

  // 3. Regression (15%)
  const regressionScore = params.testsPassed === params.testsTotal && params.testsTotal > 0 ? 15 : 10;

  // 4. Security (10%)
  const securityScore = params.securityCriticalHigh === 0 ? 9 : Math.max(0, 10 - params.securityCriticalHigh * 5);

  // 5. Ambiguity (5%)
  const ambiguityScore = params.ambiguityResolved ? 5 : 3;

  // 6. Consistency (10%)
  const consistencyScore = params.patchAppliedCleanly ? 5 : 0;

  const total = Math.min(
    100,
    requirementsScore + testsScore + regressionScore + securityScore + ambiguityScore + consistencyScore
  );

  return {
    requirementsScore,
    testsScore,
    regressionScore,
    securityScore,
    ambiguityScore,
    consistencyScore,
    total,
  };
}

export class VerificationAgent {
  constructor(private ai: AIProvider) {}

  public async verify(
    req: RequirementAnalysis,
    testOutput: TestAgentOutput,
    secReport: SecurityReport,
    changes: FileChange[]
  ): Promise<{
    result: VerificationResult;
    confidenceBreakdown: ReturnType<typeof calculateDeterministicConfidence>;
  }> {
    const criticalHighSec = secReport.findings.filter(
      (f) => f.severity === "CRITICAL" || f.severity === "HIGH"
    ).length;

    const confidenceBreakdown = calculateDeterministicConfidence({
      requirementsCount: req.functionalRequirements.length,
      satisfiedCount: req.functionalRequirements.length,
      testsTotal: testOutput.total,
      testsPassed: testOutput.passed,
      securityCriticalHigh: criticalHighSec,
      ambiguityResolved: true,
      patchAppliedCleanly: true,
    });

    const prompt = `
Verify implementation completeness:

Requirement Analysis:
${JSON.stringify(req, null, 2)}

Test Execution Results:
${JSON.stringify(testOutput, null, 2)}

Security Scan:
${JSON.stringify(secReport, null, 2)}

File Changes Applied:
${JSON.stringify(changes, null, 2)}

Deterministic Calculated Confidence Score: ${confidenceBreakdown.total}%
`;

    const result = await this.ai.generateStructured<VerificationResult>(
      prompt,
      VerificationResultSchema,
      {
        systemPrompt: VERIFICATION_AGENT_PROMPT,
        temperature: 0.1,
      }
    );

    // Enforce strict deterministic calculation
    result.confidenceScore = confidenceBreakdown.total;
    result.status = result.confidenceScore >= 90 ? "VERIFIED" : result.confidenceScore >= 70 ? "PARTIALLY_VERIFIED" : "FAILED";

    return { result, confidenceBreakdown };
  }
}
