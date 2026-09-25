import { NextRequest } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/crm/db";
import { projectSchema } from "@/lib/crm/validation";
import { failure, HttpError, json, readJson, requireAdmin, sameOrigin } from "@/lib/crm/security";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    sameOrigin(request); await requireAdmin(); const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) throw new HttpError(404,"Project not found.");
    const parsed = projectSchema.safeParse(await readJson(request));
    if (!parsed.success) throw new HttpError(400,parsed.error.issues[0]?.message || "Check the project details.");
    const d=parsed.data; const db=sql();
    const rows=await db`WITH previous AS MATERIALIZED (SELECT * FROM crm_projects WHERE id=${id}), updated AS (
      UPDATE crm_projects SET title=${d.title},status=${d.status},price_cents=${d.price},paid_cents=${d.paid},notes=${d.notes},
      maintenance_status=${d.maintenanceStatus},maintenance_fee_cents=${d.maintenanceFee},maintenance_cycle=${d.maintenanceCycle},
      maintenance_start=${d.maintenanceStart || null}::date,maintenance_end=${d.maintenanceEnd || null}::date,maintenance_next=${d.maintenanceNext || null}::date,
      maintenance_notes=${d.maintenanceNotes},version=version+1,updated_at=now() WHERE id=${id} AND version=${d.version} RETURNING *
    ), event AS (
      INSERT INTO crm_audit(project_id,action,detail) SELECT u.id,'Project updated',jsonb_build_object(
      'previousStatus',p.status,'status',u.status,'previousPrice',p.price_cents,'price',u.price_cents,'previousPaid',p.paid_cents,'paid',u.paid_cents,
      'maintenance',u.maintenance_status,'nextDue',u.maintenance_next,'version',u.version) FROM updated u CROSS JOIN previous p
    ) SELECT id,version FROM updated`;
    if (!rows.length) throw new HttpError(409,"This project changed in another session. Refresh before saving again.");
    return json({ok:true,version:rows[0].version});
  } catch (error) { return failure(error); }
}
