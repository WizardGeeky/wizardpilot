# Wizard Pilot REST & SSE API Reference

## Projects
- `GET /api/projects` — List all connected projects.
- `POST /api/projects` — Connect a new GitHub repository.
- `GET /api/projects/:id` — Retrieve project metadata.
- `DELETE /api/projects/:id` — Disconnect a project.

## Authentication
- `GET /api/auth/github` — Initiates GitHub OAuth flow.
- `GET /api/auth/callback/github` — GitHub OAuth authorization callback.
- `POST /api/auth/token` — Direct GitHub Personal Access Token (PAT) authentication.
- `GET /api/auth/me` — Current authenticated user profile.
- `POST /api/auth/logout` — Clear session cookie.

## Engineering Runs
- `GET /api/runs` — List engineering runs (optional `?projectId=`).
- `POST /api/runs` — Launch an autonomous engineering run.
- `GET /api/runs/:id` — Get run state and confidence score.
- `POST /api/runs/:id/cancel` — Cancel an active run.

## Live Telemetry & Artifacts
- `GET /api/runs/:id/events` — Server-Sent Events (SSE) live telemetry stream.
- `GET /api/runs/:id/changes` — Git diffs produced by the Implementation Agent.
- `GET /api/runs/:id/tests` — Sandbox test suite runs and stdout/stderr logs.
- `GET /api/runs/:id/security` — Static security vulnerability audit findings.
- `GET /api/runs/:id/report` — Final verified engineering report.

## Architecture
- `GET /api/repositories/:id/architecture` — React Flow graph nodes and edges.

## Health
- `GET /api/health` — System status, database health, AI provider readiness.
