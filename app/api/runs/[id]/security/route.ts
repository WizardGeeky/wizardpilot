import { NextRequest, NextResponse } from "next/server";
import { runService } from "../../../../../server/services/run-service";
import { handleApiError } from "../../../../../lib/errors/app-error";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const findings = await runService.getRunSecurity(id);
    return NextResponse.json({ success: true, data: findings });
  } catch (error) {
    return handleApiError(error);
  }
}
