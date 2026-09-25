import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { normalizePhone, moneyToCents, orderCode, requestSchema, projectSchema } from '../lib/crm/validation.ts';

test('Malaysian phone formats group into one identity', () => {
  for (const phone of ['011 2481 9812', '+60 11-2481 9812', '601124819812', '00601124819812']) {
    assert.equal(normalizePhone(phone), '+601124819812');
  }
  assert.equal(normalizePhone('+1 202 555 0123'), '+12025550123');
  assert.throws(() => normalizePhone('123'));
});
test('prices preserve exact sen and reject unsupported amounts', () => {
  assert.equal(moneyToCents('1234.56'), 123456);
  assert.equal(moneyToCents('0.1'), 10);
  assert.equal(moneyToCents('0'), 0);
  for (const amount of ['-1', '1.001', '1e3', 'NaN', '10000000', '']) assert.throws(() => moneyToCents(amount));
});
test('order references are four digits and never wrap', () => {
  assert.equal(orderCode(1), '0001');
  assert.equal(orderCode(9999), '9999');
  for (const value of [0, 10000, 1.5, -1]) assert.throws(() => orderCode(value));
});
const request = { requestKey: randomUUID(), returning: true, phone: '01124819812', service: 'Custom Systems', title: 'New website', message: 'Please build a new company website.', consent: true };
test('returning requests need phone and brief; new clients need contact details', () => {
  assert.equal(requestSchema.safeParse(request).success, true);
  assert.equal(requestSchema.safeParse({ ...request, returning: false }).success, false);
  assert.equal(requestSchema.safeParse({ ...request, returning: false, name: 'Test Client', email: 'client@example.com' }).success, true);
  assert.equal(requestSchema.safeParse({ ...request, consent: false }).success, false);
});
const project = { version: 1, title: 'Company website', status: 'Quoted', price: '1000.10', paid: '500.05', notes: '', maintenanceStatus: 'Active', maintenanceFee: '100.25', maintenanceCycle: 'Monthly', maintenanceStart: '2026-09-01', maintenanceEnd: '', maintenanceNext: '2026-10-01', maintenanceNotes: '' };
test('project validation rejects overpayments and inconsistent maintenance', () => {
  assert.equal(projectSchema.parse(project).price, 100010);
  for (const change of [{ paid: '1000.11' }, { maintenanceNext: '' }, { maintenanceEnd: '2026-08-31' }, { maintenanceNext: '2026-08-31' }, { maintenanceNext: '2026-02-30' }, { version: 0 }]) {
    assert.equal(projectSchema.safeParse({ ...project, ...change }).success, false);
  }
});
