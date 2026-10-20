import { NextResponse } from 'next/server';
import { attendanceDb } from '@/lib/attendanceDb';
import { AttendanceEntry, PROJECTS, Project, WorkMode } from '@/types/attendance';

type Ctx = { params: Promise<{ id: string }> };

function parse(b: Partial<AttendanceEntry>): { entry?: Omit<AttendanceEntry, 'id'>; error?: string } {
  const employee = b.employee?.trim() ?? '';
  const task = b.task?.trim() ?? '';
  if (employee.length < 2) return { error: 'Employee name is required' };
  if (!task) return { error: 'Task is required' };
  if (!b.date || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) return { error: 'A valid date is required' };
  if (typeof b.hours !== 'number' || b.hours < 0 || b.hours > 24) return { error: 'Effort hours must be between 0 and 24' };
  if (!PROJECTS.includes(b.project as Project)) return { error: 'Invalid project' };
  if (!Object.values(WorkMode).includes(b.workMode as WorkMode)) return { error: 'Invalid work mode' };
  return {
    entry: { employee, task, date: b.date, project: b.project as Project, workMode: b.workMode as WorkMode, hours: b.hours, done: Boolean(b.done) },
  };
}

// PUT is an upsert: the client chooses the id, so saving twice never duplicates a row.
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const { entry, error } = parse((await req.json()) as Partial<AttendanceEntry>);
  if (!entry) return NextResponse.json({ error }, { status: 400 });
  const saved: AttendanceEntry = { id, ...entry };
  const i = attendanceDb.findIndex((e) => e.id === id);
  if (i < 0) attendanceDb.push(saved);
  else attendanceDb[i] = saved;
  return NextResponse.json(saved);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const i = attendanceDb.findIndex((e) => e.id === id);
  if (i >= 0) attendanceDb.splice(i, 1);
  return NextResponse.json({ ok: true });
}