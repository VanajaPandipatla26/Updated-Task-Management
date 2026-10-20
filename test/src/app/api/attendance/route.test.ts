import { beforeEach, describe, expect, it } from 'vitest';
import { attendanceDb } from '@/lib/attendanceDb';
import { GET } from '@/app/api/attendance/route';
import { WorkMode } from '@/types/attendance';

describe('attendance collection route', () => {
  beforeEach(() => attendanceDb.splice(0, attendanceDb.length));

  it('returns entries and repairs duplicate or missing ids', async () => {
    attendanceDb.push(
      { id: 'same', employee: 'Alex', task: 'Build', date: '2026-10-08', project: 'Internal', workMode: WorkMode.Office, hours: 1, done: false },
      { id: 'same', employee: 'Sam', task: 'Test', date: '2026-10-08', project: 'Internal', workMode: WorkMode.Remote, hours: 2, done: true },
      { id: '', employee: 'Jo', task: 'Review', date: '2026-10-08', project: 'Internal', workMode: WorkMode.Hybrid, hours: 1, done: false },
    );
    const entries = await (await GET()).json();

    expect(entries).toHaveLength(3);
    expect(new Set(entries.map((entry: { id: string }) => entry.id)).size).toBe(3);
  });
});