import { NextRequest, NextResponse } from "next/server";
import { architectureService } from "../../../../../server/services/architecture-service";
import { handleApiError } from "../../../../../lib/errors/app-error";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await architectureService.scanAndGenerateGraph(id, false);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await architectureService.scanAndGenerateGraph(id, true);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
