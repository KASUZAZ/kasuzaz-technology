import { NextRequest } from "next/server";
import { sql } from "@/lib/crm/db";
import { requestSchema, orderCode } from "@/lib/crm/validation";
import { digest, failure, HttpError, json, limit, readJson, sameOrigin } from "@/lib/crm/security";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    await limit(request, "request-ip", 12);
    const parsed = requestSchema.safeParse(await readJson(request));
    if (!parsed.success) return json({ error: parsed.error.issues[0]?.message || "Check your details." }, 400);
    const data = parsed.data;
    if (data.website) throw new HttpError(400, "Unable to accept this request.");
    const { requestKey, website: _website, ...details } = data;
    void _website;
    const fingerprint = digest(JSON.stringify(details));
    const db = sql();
    const existing = await db`SELECT order_number, fingerprint FROM crm_projects WHERE request_key=${requestKey}`;
    if (existing.length) {
      if (existing[0].fingerprint !== fingerprint) throw new HttpError(409, "This request has already been sent. Start a new request.");
      return json({ order: orderCode(existing[0].order_number) });
    }
    await limit(request, "request-phone", 5, 3600, data.phone);
    // A phone is a grouping key, NOT proof of identity. Never return client records here.
    const name = data.returning ? "Awaiting contact confirmation" : data.name;
    const email = data.returning ? "" : data.email;
    const company = data.returning ? "" : data.company;
    const contact = JSON.stringify({ name: data.name, email: data.email, company: data.company, returning: data.returning, verified: false });
    const rows = await db`WITH client AS (
      INSERT INTO crm_clients(phone,name,email,company) VALUES(${data.phone},${name},${email},${company})
      ON CONFLICT(phone) DO UPDATE SET phone=EXCLUDED.phone RETURNING id
    ), project AS (
      INSERT INTO crm_projects(client_id,request_key,fingerprint,title,service,brief,submitted_contact)
      SELECT id,${requestKey},${fingerprint},${data.title},${data.service},${data.message},${contact}::jsonb FROM client
      ON CONFLICT(request_key) DO NOTHING RETURNING id,order_number,fingerprint
    ), event AS (
      INSERT INTO crm_audit(project_id,action) SELECT id,'Request received — contact unverified' FROM project
    ) SELECT order_number,fingerprint FROM project`;
    const result = rows[0] || (await db`SELECT order_number,fingerprint FROM crm_projects WHERE request_key=${requestKey}`)[0];
    if (!result || result.fingerprint !== fingerprint) throw new HttpError(409, "Start a new request and try again.");
    return json({ order: orderCode(result.order_number) }, 201);
  } catch (error) { return failure(error); }
}
