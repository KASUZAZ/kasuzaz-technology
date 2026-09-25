import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

export const services = ["Web Development", "Custom Systems", "Digital Design", "Cybersecurity", "Cloud & Server", "AI & Automation", "IT Support"] as const;
export const statuses = ["New", "Confirmed", "Quoted", "In progress", "Review", "Completed", "On hold", "Cancelled"] as const;
export const maintenanceStatuses = ["None", "Active", "Paused", "Ended"] as const;
export const cycles = ["Monthly", "Quarterly", "Yearly", "One-off"] as const;

export function normalizePhone(value: string): string {
  const cleaned = value.trim();
  const input = cleaned.startsWith("00") ? `+${cleaned.slice(2)}` : /^60\d/.test(cleaned) ? `+${cleaned}` : cleaned;
  const phone = parsePhoneNumberFromString(input, "MY");
  if (!phone?.isValid()) throw new Error("Enter a valid phone number, including country code outside Malaysia.");
  return phone.number;
}

export const requestSchema = z.object({
  requestKey: z.uuid(),
  returning: z.boolean(),
  phone: z.string().trim().min(7).max(40).transform((value, ctx) => {
    try { return normalizePhone(value); } catch { ctx.addIssue({ code: "custom", message: "Enter a valid phone number." }); return z.NEVER; }
  }),
  name: z.string().trim().max(120).default(""),
  company: z.string().trim().max(160).default(""),
  email: z.union([z.email().max(254), z.literal("")]).default(""),
  service: z.enum(services),
  title: z.string().trim().min(3).max(160),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(200).default(""),
}).superRefine((data, ctx) => {
  if (!data.returning && data.name.length < 2) ctx.addIssue({ code: "custom", path: ["name"], message: "Enter your name." });
  if (!data.returning && !data.email) ctx.addIssue({ code: "custom", path: ["email"], message: "Enter your email." });
});

// Decimal strings are converted to integer sen, never floating-point prices.
export function moneyToCents(value: string): number {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) throw new Error("Enter a valid MYR amount with at most two decimals.");
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
const money = z.string().regex(/^\d{1,7}(\.\d{1,2})?$/).transform(moneyToCents);
const date = z.union([z.iso.date(), z.literal("")]);
export const projectSchema = z.object({
  version: z.number().int().min(1),
  title: z.string().trim().min(3).max(160),
  status: z.enum(statuses),
  price: money,
  paid: money,
  notes: z.string().trim().max(10000),
  maintenanceStatus: z.enum(maintenanceStatuses),
  maintenanceFee: money,
  maintenanceCycle: z.enum(cycles),
  maintenanceStart: date,
  maintenanceEnd: date,
  maintenanceNext: date,
  maintenanceNotes: z.string().trim().max(5000),
}).superRefine((data, ctx) => {
  if (data.paid > data.price) ctx.addIssue({ code: "custom", path: ["paid"], message: "Paid amount cannot exceed the project price." });
  if (data.maintenanceStart && data.maintenanceEnd && data.maintenanceEnd < data.maintenanceStart) ctx.addIssue({ code: "custom", path: ["maintenanceEnd"], message: "End date must follow start date." });
  if (data.maintenanceStart && data.maintenanceNext && data.maintenanceNext < data.maintenanceStart) ctx.addIssue({ code: "custom", path: ["maintenanceNext"], message: "Next due date must follow start date." });
  if (data.maintenanceStatus === "Active" && (!data.maintenanceStart || !data.maintenanceNext)) ctx.addIssue({ code: "custom", path: ["maintenanceNext"], message: "Active maintenance requires start and next due dates." });
});

export function orderCode(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 9999) throw new Error("Order number is outside the four-digit range.");
  return String(value).padStart(4, "0");
}
