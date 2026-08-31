import { memoryStore } from "../../db/client";
import { AppError } from "../../lib/errors/app-error";
import { GitHubClient } from "../../lib/github/github-client";
import { architectureService } from "./architecture-service";

export class ProjectService {
  private github = new GitHubClient();

  public async listProjects(userId?: string) {
    const all = Array.from(memoryStore.projects.values());
    if (userId) {
      return all.filter((p) => p.userId === userId || !p.userId);
    }
    return all;
  }

  public async getProjectById(id: string) {
    const project = memoryStore.projects.get(id);
    if (!project) {
      throw new AppError("NOT_FOUND", 404, `Project with ID '${id}' not found.`);
    }
    return project;
  }

  public async createProject(data: {
    name: string;
    repositoryUrl: string;
    defaultBranch?: string;
    description?: string;
    userId?: string;
  }) {
    const metadata = await this.github.getRepository(data.repositoryUrl);

    const newProject = {
      id: `proj_${Math.random().toString(36).substring(2, 10)}`,
      userId: data.userId || "anonymous",
      name: data.name || metadata.name,
      repositoryUrl: data.repositoryUrl,
      defaultBranch: data.defaultBranch || metadata.defaultBranch || "main",
      language: metadata.language || "TypeScript",
      framework: metadata.language === "Java" ? "Spring Boot" : "Next.js / Node",
      description: data.description || metadata.description,
      isPublic: !metadata.isPrivate,
      metadata: {
        stars: metadata.starsCount,
        forks: metadata.forksCount,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.projects.set(newProject.id, newProject);

    // Auto-generate initial architecture map in background
    architectureService.scanAndGenerateGraph(newProject.id).catch(() => {});

    return newProject;
  }

  public async deleteProject(id: string) {
    if (!memoryStore.projects.has(id)) {
      throw new AppError("NOT_FOUND", 404, "Project not found.");
    }
    memoryStore.projects.delete(id);
    memoryStore.repositoryNodes.delete(id);
    memoryStore.repositoryEdges.delete(id);

    // Clean up all runs associated with this project
    for (const [runId, run] of memoryStore.agentRuns.entries()) {
      if (run.projectId === id) {
        memoryStore.agentRuns.delete(runId);
        memoryStore.agentEvents.delete(runId);
        memoryStore.fileChanges.delete(runId);
        memoryStore.testRuns.delete(runId);
        memoryStore.securityFindings.delete(runId);
        memoryStore.engineeringReports.delete(runId);
      }
    }

    return { success: true };
  }
}

export const projectService = new ProjectService();
