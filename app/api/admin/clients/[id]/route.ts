import { NextRequest } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/crm/db";
import { failure, HttpError, json, readJson, requireAdmin, sameOrigin } from "@/lib/crm/security";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: NextRequest, context: Context) {
  try {
    await requireAdmin(); const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Client not found.");
    const db = sql();
    const [client] = await db`SELECT * FROM crm_clients WHERE id=${id}`;
    if (!client) throw new HttpError(404, "Client not found.");
    const projects = await db`SELECT * FROM crm_projects WHERE client_id=${id} ORDER BY created_at DESC`;
    const history = await db`SELECT a.*,p.order_number FROM crm_audit a JOIN crm_projects p ON p.id=a.project_id WHERE p.client_id=${id} ORDER BY a.created_at DESC LIMIT 100`;
    return json({ client, projects, history });
  } catch (error) { return failure(error); }
}
export async function PATCH(request: NextRequest, context: Context) {
  try {
    sameOrigin(request); await requireAdmin(); const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) throw new HttpError(404, "Client not found.");
    const parsed = z.object({ name: z.string().trim().min(2).max(120), email: z.union([z.email().max(254),z.literal("")]), company:z.string().trim().max(160) }).safeParse(await readJson(request));
    if (!parsed.success) throw new HttpError(400, "Check the contact details.");
    const {name,email,company}=parsed.data; const db=sql();
    const rows=await db`UPDATE crm_clients SET name=${name},email=${email},company=${company} WHERE id=${id} RETURNING id`;
    if (!rows.length) throw new HttpError(404,"Client not found.");
    return json({ok:true});
  } catch (error) { return failure(error); }
}
