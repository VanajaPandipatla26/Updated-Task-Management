import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

describe('session signing', () => {
  it('keeps the fallback signing key stable after a module reload', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'task-dashboard-session-'));
    const originalPath = process.env.DATABASE_PATH;
    const originalSecret = process.env.SESSION_SECRET;
    process.env.DATABASE_PATH = join(directory, 'test.sqlite');
    delete process.env.SESSION_SECRET;

    try {
      await vi.resetModules();
      const first = await import('@/lib/session');
      const token = first.createSession('stable-user');

      await vi.resetModules();
      const reopened = await import('@/lib/session');
      expect(reopened.readSession(token)).toBe('stable-user');
    } finally {
      await vi.resetModules();
      if (originalPath === undefined) delete process.env.DATABASE_PATH;
      else process.env.DATABASE_PATH = originalPath;
      if (originalSecret === undefined) delete process.env.SESSION_SECRET;
      else process.env.SESSION_SECRET = originalSecret;
      rmSync(directory, { recursive: true, force: true });
    }
  });
});