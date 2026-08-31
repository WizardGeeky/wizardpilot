import { NextRequest, NextResponse } from "next/server";
import { runService } from "../../../../../server/services/run-service";
import { handleApiError } from "../../../../../lib/errors/app-error";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cancelled = await runService.cancelRun(id);
    return NextResponse.json({ success: true, data: cancelled });
  } catch (error) {
    return handleApiError(error);
  }
}
