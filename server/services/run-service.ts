import { memoryStore } from "../../db/client";
import { AppError } from "../../lib/errors/app-error";
import { AgentOrchestrator } from "../../agents/orchestrator";
import { getAIProvider } from "../../lib/ai/provider-factory";

export class RunService {
  public async listRuns(projectId?: string) {
    const runs = Array.from(memoryStore.agentRuns.values());
    if (projectId) {
      return runs.filter((r) => r.projectId === projectId);
    }
    return runs;
  }

  public async getRunById(id: string) {
    const run = memoryStore.agentRuns.get(id);
    if (!run) {
      throw new AppError("NOT_FOUND", 404, `Engineering run with ID '${id}' not found.`);
    }
    return run;
  }

  public async startRun(data: {
    projectId: string;
    branch?: string;
    requirement: string;
  }) {
    const project = memoryStore.projects.get(data.projectId);
    if (!project) {
      throw new AppError("NOT_FOUND", 404, "Project not found.");
    }

    const runId = `run_${Math.random().toString(36).substring(2, 10)}`;
    const newRun = {
      id: runId,
      projectId: data.projectId,
      branch: data.branch || project.defaultBranch || "main",
      requirement: data.requirement,
      status: "QUEUED",
      currentAgent: "requirement_analyst",
      confidenceScore: 0,
      retryCount: 0,
      startedAt: new Date(),
      completedAt: null,
      errorMessage: null,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.agentRuns.set(runId, newRun);

    // Run orchestrator asynchronously in the background
    const ai = getAIProvider();
    const orchestrator = new AgentOrchestrator(ai);
    setTimeout(() => {
      orchestrator.executePipeline(runId, data.projectId, data.requirement, newRun.branch);
    }, 100);

    return newRun;
  }

  public async cancelRun(id: string) {
    const run = memoryStore.agentRuns.get(id);
    if (!run) {
      throw new AppError("NOT_FOUND", 404, "Run not found.");
    }
    run.status = "CANCELLED";
    run.completedAt = new Date();
    memoryStore.agentRuns.set(id, run);
    return run;
  }

  public async deleteRun(id: string) {
    if (!memoryStore.agentRuns.has(id)) {
      throw new AppError("NOT_FOUND", 404, "Run not found.");
    }
    memoryStore.agentRuns.delete(id);
    memoryStore.agentEvents.delete(id);
    memoryStore.fileChanges.delete(id);
    memoryStore.testRuns.delete(id);
    memoryStore.securityFindings.delete(id);
    memoryStore.engineeringReports.delete(id);
    return { success: true };
  }

  public async getRunEvents(runId: string) {
    return memoryStore.agentEvents.get(runId) || [];
  }

  public async getRunChanges(runId: string) {
    return memoryStore.fileChanges.get(runId) || [];
  }

  public async getRunTests(runId: string) {
    return memoryStore.testRuns.get(runId) || [];
  }

  public async getRunSecurity(runId: string) {
    return memoryStore.securityFindings.get(runId) || [];
  }

  public async getRunReport(runId: string) {
    const report = memoryStore.engineeringReports.get(runId);
    if (!report) {
      throw new AppError("NOT_FOUND", 404, "Engineering report not generated yet.");
    }
    return report;
  }
}

export const runService = new RunService();
