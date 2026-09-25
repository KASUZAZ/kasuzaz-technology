import { redirect } from "next/navigation";
import { authenticated } from "@/lib/crm/security";
import { Dashboard } from "./dashboard";
export const dynamic="force-dynamic";
export default async function AdminPage(){if(!(await authenticated()))redirect("/admin/login");return <Dashboard/>;}
