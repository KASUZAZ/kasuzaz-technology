import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Run locally. The generated password and hash are NEVER printed or committed.
const rotate = process.argv.includes('--rotate');
if (existsSync('.private/admin-access.txt') && !rotate) {
  console.log('Admin credentials already exist in .private/admin-access.txt. Use --rotate to replace them.');
  process.exit(0);
}
mkdirSync('.private', { recursive: true });
const username = process.env.ADMIN_USERNAME || 'adminkasuzaz';
const password = randomBytes(24).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = `${salt}:${scryptSync(password, salt, 64, { N: 32768, maxmem: 64 * 1024 * 1024 }).toString('hex')}`;
writeFileSync('.private/admin-access.txt', `KASUZAZ TECHNOLOGY — Private admin access\n\nLogin: https://kasuzaz.my/admin/login\nUsername: ${username}\nPassword: ${password}\n\nKeep this file private; save the password in your password manager.\nThis file is excluded from Git and deployment.\n`, { mode: 0o600 });
writeFileSync('.private/admin-password-hash.txt', hash, { mode: 0o600 });
const env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : '';
writeFileSync('.env.local', `${env.replace(/^ADMIN_(?:PASSWORD_HASH|USERNAME)=.*(?:\r?\n|$)/gm, '').trimEnd()}\nADMIN_USERNAME=${JSON.stringify(username)}\nADMIN_PASSWORD_HASH="${hash}"\n`, { mode: 0o600 });
console.log('Private admin access saved to .private/admin-access.txt. Upload ADMIN_USERNAME and the hash as ADMIN_PASSWORD_HASH to Vercel, then deploy.');
