import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { attendanceDb } from '@/lib/attendanceDb';

export async function GET() {
  const ids = new Set<string>();
  for (const entry of attendanceDb) {
    if (!entry.id || ids.has(entry.id)) entry.id = randomUUID();
    ids.add(entry.id);
  }
  return NextResponse.json(attendanceDb);
}