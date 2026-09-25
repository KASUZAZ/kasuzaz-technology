# KASUZAZ Client Studio

Production: https://kasuzaz-technology.vercel.app
Admin: https://kasuzaz-technology.vercel.app/admin

## Daily workflow

1. The website form saves a client and project in Neon Postgres before displaying a four-digit order reference.
2. Malaysian local numbers and international formats are normalised to E.164. Repeated requests with the same number share one client profile; existing contact information is preserved.
3. Returning clients enter the original phone number and the new project brief. A phone number is a grouping key, **not authentication**. Public responses contain only the new order reference. Confirm a request with the client before work or payment arrangements; mark the project Confirmed when checked.
4. In Client Studio, search by name, phone, project title or the four-digit order code. Open a client, then expand an order to edit pricing, amount paid, status and internal notes.
5. Set a maintenance plan, fee/cycle, start date, optional end date and next service/due date. The Maintenance tab lists overdue items and the next 30 days. Advance the next date and record service notes after completing maintenance.
6. Payments are manual records in MYR, not a payment gateway. Maintenance does not automatically bill or message clients. The project timeline records changes to status, price, paid amount and maintenance.

## Admin access

The owner password is in the local ignored `.private/admin-access.txt` file. No username is required. Save it in a password manager; do not upload or send this file. Sessions expire after eight hours; logging out revokes the server session. All admin data APIs require a valid session.

To rotate access, run `npm run admin:setup -- --rotate`. This updates the local password and scrypt hash. Upload the contents of `.private/admin-password-hash.txt` as the sensitive **server-only** Vercel variable `ADMIN_PASSWORD_HASH`, then redeploy. Existing sessions become invalid after rotation. Never use a `NEXT_PUBLIC_` variable for credentials.

## Local development / deployment

- Node.js 22.13+; run `npm ci`, `npm run dev` (native Next.js).
- `.env.local` needs `DATABASE_URL` and `ADMIN_PASSWORD_HASH`. Vercel/Neon supplies the database URL. Keep all `.env*`, `.private/` and `.vercel/` files out of Git.
- `npm run db:migrate` applies the idempotent SQL migration to the configured database. Use the correct database connection before running it; application requests never run migrations automatically.
- `npm test` runs validation tests. `node --env-file=.env.local tests/crm-integration.mjs` exercises the local API against synthetic records and removes only its own fixtures. It refuses non-local URLs and pre-existing fixture phone numbers. Order sequence gaps after tests/retries are expected.
- `npm run lint` and `npm run build` verify code and the Next.js production build.
- The existing Vercel project is `kasuzazs-projects/kasuzaz-technology`, linked to `KASUZAZ/kasuzaz-technology` on GitHub. Production uses `main`.

## Data and limits

- Orders run from **0001 to 9999**, uniquely across all projects. The sequence never wraps or reuses a number. Before approaching this capacity, expand the reference format or introduce an explicitly displayed series. Four digits cannot identify more than 9,999 unique orders indefinitely.
- New submissions use a retry key to prevent duplicate orders. Client phone uniqueness and order uniqueness are enforced in Postgres. Admin project saves use version checks to prevent overwriting a newer edit.
- New requests are limited per IP and phone; login attempts are also limited. All write requests require a matching origin. Sessions use hashed random tokens and HttpOnly, SameSite=Strict cookies (Secure in production).
- Dashboard search returns up to 200 matching clients; timelines show the latest 100 events. Full project records remain in the database.
- For a correction, use the admin contact editor. Phone changes/merges and deletion requests require a reviewed database operation, including dependent projects/audit records; there is deliberately no public deletion or lookup API.
- Backups/restore retention follow the configured Neon plan. Export or configure additional backups before relying on long-term financial archiving. Customer history is stored server-side, not in browser local storage.
