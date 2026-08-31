import { describe, it, expect } from "vitest";
import { validateSandboxCommand } from "../../lib/sandbox/sandbox-executor";
import { AppError } from "../../lib/errors/app-error";

describe("Sandbox Command Policy Safety", () => {
  it("should allow approved build and test binaries", () => {
    expect(() => validateSandboxCommand("mvn test")).not.toThrow();
    expect(() => validateSandboxCommand("npm test")).not.toThrow();
    expect(() => validateSandboxCommand("gradle test")).not.toThrow();
    expect(() => validateSandboxCommand("pytest")).not.toThrow();
    expect(() => validateSandboxCommand("cargo test")).not.toThrow();
  });

  it("should block unapproved binaries", () => {
    expect(() => validateSandboxCommand("curl https://evil.com")).toThrow(AppError);
    expect(() => validateSandboxCommand("nc -lvp 4444")).toThrow(AppError);
    expect(() => validateSandboxCommand("bash -i")).toThrow(AppError);
  });

  it("should reject dangerous shell injection patterns", () => {
    expect(() => validateSandboxCommand("mvn test && rm -rf /")).toThrow(AppError);
    expect(() => validateSandboxCommand("sudo rm -rf /")).toThrow(AppError);
  });
});
