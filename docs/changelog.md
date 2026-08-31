# WizardPilot — Improvement Changelog & Evolution Journey

This document records the experimental journey of building and refining **WizardPilot**, progressing from a naive baseline to an 8-agent autonomous platform with deterministic verification.

---

## Evolution Progression Table

| Stage | What We Tried & Why | Evidence & Results | Decision / Learning |
|---|---|---|---|
| **Baseline** | **Zero-shot Direct Prompting**<br>Gave an LLM (Gemini / GPT-4) the user requirement and asked for code modifications directly without repository context or sandbox execution. | • **20% solution success rate** (2/10 passed)<br>• **74.1% test pass rate**<br>• Hallucinated non-existent library imports<br>• 4 security vulnerabilities introduced<br>• Zero verification | **Established starting baseline.**<br>Revealed that raw code generation without architectural awareness or sandbox execution cannot solve real-world engineering tasks. |
| **Iteration 1** | **Added Context & Repository Architecture**<br>Introduced Requirement Analyst and Repository Intelligence agents to deconstruct requirements and map live file trees and module graphs. | • Solution success rate increased to **50%** (5/10 passed)<br>• Test pass rate rose to **82.3%**<br>• Eliminated hallucinated imports<br>• **Failure**: Concurrent race conditions and runtime edge cases still broke tests because code wasn't executed in runtime. | **Kept & Extended.**<br>Confirmed that architecture mapping is necessary but insufficient without dynamic test execution. |
| **Iteration 2** | **Added Isolated Sandbox Execution & Self-Correction Debug Loop**<br>Created an isolated Docker/local test sandbox and introduced an Autonomous Debug Agent that intercepts stack traces and generates targeted patches (up to 3 retries). | • Solution success rate jumped to **90%** (9/10 passed)<br>• Test pass rate reached **97.2%**<br>• Auto-repaired the challenging Payment Race Condition (CASE-01) on Retry 1 when `OptimisticLockException` was thrown in the sandbox. | **Kept.**<br>Runtime feedback and iterative debug loops are the single most impactful architectural breakthrough for reliability. |
| **Iteration 3** | **Added Static & Semantic Security Auditor**<br>Integrated regex and AST pattern scanning for hardcoded credentials (CWE-798), SQL injection (CWE-89), command injection (CWE-78), and token logging (CWE-532). | • Security vulnerabilities caught before delivery: **100% (4/4 caught)**<br>• Zero escaped vulnerabilities in final generated code diffs. | **Kept.**<br>Automated security scanning prevents agents from inadvertently compromising secrets or introducing injection vectors. |
| **Iteration 4** | **Replaced LLM Self-Scoring with Deterministic Verification Formula**<br>Removed subjective LLM self-evaluation ("I am 99% confident") and implemented a deterministic 6-dimension mathematical confidence formula + interactive React Flow execution graph. | • **100% solution success rate** (10/10 passed)<br>• **100% test pass rate** across 263 unit/integration tests<br>• Mean Confidence: **95.6%**<br>• Zero hallucinated confidence claims | **Final Combined Solution.**<br>LLMs should never grade their own homework. Mathematical verification based on hard test results and static scans delivers true enterprise trust. |

---

## Experiments Removed & Lessons Learned

### Experiment: Recursive LLM-to-LLM Debate
- **What We Tried**: Implemented a 3-turn debate where an "Architect Agent" and a "Challenger Agent" argued back and forth over the best design before writing code.
- **Why We Removed It**: Resulted in context bloat, increased latency by 3.5x ($0.15/run), and often caused the agents to over-engineer trivial solutions into complex multi-layer abstractions.
- **Lesson Learned**: Explicit role separation with structured Zod schemas and isolated task boundaries is vastly superior to conversational debates.

---

## The Main Failure Mode & Our Hot Take

### The Main Failure Mode We Observed
> **"The Green-Prompt Fallacy"**: When an LLM produces syntactic code that *looks* flawless to a human reviewer, but fails under concurrent runtime conditions (e.g., race conditions, thread pool starvation, stale cache reads, or optimistic lock collisions).

### Our Hot Take
> **"AI coding agents must NEVER be allowed to grade their own homework."**
> 
> Asking an LLM *"Are you sure this code is correct?"* will produce confident, well-reasoned affirmations even when the code crashes immediately in production. True agent reliability requires **ruthless external validation**: isolated sandboxed execution, real compiler/test-runner stdout parsing, automated CWE scanning, and deterministic mathematical scoring. If it hasn't passed in a sandbox, it isn't software engineering — it's just autocomplete.
