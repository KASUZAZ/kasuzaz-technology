import "server-only";
import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { sql } from "./db";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export const cookieName = "kz_admin_session";
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const credentialVersion = () => digest(process.env.ADMIN_PASSWORD_HASH || "disabled");

export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  // Next's internal URL can use localhost behind a proxy; Host is the public
  // request authority. Do not trust an arbitrary x-forwarded-host header.
  const host = request.headers.get("host");
  let validOrigin = false;
  try {
    const url = new URL(origin || "");
    validOrigin = ["http:", "https:"].includes(url.protocol) && url.host === host && url.origin === origin && (!process.env.VERCEL || url.protocol === "https:");
  } catch { /* Missing or malformed origin is rejected. */ }
  if (!validOrigin) throw new HttpError(403, "Please submit from this website.");
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") throw new HttpError(403, "Request not allowed.");
}

export async function readJson(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new HttpError(415, "JSON required.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request.");
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) {
    const { value, done } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > 24000) { await reader.cancel(); throw new HttpError(413, "Request too large."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new HttpError(400, "Invalid request."); }
}

export async function limit(request: NextRequest, scope: string, maximum: number, seconds = 900, subject?: string) {
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown" : "local";
  const key = createHmac("sha256", process.env.ADMIN_PASSWORD_HASH || "crm-rate-limit").update(`${scope}:${subject || ip.split(",")[0]}`).digest("hex");
  const db = sql();
  const [row] = await db`INSERT INTO crm_rate_limits (key,count,expires_at) VALUES (${key},1,now() + ${seconds} * interval '1 second')
    ON CONFLICT (key) DO UPDATE SET count = CASE WHEN crm_rate_limits.expires_at < now() THEN 1 ELSE crm_rate_limits.count + 1 END,
    expires_at = CASE WHEN crm_rate_limits.expires_at < now() THEN now() + ${seconds} * interval '1 second' ELSE crm_rate_limits.expires_at END RETURNING count`;
  if (row.count > maximum) throw new HttpError(429, "Too many attempts. Please try again later.");
}

export function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) throw new HttpError(503, "Admin access is not configured.");
  const [salt, hash] = stored.split(":");
  if (!salt || !hash || hash.length !== 128) throw new HttpError(503, "Admin access is not configured.");
  const candidate = scryptSync(password, salt, 64, { N: 32768, maxmem: 64 * 1024 * 1024 });
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export async function authenticated() {
  if (!process.env.ADMIN_PASSWORD_HASH) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  const db = sql();
  const rows = await db`SELECT token_hash FROM crm_sessions WHERE token_hash=${digest(token)} AND credential_version=${credentialVersion()} AND expires_at > now()`;
  return rows.length === 1;
}
export async function requireAdmin() { if (!(await authenticated())) throw new HttpError(401, "Please sign in again."); }

export async function createSession() {
  const token = randomBytes(32).toString("hex");
  const db = sql();
  await db`DELETE FROM crm_sessions WHERE expires_at < now()`;
  await db`INSERT INTO crm_sessions(token_hash,credential_version,expires_at) VALUES(${digest(token)},${credentialVersion()},now()+interval '8 hours')`;
  return token;
}

export function json(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" } });
}
export function failure(error: unknown) {
  if (error instanceof HttpError) return json({ error: error.message }, error.status);
  // Never log customer submissions, credentials or database connection strings.
  console.error("CRM request failed", error instanceof Error ? error.name : "UnknownError");
  return json({ error: "Unable to save right now. Please retry or contact us on WhatsApp." }, 503);
}
