import { cookies } from "next/headers";
import { encryptSecret, decryptSecret } from "@/lib/security/encryption";
import { memoryStore } from "@/db/client";

export const SESSION_COOKIE_NAME = "fp_session";

export interface SessionUser {
  id: string;
  githubId: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  encryptedToken: string;
}

export async function createSessionCookie(user: SessionUser): Promise<string> {
  const payload = JSON.stringify(user);
  return encryptSecret(payload);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const decrypted = decryptSecret(sessionCookie);
    const user: SessionUser = JSON.parse(decrypted);

    // Also verify or register in memory store
    if (user && user.id) {
      memoryStore.users.set(user.id, {
        id: user.id,
        githubId: user.githubId,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        encryptedGithubToken: user.encryptedToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return user;
  } catch {
    return null;
  }
}

export function getUserAccessToken(user: SessionUser): string | null {
  try {
    if (!user.encryptedToken) return null;
    return decryptSecret(user.encryptedToken);
  } catch {
    return null;
  }
}
