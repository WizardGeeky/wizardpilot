import { NextRequest, NextResponse } from "next/server";
import { runService } from "../../../server/services/run-service";
import { handleApiError, AppError } from "../../../lib/errors/app-error";
import { z } from "zod";

const StartRunSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  branch: z.string().optional(),
  requirement: z.string().min(5, "Requirement must be at least 5 characters"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const runs = await runService.listRuns(projectId);
    return NextResponse.json({ success: true, data: runs });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = StartRunSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("VALIDATION_ERROR", 400, "Invalid run parameters", parsed.error.issues);
    }

    const run = await runService.startRun(parsed.data);
    return NextResponse.json({ success: true, data: run }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
