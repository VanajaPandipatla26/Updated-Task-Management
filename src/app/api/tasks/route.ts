import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser, forbid } from '@/lib/authz';
import { Task, TaskInput } from '@/types/task';

export async function GET() {
  return NextResponse.json(db);
}
export async function POST(req: Request) {
  if (!(await currentUser()).permissions.add) return forbid('add tasks');
  const body = (await req.json()) as TaskInput;
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  const task: Task = { ...body, id: crypto.randomUUID() };
  db.unshift(task);
  return NextResponse.json(task, { status: 201 });
}