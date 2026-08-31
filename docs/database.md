# Wizard Pilot Database Architecture

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : owns
    PROJECTS ||--o{ AGENT_RUNS : contains
    AGENT_RUNS ||--o{ AGENT_TASKS : contains
    AGENT_RUNS ||--o{ AGENT_EVENTS : emits
    AGENT_RUNS ||--o{ FILE_CHANGES : produces
    AGENT_RUNS ||--o{ TEST_RUNS : executes
    AGENT_RUNS ||--o{ SECURITY_FINDINGS : detects
    AGENT_RUNS ||--|| ENGINEERING_REPORTS : produces

    PROJECTS ||--o{ REPOSITORY_FILES : contains
    PROJECTS ||--o{ REPOSITORY_NODES : contains
    PROJECTS ||--o{ REPOSITORY_EDGES : contains
```

---

## 2. Table Specifications

1. `users`: Stores user profile and AES-256-GCM encrypted GitHub tokens.
2. `projects`: Connected GitHub repositories, metadata, branch configurations.
3. `agent_runs`: Orchestrated autonomous engineering runs, state machine status, and confidence scores.
4. `agent_tasks`: Granular agent task execution metrics.
5. `agent_events`: Real-time Server-Sent Events telemetry feed.
6. `repository_nodes` & `repository_edges`: React Flow architecture dependency graph.
7. `file_changes`: Atomic Git diffs and patch records.
8. `test_runs` & `test_results`: Sandbox test suite outputs and stack traces.
9. `security_findings`: Static vulnerability detections and remediation guidance.
10. `engineering_reports`: Final verified engineering audit documents.
