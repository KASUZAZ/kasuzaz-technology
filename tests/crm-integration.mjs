import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID, createHmac } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const base = process.env.CRM_TEST_ORIGIN || 'http://127.0.0.1:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Integration writes are restricted to a local app.');
const sql = neon(process.env.DATABASE_URL);
const phone = '+12025550123'; // Reserved North American fictional number; no messages are sent.
const password = readFileSync('.private/admin-access.txt', 'utf8').match(/^Password: (.+)$/m)[1];
const keys = [randomUUID(), randomUUID(), randomUUID()];
const tag = `CRM TEST ${randomUUID()}`;
let cookie = '';
async function call(path, method = 'GET', body, authenticated = false, origin = base) {
  const response = await fetch(base + path, { method, headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(authenticated ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const data = await response.json();
  return { response, data };
}
const request = { requestKey: keys[0], returning: false, phone, name: tag, email: 'crm-test@example.invalid', company: 'Synthetic test', service: 'Web Development', title: tag, message: 'Synthetic verification only. Do not contact or deliver.', consent: true, website: '' };
const rateKey = (scope, subject) => createHmac('sha256', process.env.ADMIN_PASSWORD_HASH).update(`${scope}:${subject}`).digest('hex');
const rateKeys = [rateKey('admin-login', 'local'), rateKey('request-ip', 'local'), rateKey('request-phone', phone)];
const preexisting = await sql`SELECT id FROM crm_clients WHERE phone=${phone}`;
assert.equal(preexisting.length, 0, 'Reserved fixture number already exists; refusing to touch it.');
try {
  assert.equal((await call('/api/admin/clients')).response.status, 401);
  assert.equal((await call('/api/requests', 'POST', request, false, 'https://other.invalid')).response.status, 403);
  assert.equal((await call('/api/requests', 'POST', { ...request, consent: false })).response.status, 400);
  const first = await call('/api/requests', 'POST', request);
  assert.equal(first.response.status, 201, JSON.stringify(first.data));
  assert.match(first.data.order, /^\d{4}$/);
  assert.deepEqual(Object.keys(first.data), ['order'], 'Public endpoint must not expose client records.');
  const retry = await call('/api/requests', 'POST', request);
  assert.equal(retry.data.order, first.data.order);
  assert.equal((await call('/api/requests', 'POST', { ...request, title: 'Changed request' })).response.status, 409);
  const returning = { ...request, requestKey: keys[1], returning: true, phone: '001 202 555 0123', name: '', email: '', company: '', title: 'Second test project' };
  const second = await call('/api/requests', 'POST', returning);
  assert.equal(second.response.status, 201, JSON.stringify(second.data));
  assert.notEqual(second.data.order, first.data.order);
  const concurrent = { ...returning, requestKey: keys[2], title: 'Concurrent retry test' };
  const replies = await Promise.all([call('/api/requests', 'POST', concurrent), call('/api/requests', 'POST', concurrent)]);
  for (const reply of replies) assert.ok(reply.response.ok, JSON.stringify(reply.data));
  assert.equal(replies[0].data.order, replies[1].data.order);
  assert.equal((await call('/api/admin/session', 'POST', { password: 'incorrect' })).response.status, 401);
  const login = await call('/api/admin/session', 'POST', { password });
  assert.equal(login.response.status, 200, JSON.stringify(login.data));
  const setCookie = login.response.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=strict/i);
  cookie = setCookie.split(';')[0];
  const overview = await call(`/api/admin/clients?q=${encodeURIComponent(tag)}`, 'GET', undefined, true);
  assert.equal(overview.response.status, 200, JSON.stringify(overview.data));
  assert.equal(overview.data.clients.length, 1);
  const client = overview.data.clients[0];
  assert.equal(client.project_count, 3); assert.equal(client.name, tag); assert.equal(client.phone, phone);
  const detail = await call(`/api/admin/clients/${client.id}`, 'GET', undefined, true);
  assert.equal(detail.data.projects.length, 3); assert.equal(detail.data.history.length, 3);
  const project = detail.data.projects.find(p => String(p.order_number).padStart(4, '0') === first.data.order);
  const update = { version: project.version, title: project.title, status: 'In progress', price: '2500.25', paid: '500.10', notes: 'Test payment reference', maintenanceStatus: 'Active', maintenanceFee: '120.50', maintenanceCycle: 'Monthly', maintenanceStart: '2026-09-01', maintenanceEnd: '2027-09-01', maintenanceNext: '2026-09-25', maintenanceNotes: 'Backups and patching' };
  assert.equal((await call(`/api/admin/projects/${project.id}`, 'PATCH', update)).response.status, 401);
  assert.equal((await call(`/api/admin/projects/${project.id}`, 'PATCH', { ...update, paid: '3000' }, true)).response.status, 400);
  const saved = await call(`/api/admin/projects/${project.id}`, 'PATCH', update, true);
  assert.equal(saved.response.status, 200, JSON.stringify(saved.data));
  assert.equal((await call(`/api/admin/projects/${project.id}`, 'PATCH', update, true)).response.status, 409);
  const refreshed = await call(`/api/admin/clients/${client.id}`, 'GET', undefined, true);
  const persisted = refreshed.data.projects.find(p => p.id === project.id);
  assert.equal(persisted.price_cents, 250025); assert.equal(persisted.paid_cents, 50010);
  assert.equal(persisted.maintenance_fee_cents, 12050); assert.equal(persisted.maintenance_status, 'Active');
  assert.equal(refreshed.data.history.length, 4);
  const byOrder = await call(`/api/admin/clients?q=${first.data.order}`, 'GET', undefined, true);
  assert.equal(byOrder.data.clients[0].id, client.id);
  assert.ok(byOrder.data.due.some(p => p.id === project.id));
  const contact = await call(`/api/admin/clients/${client.id}`, 'PATCH', { name: tag, email: 'confirmed@example.invalid', company: 'Confirmed test company' }, true);
  assert.equal(contact.response.status, 200, JSON.stringify(contact.data));
  assert.equal((await call('/api/admin/session', 'DELETE', undefined, true)).response.status, 200);
  assert.equal((await call('/api/admin/clients', 'GET', undefined, true)).response.status, 401);
  console.log('PASS: intake, phone deduplication, idempotency/concurrency, privacy, CSRF, login/logout, prices, maintenance, history and version conflict.');
} finally {
  // Remove only this run's synthetic records. Never reset the order sequence.
  await sql.transaction([
    sql`DELETE FROM crm_audit WHERE project_id IN (SELECT id FROM crm_projects WHERE request_key=ANY(${keys}::uuid[]))`,
    sql`DELETE FROM crm_projects WHERE request_key=ANY(${keys}::uuid[])`,
    sql`DELETE FROM crm_clients WHERE phone=${phone} AND name=${tag} AND NOT EXISTS(SELECT 1 FROM crm_projects WHERE client_id=crm_clients.id)`,
    sql`DELETE FROM crm_rate_limits WHERE key=ANY(${rateKeys}::text[])`,
  ]);
  if (cookie) await call('/api/admin/session', 'DELETE', undefined, true);
  console.log('Synthetic records cleaned up; order sequence preserved.');
}
