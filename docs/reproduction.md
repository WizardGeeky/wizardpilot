# WizardPilot — Clean-Environment Reproduction Guide

This guide allows any reviewer or engineer starting from a completely clean environment to set up, run, and reproduce the benchmark results, baseline comparisons, and full multi-agent pipeline of **WizardPilot**.

---

## 1. Prerequisites & Environment

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Package Manager**: `npm` (`v10+`)
- **Docker** (Optional for container sandbox; built-in local sandbox fallback runs automatically out of the box)
- **PostgreSQL 16** (Optional: Aiven Cloud PostgreSQL configured, or auto in-memory fallback enabled)

---

## 2. Step-by-Step Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/WizardGeeky/wizardpilot.git
cd wizardpilot
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

*(Note: If you have a Google Gemini API key or GitHub token, populate them in `.env.local`. WizardPilot also includes a built-in intelligent autonomous simulation fallback if no API key is provided, allowing full local reproducibility without external API dependencies.)*

---

## 3. Reproduction Commands

### Command A: Run All Verification & Benchmark Tests
To run the automated test suite, including the 10 evaluation benchmark cases, security scanner, sandbox validation, and deterministic confidence calculation:
```bash
npm run test
```
*Expected Output:*
```text
✓ tests/unit/evaluation-benchmark.test.ts (3 tests)
✓ tests/unit/security-scanner.test.ts (4 tests)
✓ tests/unit/sandbox.test.ts (3 tests)
✓ tests/unit/confidence.test.ts (3 tests)

Test Files  4 passed (4)
     Tests  13 passed (13)
```

### Command B: Run TypeScript Strict Typecheck
```bash
npm run typecheck
```
*Expected Output: Clean exit code 0.*

### Command C: Launch the WizardPilot Web Application & Command Center
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Reproducing the Flagship Engineering Run via UI

1. Navigate to [http://localhost:3000/projects/proj_payment_01/runs/new](http://localhost:3000/projects/proj_payment_01/runs/new).
2. Select the **Payment Service** project and branch `main`.
3. Input the requirement:
   > *"Fix duplicate refund bug on order cancellation when multiple concurrent webhooks arrive simultaneously."*
4. Click **"Dispatch Engineering Run"**.
5. Observe the live Server-Sent Events (SSE) telemetry as all 8 agents execute:
   - **Requirement Analyst**: Extracts 3 FRs and 2 NFRs.
   - **Repository Intelligence**: Redacts secrets and maps 247 files across 14 modules.
   - **Architecture Analyst**: Renders interactive React Flow graph and highlights race condition hazards.
   - **Implementation Agent**: Generates minimal Git diffs.
   - **Sandbox Test Agent**: Runs test suite, flags initial `OptimisticLockException` failure.
   - **Debug Agent**: Catches stack trace and applies targeted exponential retry patch.
   - **Security Auditor**: Scans for CWE-798, CWE-89, CWE-78, CWE-532.
   - **Verification Agent**: Computes **94% Deterministic Confidence Score**.
6. Review the resulting **Verified Engineering Report**, inspect the visual Git diffs, and approve the PR.

---

## 5. Runtime & Cost Profile

| Mode | Runtime per Run | Token Usage | Approximate API Cost |
|---|---|---|---|
| **Live Gemini 2.5/3.0 Mode** | 30–45 seconds | ~14,000 tokens | **$0.038 – $0.045 USD** |
| **Offline Simulation Mode** | 12–18 seconds | 0 tokens | **$0.000 USD** |
| **Vitest Benchmark Suite** | < 1 second | 0 tokens | **$0.000 USD** |
