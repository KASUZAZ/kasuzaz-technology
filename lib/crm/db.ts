import "server-only";
import { neon } from "@neondatabase/serverless";

export function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("CRM_DATABASE_UNAVAILABLE");
  return neon(url);
}
