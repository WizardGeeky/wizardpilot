import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "GITHUB_CLIENT_ID is not configured in .env.local" },
      { status: 500 }
    );
  }

  // Pass redirect in the state parameter
  const state = encodeURIComponent(
    JSON.stringify({
      redirect: redirectTo,
      nonce: Math.random().toString(36).substring(2, 10),
    })
  );

  const scope = "read:user user:email repo";

  // When redirect_uri is omitted, GitHub redirects automatically to the callback URL registered in the OAuth app settings
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(
    scope
  )}&state=${state}`;

  return NextResponse.redirect(githubAuthUrl);
}
