# Wizard Pilot System Architecture Documentation

## 1. System Overview

Wizard Pilot is built as a modular monolith Next.js application combining real-time Server-Sent Events (SSE), an 8-agent state machine orchestrator, an isolated sandbox execution runtime, and a PostgreSQL database managed via Drizzle ORM.

```mermaid
flowchart LR
    subgraph Browser ["Obsidian Forge UI"]
        Dashboard[Dashboard & KPI Metrics]
        Graph[React Flow Dependency Canvas]
        Diff[Monaco/Prism Diff Viewer]
        Stream[Live SSE Telemetry]
    end

    subgraph Server ["Next.js Fullstack Server"]
        Router[App Router & Handlers]
        Services[Application Services]
        Orchestrator[Agent Orchestrator State Machine]
    end

    subgraph Agents ["8-Agent Autonomous Pipeline"]
        A1[1. Requirement Analyst]
        A2[2. Repository Intelligence]
        A3[3. Architecture Analyst]
        A4[4. Implementation Agent]
        A5[5. Sandbox Test Agent]
        A6[6. Debug Agent]
        A7[7. Security Auditor]
        A8[8. Verification Agent]
    end

    subgraph Infrastructure ["Execution & Persistence Layer"]
        Sandbox[Docker Isolated Sandbox]
        DB[(PostgreSQL + Drizzle)]
        Gemini[Google Gemini API]
    end

    Browser <--> Router
    Router --> Services
    Services --> Orchestrator
    Orchestrator --> Agents
    A4 & A5 & A6 --> Sandbox
    Orchestrator --> DB
    Agents --> Gemini
```

---

## 2. Orchestrator State Machine

The agent orchestrator transitions through a deterministic state machine:

```mermaid
stateDiagram-v2
    [*] --> QUEUED
    QUEUED --> ANALYZING_REQUIREMENT
    ANALYZING_REQUIREMENT --> ANALYZING_REPOSITORY
    ANALYZING_REPOSITORY --> ANALYZING_ARCHITECTURE
    ANALYZING_ARCHITECTURE --> IMPLEMENTING
    IMPLEMENTING --> TESTING
    TESTING --> DEBUGGING : Test Failure Detected
    DEBUGGING --> TESTING : Apply Targeted Fix Patch (Max 3 Attempts)
    TESTING --> SECURITY_REVIEW : All Tests Pass
    SECURITY_REVIEW --> VERIFYING
    VERIFYING --> COMPLETED
    
    ANALYZING_REQUIREMENT --> FAILED : Error
    ANALYZING_REPOSITORY --> FAILED : Error
    IMPLEMENTING --> FAILED : Patch Error
    DEBUGGING --> FAILED : Exceeded Max Attempts (3)
```

---

## 3. Sandboxed Execution Isolation

Untrusted repository code is strictly isolated inside ephemeral Docker containers:
- **Non-root user**: Container executes under UID 1001 (`sandboxuser`).
- **Resource Constraints**: Strict memory (1GB) and CPU (2 cores) limits.
- **Network Policy**: Isolated bridge network without access to the host Docker daemon socket.
- **Command Allowlist**: Strict binary allowlist (`npm`, `pnpm`, `yarn`, `mvn`, `gradle`, `node`, `java`, `pytest`, `cargo`).
- **Dangerous Pattern Rejection**: Immediate blocking of shell injection patterns (`rm -rf /`, `curl | sh`, `sudo`, `docker`).
