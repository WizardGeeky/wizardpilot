import { NextRequest, NextResponse } from "next/server";
import { encryptSecret } from "@/lib/security/encryption";
import { SESSION_COOKIE_NAME, SessionUser, createSessionCookie } from "@/server/auth/session";
import { memoryStore } from "@/db/client";
import { logger } from "@/lib/logger/logger";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const stateParam = searchParams.get("state");

  let targetRedirect = "/dashboard";
  if (stateParam) {
    try {
      const parsedState = JSON.parse(decodeURIComponent(stateParam));
      if (parsedState?.redirect && typeof parsedState.redirect === "string" && parsedState.redirect.startsWith("/")) {
        targetRedirect = parsedState.redirect;
      }
    } catch {}
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error || !code) {
    logger.error("GitHub OAuth authorization failed", { error });
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(error || "No code provided")}`);
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    // 1. Exchange authorization code for GitHub access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      logger.error("Failed to obtain GitHub access token", { tokenData });
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange_failed`);
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated GitHub user profile
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "WizardPilot-Engine",
      },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${appUrl}/login?error=user_fetch_failed`);
    }

    const ghUser = await userRes.json();

    // 3. Fetch primary verified email
    let email = ghUser.email;
    if (!email) {
      try {
        const emailsRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "WizardPilot-Engine",
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
    const encryptedToken = encryptSecret(accessToken);

    const sessionUser: SessionUser = {
      id: userId,
      githubId: String(ghUser.id),
      username: ghUser.login,
      name: ghUser.name || ghUser.login,
      email: email || `${ghUser.login}@users.noreply.github.com`,
      avatarUrl: ghUser.avatar_url || "",
      encryptedToken,
    };

    // 4. Save to repository store
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

    // 5. Create session cookie
    const sessionToken = await createSessionCookie(sessionUser);

    const response = NextResponse.redirect(`${appUrl}${targetRedirect}`);
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    logger.info("GitHub OAuth login successful", { username: ghUser.login, userId });
    return response;
  } catch (err) {
    logger.error("OAuth callback processing error", { error: String(err) });
    return NextResponse.redirect(`${appUrl}/login?error=auth_internal_error`);
  }
}
