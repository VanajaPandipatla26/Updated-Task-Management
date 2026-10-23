import { NextResponse } from 'next/server';
import { db, saveTasks } from '@/lib/db';
import { currentUser, forbid } from '@/lib/authz';
import { TaskInput } from '@/types/task';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await currentUser()).permissions.edit) return forbid('edit tasks');
  const { id } = await params;
  const i = db.findIndex((t) => t.id === id);
  if (i < 0) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  db[i] = { ...db[i], ...((await req.json()) as Partial<TaskInput>) };
  saveTasks();
  return NextResponse.json(db[i]);
}
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await currentUser()).permissions.delete) return forbid('delete tasks');
  const { id } = await params;
  const i = db.findIndex((t) => t.id === id);
  if (i < 0) return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  db.splice(i, 1);
  saveTasks();
  return NextResponse.json({ ok: true });
}