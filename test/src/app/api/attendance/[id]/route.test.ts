import { beforeEach, describe, expect, it } from 'vitest';
import { attendanceDb } from '@/lib/attendanceDb';
import { DELETE, PUT } from '@/app/api/attendance/[id]/route';

const context = (id: string) => ({ params: Promise.resolve({ id }) });
const entry = { employee: ' Alex ', task: ' Planning ', date: '2026-10-08', project: 'Internal', workMode: 'Office', hours: 3, done: true };
const request = (body: unknown) => new Request('http://localhost/api/attendance/row-1', { method: 'PUT', body: JSON.stringify(body) });

describe('single attendance routes', () => {
  beforeEach(() => attendanceDb.splice(0, attendanceDb.length));

  it('validates required fields and trims values before saving', async () => {
    expect((await PUT(request({ ...entry, hours: 25 }), context('row-1'))).status).toBe(400);
    const response = await PUT(request(entry), context('row-1'));
    expect(await response.json()).toMatchObject({ id: 'row-1', employee: 'Alex', task: 'Planning', hours: 3 });
    expect(attendanceDb).toHaveLength(1);
  });

  it('rejects invalid attendance fields', async () => {
    const invalidEntries = [
      { ...entry, employee: undefined },
      { ...entry, employee: ' ' },
      { ...entry, task: undefined },
      { ...entry, task: ' ' },
      { ...entry, date: '' },
      { ...entry, date: '10/08/2026' },
      { ...entry, hours: '3' },
      { ...entry, hours: -1 },
      { ...entry, project: 'Unknown' },
      { ...entry, workMode: 'Remote-ish' },
    ];

    for (const invalidEntry of invalidEntries) {
      expect((await PUT(request(invalidEntry), context('row-1'))).status).toBe(400);
    }
    expect(attendanceDb).toHaveLength(0);
  });

  it('upserts by id and deletes rows idempotently', async () => {
    await PUT(request(entry), context('row-1'));
    await PUT(request({ ...entry, task: 'Updated' }), context('row-1'));
    expect(attendanceDb).toHaveLength(1);
    expect(attendanceDb[0].task).toBe('Updated');
    expect((await DELETE(new Request('http://localhost'), context('row-1'))).status).toBe(200);
    expect(attendanceDb).toHaveLength(0);
    expect((await DELETE(new Request('http://localhost'), context('missing'))).status).toBe(200);
  });
});