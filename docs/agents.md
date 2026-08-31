# Wizard Pilot Autonomous Agents Specification

## Agent 1 — Requirement Analyst
- **Goal**: Understand requirement, extract functional and non-functional requirements, identify assumptions, ambiguities, acceptance criteria, and edge cases.
- **Constraints**: Never modifies code. Treats user prompt as untrusted input.
- **Output Schema**: `RequirementAnalysis`

## Agent 2 — Repository Intelligence
- **Goal**: Analyze project languages, frameworks, package managers, entry points, and module structure.
- **Security**: Never exposes secrets (`.env`, private keys, certificates).
- **Output Schema**: `RepositoryAnalysis`

## Agent 3 — Architecture Analyst
- **Goal**: Formulate architecture plans, map affected files, detect race condition risks, and build dependency graphs.
- **Graph Model**: Nodes (`controller`, `service`, `repository`, `database`, `external_api`, `test`, `utility`, `module`) & Edges (`IMPORTS`, `CALLS`, `DEPENDS_ON`, `READS`, `WRITES`, `TESTS`).
- **Output Schema**: `ArchitecturePlan`

## Agent 4 — Implementation Agent
- **Goal**: Propose safe, backward-compatible Git diffs following the architecture plan.
- **Rules**: Never modify unrelated files; preserve backward compatibility; do not disable validation or tests.
- **Output Schema**: `FileChange[]`

## Agent 5 — Test Agent
- **Goal**: Execute test suites in isolated sandbox and parse outputs.
- **Output Schema**: `TestAgentOutput`

## Agent 6 — Debug Agent
- **Goal**: Autonomous root-cause analysis when tests fail.
- **Mechanism**: Inspects stack traces and source diffs, proposing a targeted fix patch.
- **Retry Policy**: Maximum 3 automatic attempts.
- **Output Schema**: `DebugAnalysis`

## Agent 7 — Security Auditor
- **Goal**: Static pattern and semantic vulnerability scanning (CWE-798, CWE-89, CWE-78, CWE-532).
- **Output Schema**: `SecurityReport`

## Agent 8 — Verification Agent
- **Goal**: Final engineering authority calculating deterministic confidence scores.
- **Weighting**: Requirements 30%, Tests 30%, Regression 15%, Security 10%, Ambiguity 5%, Consistency 10%.
- **Output Schema**: `VerificationResult`
