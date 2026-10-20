import { describe, expect, it } from 'vitest';
import { attendanceDb } from '@/lib/attendanceDb';
import { WorkMode } from '@/types/attendance';

describe('attendance database', () => {
  it('exports a shared mutable collection', () => {
    const marker = { id: 'test', employee: 'Sam', task: 'Planning', date: '2026-10-08', project: 'Internal', workMode: WorkMode.Office, hours: 1, done: false } as const;
    attendanceDb.push(marker);

    expect(attendanceDb.at(-1)).toBe(marker);
    attendanceDb.pop();
  });
});