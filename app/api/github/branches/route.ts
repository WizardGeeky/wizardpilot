import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getUserAccessToken } from "@/server/auth/session";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json(
      { success: false, error: "Missing owner or repo query parameters." },
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
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const branches = data.map((b: any) => ({
      name: b.name,
      commitSha: b.commit?.sha?.substring(0, 7) || "",
      isProtected: b.protected || false,
    }));

    return NextResponse.json({ success: true, data: branches });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch branches from GitHub." },
      { status: 500 }
    );
  }
}
