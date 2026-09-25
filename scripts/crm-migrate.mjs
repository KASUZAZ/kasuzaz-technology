import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. Run with --env-file=.env.local');
const sql = neon(process.env.DATABASE_URL);
const statements = readFileSync(new URL('../migrations/001-crm.sql', import.meta.url), 'utf8').split('-- statement-breakpoint').filter(s => s.trim());
await sql.transaction(statements.map(s => sql.query(s)));
console.log('CRM migration applied successfully.');
