import { beforeEach, describe, expect, it, vi } from 'vitest';
import { currentUser } from '@/lib/authz';
import { db } from '@/lib/db';
import { DELETE, PUT } from '@/app/api/tasks/[id]/route';
import { Priority } from '@/types/task';

vi.mock('@/lib/authz', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/authz')>()),
  currentUser: vi.fn(),
}));

const context = { params: Promise.resolve({ id: '1' }) };
const updateRequest = new Request('http://localhost/api/tasks/1', { method: 'PUT', body: JSON.stringify({ title: 'Updated' }) });

describe('single task routes', () => {
  beforeEach(() => {
    db.splice(0, db.length, { id: '1', title: 'Original', description: '', priority: Priority.Low, dueDate: '2026-10-08', completed: false });
    vi.mocked(currentUser).mockResolvedValue({ username: 'alex', role: 'D' as never, permissions: { access: true, add: true, edit: true, delete: true } });
  });

  it('updates an existing task and returns 404 for an unknown task', async () => {
    expect(await (await PUT(updateRequest, context)).json()).toMatchObject({ id: '1', title: 'Updated' });
    expect((await PUT(updateRequest, { params: Promise.resolve({ id: 'missing' }) })).status).toBe(404);
  });

  it('deletes existing tasks and enforces delete permission', async () => {
    expect((await DELETE(new Request('http://localhost'), context)).status).toBe(200);
    expect(db).toHaveLength(0);

    vi.mocked(currentUser).mockResolvedValueOnce({ username: 'alex', role: 'D' as never, permissions: { access: true, add: true, edit: true, delete: false } });
    expect((await DELETE(new Request('http://localhost'), context)).status).toBe(403);
  });
});