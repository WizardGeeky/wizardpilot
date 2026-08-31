import { NextRequest, NextResponse } from "next/server";
import { encryptSecret } from "@/lib/security/encryption";
import { SESSION_COOKIE_NAME, SessionUser, createSessionCookie } from "@/server/auth/session";
import { memoryStore } from "@/db/client";
import { logger } from "@/lib/logger/logger";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token?.trim() || process.env.GITHUB_TOKEN?.trim();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid GitHub Personal Access Token (PAT)." },
        { status: 400 }
      );
    }

    // Verify token with GitHub API
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "ForgePilot-Engine",
      },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { success: false, error: "Invalid GitHub token. Please check token permissions (repo, read:user)." },
        { status: 401 }
      );
    }

    const ghUser = await userRes.json();

    // Fetch email
    let email = ghUser.email;
    if (!email) {
      try {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "ForgePilot-Engine",
          },
        });
        if (emailsRes.ok) {
          const emails = await emailsRes.json();
          const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
          if (primary) email = primary.email;
        }
      } catch {}
    }

    const userId = `user_${ghUser.id}`;
    const encryptedToken = encryptSecret(token);

    const sessionUser: SessionUser = {
      id: userId,
      githubId: String(ghUser.id),
      username: ghUser.login,
      name: ghUser.name || ghUser.login,
      email: email || `${ghUser.login}@users.noreply.github.com`,
      avatarUrl: ghUser.avatar_url || "",
      encryptedToken,
    };

    // Save to memory store
    memoryStore.users.set(userId, {
      id: userId,
      githubId: String(ghUser.id),
      name: sessionUser.name,
      email: sessionUser.email,
      avatarUrl: sessionUser.avatarUrl,
      encryptedGithubToken: encryptedToken,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create session cookie
    const sessionToken = await createSessionCookie(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: {
        id: sessionUser.id,
        name: sessionUser.name,
        username: sessionUser.username,
        avatarUrl: sessionUser.avatarUrl,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    logger.info("GitHub Token direct login successful", { username: ghUser.login, userId });
    return response;
  } catch (err) {
    logger.error("Token login error", { error: String(err) });
    return NextResponse.json(
      { success: false, error: "Internal error verifying GitHub token." },
      { status: 500 }
    );
  }
}
