import { createHmac, scryptSync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const USER_COOKIE = "fm-user-session";
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "fiestamania-dev-secret-change-in-prod";

// ─── Password ─────────────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, storedHash] = stored.split(":");
  if (!salt || !storedHash) return false;
  try {
    const hash = scryptSync(password, salt, 64);
    return timingSafeEqual(hash, Buffer.from(storedHash, "hex"));
  } catch {
    return false;
  }
}

// ─── Session tokens ────────────────────────────────────────────────────────────

export function createSessionToken(userId: string, role: string): string {
  const ts = Date.now().toString();
  const data = `${userId}|${role}|${ts}`;
  const sig = createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}|${sig}`).toString("base64url");
}

export function verifySessionToken(
  token: string
): { userId: string; role: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastPipe = decoded.lastIndexOf("|");
    const data = decoded.slice(0, lastPipe);
    const sig = decoded.slice(lastPipe + 1);
    const expected = createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex");
    if (
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))
    )
      return null;
    const [userId, role] = data.split("|");
    if (!userId || !role) return null;
    return { userId, role };
  } catch {
    return null;
  }
}

// ─── Server-side session helpers ───────────────────────────────────────────────

export async function getSession(): Promise<{
  userId: string;
  role: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}
