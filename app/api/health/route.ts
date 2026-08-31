import { NextResponse } from "next/server";
import { checkDbHealth } from "../../../db/client";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Wizard Pilot Autonomous AI Engineering Platform",
    database: checkDbHealth() ? "connected" : "in-memory-isolated-store",
    ai: process.env.GEMINI_API_KEY ? "gemini-active" : "simulation-autonomous-active",
    sandbox: "docker-local-executor",
    timestamp: new Date().toISOString(),
  });
}
