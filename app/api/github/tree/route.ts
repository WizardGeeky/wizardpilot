import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserAccessToken } from "@/server/auth/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");
  const branch = searchParams.get("branch") || "main";

  if (!owner || !repo) {
    return NextResponse.json(
      { success: false, error: "Missing owner or repo parameters." },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  const token = user ? getUserAccessToken(user) : process.env.GITHUB_TOKEN;

  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ForgePilot-Engine",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const files = (data.tree || [])
      .filter((item: any) => item.type === "blob")
      .map((item: any) => ({
        path: item.path,
        size: item.size,
        sha: item.sha,
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalFiles: files.length,
        tree: files.slice(0, 300), // Cap at 300 files
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch repository tree from GitHub." },
      { status: 500 }
    );
  }
}
