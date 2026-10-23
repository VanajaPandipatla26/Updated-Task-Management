import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentUser } from '@/lib/authz';
import { db } from '@/lib/db';
import { GET, POST } from '@/app/api/tasks/route';
import { Priority } from '@/types/task';

vi.mock('@/lib/authz', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/authz')>()),
  currentUser: vi.fn(),
}));

const request = (body: unknown) => new Request('http://localhost/api/tasks', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
});

describe('task collection routes', () => {
  beforeEach(() => {
    db.splice(0, db.length);
    vi.mocked(currentUser).mockResolvedValue({ username: 'alex', role: 'D' as never, permissions: { access: true, add: true, edit: true, delete: true } });
  });

  it('returns the task collection', async () => {
    db.push({ id: 'existing', title: 'Existing', description: '', priority: Priority.Low, dueDate: '2026-10-08', completed: false });
    expect(await (await GET()).json()).toEqual(db);
  });

  it('forbids listing tasks without access permission', async () => {
    vi.mocked(currentUser).mockResolvedValueOnce({ username: '', role: 'HR' as never, permissions: { access: false, add: false, edit: false, delete: false } });
    expect((await GET()).status).toBe(403);
  });

  it('rejects blank titles and creates a valid task', async () => {
    const invalid = await POST(request({ title: '  ' }));
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toEqual({ error: 'Title is required' });

    const created = await POST(request({ title: 'New task', description: '', priority: Priority.High, dueDate: '2026-10-12', completed: false }));
    expect(created.status).toBe(201);
    expect(await created.json()).toMatchObject({ title: 'New task', id: expect.any(String) });
    expect(db).toHaveLength(1);
  });

  it('forbids creating tasks without add permission', async () => {
    vi.mocked(currentUser).mockResolvedValueOnce({ username: 'alex', role: 'D' as never, permissions: { access: true, add: false, edit: true, delete: true } });
    expect((await POST(request({ title: 'Blocked' }))).status).toBe(403);
    expect(db).toHaveLength(0);
  });
});