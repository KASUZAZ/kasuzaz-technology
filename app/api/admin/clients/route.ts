import { NextRequest } from "next/server";
import { sql } from "@/lib/crm/db";
import { failure, json, requireAdmin } from "@/lib/crm/security";

export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const search = (request.nextUrl.searchParams.get("q") || "").trim().slice(0,120);
    const filter = `%${search}%`;
    const db = sql();
    const clients = await db`SELECT c.*, count(p.id)::int AS project_count, coalesce(sum(p.price_cents),0)::bigint::text AS total_cents,
      coalesce(sum(p.paid_cents),0)::bigint::text AS paid_cents, max(p.created_at) AS latest_request
      FROM crm_clients c LEFT JOIN crm_projects p ON p.client_id=c.id
      WHERE c.name ILIKE ${filter} OR c.phone ILIKE ${filter} OR c.email ILIKE ${filter} OR c.company ILIKE ${filter}
      OR EXISTS(SELECT 1 FROM crm_projects op WHERE op.client_id=c.id AND (lpad(op.order_number::text,4,'0')=${search} OR op.title ILIKE ${filter}))
      GROUP BY c.id ORDER BY max(p.created_at) DESC NULLS LAST LIMIT 200`;
    const [stats] = await db`SELECT (SELECT count(*)::int FROM crm_clients) AS clients, count(*)::int AS projects,
      count(*) FILTER (WHERE status='New')::int AS new_requests,
      count(*) FILTER (WHERE maintenance_status='Active' AND maintenance_next<=current_date)::int AS maintenance_due,
      coalesce(sum(price_cents-paid_cents) FILTER (WHERE status<>'Cancelled'),0)::bigint::text AS outstanding_cents
      FROM crm_projects`;
    const due = await db`SELECT p.id,p.order_number,p.title,p.maintenance_next,p.maintenance_fee_cents,c.name,c.phone
      FROM crm_projects p JOIN crm_clients c ON c.id=p.client_id
      WHERE p.maintenance_status='Active' AND p.maintenance_next <= current_date + interval '30 days'
      ORDER BY p.maintenance_next LIMIT 100`;
    return json({ clients, stats, due });
  } catch (error) { return failure(error); }
}
