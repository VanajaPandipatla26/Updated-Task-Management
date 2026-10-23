import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { existsSync, linkSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const databasePath = process.env.DATABASE_PATH ?? join(process.cwd(), 'data', 'task-dashboard.sqlite');
const sessionDurationSeconds = 60 * 60 * 8;

function loadSessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (databasePath === ':memory:') return randomBytes(32).toString('hex');

  const secretPath = `${databasePath}.session-secret`;
  mkdirSync(dirname(secretPath), { recursive: true, mode: 0o700 });
  if (existsSync(secretPath)) return readFileSync(secretPath, 'utf8').trim();

  const temporaryPath = `${secretPath}.${process.pid}.${randomBytes(8).toString('hex')}.tmp`;
  writeFileSync(temporaryPath, randomBytes(32).toString('hex'), { flag: 'wx', mode: 0o600 });
  try {
    linkSync(temporaryPath, secretPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
  } finally {
    unlinkSync(temporaryPath);
  }
  return readFileSync(secretPath, 'utf8').trim();
}

const sessionSecret = loadSessionSecret();

function signature(payload: string) {
  return createHmac('sha256', sessionSecret).update(payload).digest('base64url');
}

export function createSession(username: string) {
  const payload = Buffer.from(JSON.stringify({
    username,
    expiresAt: Date.now() + sessionDurationSeconds * 1000,
  })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function readSession(token: string | undefined) {
  if (!token) return undefined;
  const [payload, suppliedSignature, extra] = token.split('.');
  if (!payload || !suppliedSignature || extra) return undefined;

  const expectedSignature = Buffer.from(signature(payload));
  const actualSignature = Buffer.from(suppliedSignature);
  if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) return undefined;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { username?: unknown; expiresAt?: unknown };
    if (typeof session.username !== 'string' || typeof session.expiresAt !== 'number' || session.expiresAt <= Date.now()) return undefined;
    return session.username;
  } catch {
    return undefined;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: sessionDurationSeconds,
};