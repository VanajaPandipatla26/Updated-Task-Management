import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { db } from '@/lib/db';
import { Priority } from '@/types/task';

describe('task database', () => {
  it('provides the seeded tasks in a shared mutable store', () => {
    expect(db).toHaveLength(3);
    expect(db.map(({ id }) => id)).toEqual(['1', '2', '3']);
    expect(db[0].title).toBe('Prepare sprint demo');
  });

  it('restores saved tasks after the database is reopened', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'task-dashboard-'));
    const originalPath = process.env.DATABASE_PATH;
    process.env.DATABASE_PATH = join(directory, 'test.sqlite');

    try {
      await vi.resetModules();
      const first = await import('@/lib/db');
      first.db.splice(0, first.db.length, {
        id: 'persistent', title: 'Survives restart', description: '', priority: Priority.High,
        dueDate: '2026-10-22', completed: false,
      });
      first.saveTasks();

      await vi.resetModules();
      const reopened = await import('@/lib/db');
      expect(reopened.db).toMatchObject([{ id: 'persistent', title: 'Survives restart' }]);
    } finally {
      await vi.resetModules();
      if (originalPath === undefined) delete process.env.DATABASE_PATH;
      else process.env.DATABASE_PATH = originalPath;
      rmSync(directory, { recursive: true, force: true });
    }
  });
});