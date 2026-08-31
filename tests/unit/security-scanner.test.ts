import { describe, it, expect } from "vitest";
import { scanCodeForVulnerabilities } from "../../lib/security/scanner";

describe("Static Security Scanner", () => {
  it("should detect hardcoded API keys and tokens", () => {
    const mockKey = ["sk", "live", "123456789012345678901234"].join("_");
    const code = `
      const stripeSecret = "${mockKey}";
    `;
    const findings = scanCodeForVulnerabilities("config.ts", code);
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0].severity).toBe("CRITICAL");
    expect(findings[0].cwe).toBe("CWE-798");
  });

  it("should detect potential SQL injection via string concatenation", () => {
    const code = `
      String sql = "SELECT * FROM users WHERE email = '" + userInput + "'";
      stmt.executeQuery(sql);
    `;
    const findings = scanCodeForVulnerabilities("UserRepo.java", code);
    expect(findings.some((f) => f.cwe === "CWE-89")).toBe(true);
  });

  it("should detect unsafe command execution", () => {
    const code = `
      Runtime.getRuntime().exec("sh -c " + cmd);
    `;
    const findings = scanCodeForVulnerabilities("Runner.java", code);
    expect(findings.some((f) => f.cwe === "CWE-78")).toBe(true);
  });

  it("should pass clean code with zero findings", () => {
    const cleanCode = `
      @Service
      public class CleanService {
          public Order getOrder(String id) {
              return orderRepository.findById(id).orElse(null);
          }
      }
    `;
    const findings = scanCodeForVulnerabilities("CleanService.java", cleanCode);
    expect(findings.length).toBe(0);
  });
});
