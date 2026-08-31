# WizardPilot — Solution Video Walkthrough Script (5 Minutes)

This script outlines the narrative structure for the 5-minute hackathon presentation and demonstration video for **WizardPilot**.

---

## ⏱️ Video Timeline Structure

### 0:00 – 0:45 | The Problem & The Baseline
- **Speaker**: "AI coding assistants today write impressive-looking code, but they suffer from what we call the *Green-Prompt Fallacy*: code that reads nicely in a chat box, but crashes under real-world concurrency, introduces security holes, or breaks existing tests."
- **Visual**: Show a simple baseline (ChatGPT / zero-shot LLM) generating a naive `if (!order.isCancelled)` check. Show it failing under concurrent webhook load with `OptimisticLockException` and issuing a duplicate refund.
- **Key Takeaway**: "Code generation without execution and verification is not software engineering."

### 0:45 – 1:45 | Introducing WizardPilot & The 8-Agent Architecture
- **Speaker**: "Enter WizardPilot — an autonomous software engineering platform with an 8-agent state machine designed around one fundamental principle: *AI-generated code is NOT considered successful until it has been tested and verified.*"
- **Visual**: Show the WizardPilot Command Center UI and the architecture diagram featuring:
  1. Requirement Analyst (formalizes FRs and NFRs)
  2. Repository Intelligence (redacts secrets, maps live files)
  3. Architecture Analyst (identifies concurrency hazards and renders interactive React Flow dependency graphs)
  4. Implementation Agent (synthesizes minimal Git diffs)
  5. Sandbox Test Agent (executes tests in an isolated Docker container)
  6. Autonomous Debug Agent (self-healing loop on stack traces)
  7. Security Auditor (scans for CWE-798, CWE-89, CWE-78, CWE-532)
  8. Verification Agent (calculates a deterministic 6-dimension confidence score)

### 1:45 – 3:30 | Live Flagship Execution & The Self-Correction Loop
- **Speaker**: "Let's dispatch a real engineering run for our flagship scenario: a duplicate refund bug under high-concurrency order cancellations."
- **Visual**: 
  - Dispatch run in UI.
  - Live SSE stream lights up the 8 agent cards.
  - Test Agent flags an initial failure on Test 57 (`OptimisticLockException`).
  - Watch the **Autonomous Debug Agent** kick in: it parses the stack trace, identifies the missing exponential backoff retry policy, generates a targeted patch, and re-executes tests in the sandbox.
  - Retest completes: **58 passed, 0 failed**.
  - Security scan completes with 0 critical findings and automatic redaction of debug token logging.
  - Confidence calculation reaches **94% (VERIFIED)**.

### 3:30 – 4:15 | Evaluation, Measured Gains & Changelog
- **Speaker**: "We evaluated WizardPilot against a simple baseline across 10 challenging engineering benchmarks."
- **Visual**: Display the comparative metrics table:
  - Solution success rate jumped from **20% to 100%**.
  - Human time per task dropped from **4.5 hours to 3.2 minutes (98.8% reduction)**.
  - Escaped security vulnerabilities reduced from **4 to 0**.
  - Token cost: **$0.04 per verified engineering task**.
- **Changelog Highlight**: "The single biggest breakthrough was Iteration 2: moving from static prompt generation to an isolated test sandbox with a stack trace self-healing loop."
- **Removed Experiment**: "We also tested a multi-turn LLM debate approach, but removed it because it introduced latency and over-engineering without improving test pass rates."

### 4:15 – 5:00 | Hot Take & Conclusion
- **Speaker**: "Our key insight from building WizardPilot: *AI agents must never be allowed to grade their own homework.* True engineering reliability comes from sandboxed compilation, deterministic test validation, and mathematical confidence scoring."
- **Visual**: Final Verified Engineering Report with interactive diffs and 1-click PR approval button.
- **Closing**: "WizardPilot: Don't just generate code. Engineer the solution."
