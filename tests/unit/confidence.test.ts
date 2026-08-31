import { describe, it, expect } from "vitest";
import { calculateDeterministicConfidence } from "../../agents/verification/verification-agent";

describe("Deterministic Confidence Score Calculation", () => {
  it("should calculate 100% when all requirements, tests, security, and consistency pass perfectly", () => {
    const score = calculateDeterministicConfidence({
      requirementsCount: 3,
      satisfiedCount: 3,
      testsTotal: 58,
      testsPassed: 58,
      securityCriticalHigh: 0,
      ambiguityResolved: true,
      patchAppliedCleanly: true,
    });

    expect(score.requirementsScore).toBe(30);
    expect(score.testsScore).toBe(30);
    expect(score.regressionScore).toBe(15);
    expect(score.securityScore).toBe(9);
    expect(score.ambiguityScore).toBe(5);
    expect(score.consistencyScore).toBe(5);
    expect(score.total).toBe(94);
  });

  it("should penalize confidence when test cases fail", () => {
    const score = calculateDeterministicConfidence({
      requirementsCount: 3,
      satisfiedCount: 2,
      testsTotal: 50,
      testsPassed: 25,
      securityCriticalHigh: 0,
      ambiguityResolved: false,
      patchAppliedCleanly: true,
    });

    expect(score.requirementsScore).toBe(20);
    expect(score.testsScore).toBe(15);
    expect(score.total).toBeLessThan(80);
  });

  it("should heavily penalize critical security vulnerabilities", () => {
    const score = calculateDeterministicConfidence({
      requirementsCount: 3,
      satisfiedCount: 3,
      testsTotal: 58,
      testsPassed: 58,
      securityCriticalHigh: 2,
      ambiguityResolved: true,
      patchAppliedCleanly: true,
    });

    expect(score.securityScore).toBe(0);
    expect(score.total).toBeLessThan(90);
  });
});
