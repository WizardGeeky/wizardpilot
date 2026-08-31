import { NextResponse } from "next/server";
import { getCurrentUser, getUserAccessToken } from "@/server/auth/session";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please sign in with GitHub." },
      { status: 401 }
    );
  }

  const token = getUserAccessToken(user);

  if (!token) {
    return NextResponse.json(
      { success: false, error: "GitHub access token missing or expired." },
      { status: 401 }
    );
  }

  try {
    const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ForgePilot-Engine",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `GitHub API error (${res.status})` },
        { status: res.status }
      );
    }

    const repos = await res.json();
    const formatted = repos.map((r: any) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description || "",
      defaultBranch: r.default_branch || "main",
      isPrivate: r.private,
      language: r.language || "TypeScript",
      starsCount: r.stargazers_count || 0,
      forksCount: r.forks_count || 0,
      url: r.html_url,
      owner: r.owner?.login,
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to connect to GitHub API." },
      { status: 500 }
    );
  }
}
