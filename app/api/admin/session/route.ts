import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { sql } from "@/lib/crm/db";
import { cookieName, createSession, digest, failure, HttpError, json, limit, readJson, sameOrigin, verifyPassword } from "@/lib/crm/security";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    await limit(request, "admin-login", 6);
    const data = z.object({ password: z.string().min(1).max(256) }).safeParse(await readJson(request));
    if (!data.success || !verifyPassword(data.data.password)) throw new HttpError(401, "Incorrect password.");
    const token = await createSession();
    const response = json({ ok: true });
    response.cookies.set(cookieName, token, { httpOnly: true, secure: !!process.env.VERCEL || request.nextUrl.protocol === "https:", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
    return response;
  } catch (error) { return failure(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    sameOrigin(request);
    const token = (await cookies()).get(cookieName)?.value;
    if (token) { const db = sql(); await db`DELETE FROM crm_sessions WHERE token_hash=${digest(token)}`; }
    const response = json({ ok: true });
    response.cookies.set(cookieName, "", { httpOnly: true, secure: !!process.env.VERCEL || request.nextUrl.protocol === "https:", sameSite: "strict", path: "/", maxAge: 0 });
    return response;
  } catch (error) { return failure(error); }
}
