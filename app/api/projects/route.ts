import { NextRequest, NextResponse } from "next/server";
import { projectService } from "../../../server/services/project-service";
import { handleApiError, AppError } from "../../../lib/errors/app-error";
import { getCurrentUser } from "@/server/auth/session";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  repositoryUrl: z.string().url("Valid GitHub repository URL is required"),
  defaultBranch: z.string().optional(),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    const projects = await projectService.listProjects(user?.id);
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("VALIDATION_ERROR", 400, "Invalid project input", parsed.error.issues);
    }

    const project = await projectService.createProject({
      ...parsed.data,
      userId: user?.id,
    });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
