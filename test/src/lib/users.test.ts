import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { createUser, findUser, verifyPassword } from '@/lib/users';

describe('user store', () => {
  it('finds users case-insensitively and verifies their password', () => {
    const username = `unit-${crypto.randomUUID()}`;
    const user = createUser(username, 'correct horse battery');

    expect(findUser(username.toUpperCase())).toEqual(user);
    expect(verifyPassword(user, 'correct horse battery')).toBe(true);
    expect(verifyPassword(user, 'incorrect')).toBe(false);
  });

  it('restores registered users after the database is reopened', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'task-dashboard-users-'));
    const originalPath = process.env.DATABASE_PATH;
    process.env.DATABASE_PATH = join(directory, 'test.sqlite');
    const username = `saved-${crypto.randomUUID().slice(0, 8)}`;

    try {
      await vi.resetModules();
      const first = await import('@/lib/users');
      first.createUser(username, 'long-enough-password');

      await vi.resetModules();
      const reopened = await import('@/lib/users');
      const user = reopened.findUser(username);
      expect(user).toBeDefined();
      expect(reopened.verifyPassword(user!, 'long-enough-password')).toBe(true);
    } finally {
      await vi.resetModules();
      if (originalPath === undefined) delete process.env.DATABASE_PATH;
      else process.env.DATABASE_PATH = originalPath;
      rmSync(directory, { recursive: true, force: true });
    }
  });
});