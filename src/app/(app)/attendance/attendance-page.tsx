'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { today } from '@/lib/date';
import { AttendanceEntry, AttendanceRow, PROJECTS, Project, WorkMode } from '@/types/attendance';
import s from '@/styles/ui.module.css';

const toRow = (e: AttendanceEntry): AttendanceRow => ({ ...e, status: 'saved' });
const blankRow = (date = ''): AttendanceRow => ({
  id: crypto.randomUUID(), employee: '', task: '', date, project: PROJECTS[0],
  workMode: WorkMode.Office, hours: '', done: false, status: 'draft',
});
const invalidHours = (h: number | '') => h !== '' && (h < 0 || h > 24);

function validate(r: AttendanceRow): string {
  if (r.employee.trim().length < 2) return 'Enter the employee name.';
  if (!r.task.trim()) return 'Enter the task.';
  if (!r.date) return 'Pick a date.';
  if (r.hours === '' || invalidHours(r.hours)) return 'Effort hours must be between 0 and 24.';
  return '';
}

export default function AttendancePage() {
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const list = await api.get<AttendanceEntry[]>('/api/attendance');
      setRows(list.length ? list.map(toRow) : [blankRow()]);
    } catch (e) { setLoadError((e as Error).message); }
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const patch = (id: string, changes: Partial<AttendanceRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  // Any edit turns the row back into a draft so Save becomes available again.
  const update = <K extends keyof AttendanceRow>(id: string, key: K, value: AttendanceRow[K]) =>
    patch(id, { [key]: value, status: 'draft', error: undefined } as Partial<AttendanceRow>);
  const addRow = () => setRows((rs) => [...rs, blankRow(today())]);

  async function save(row: AttendanceRow) {
    const error = validate(row);
    if (error) return patch(row.id, { error });
    patch(row.id, { status: 'saving', error: undefined });
    try {
      await api.put<AttendanceEntry>(`/api/attendance/${row.id}`, {
        employee: row.employee, task: row.task, date: row.date, project: row.project,
        workMode: row.workMode, hours: row.hours, done: row.done,
      });
      // Only mark saved if the row wasn't edited while the request was running.
      setRows((rs) => rs.map((r) => (r.id === row.id && r.status === 'saving' ? { ...r, status: 'saved' } : r)));
    } catch (e) { patch(row.id, { status: 'draft', error: (e as Error).message }); }
  }

  async function remove(row: AttendanceRow) {
    try {
      await api.del(`/api/attendance/${row.id}`);
      setRows((rs) => rs.filter((r) => r.id !== row.id));
    } catch (e) { patch(row.id, { error: (e as Error).message }); }
  }

  const totals = useMemo(() => ({
    hours: rows.reduce((sum, r) => sum + (r.hours === '' ? 0 : r.hours), 0),
    done: rows.filter((r) => r.done).length,
  }), [rows]);

  return (
    <main className={s.page}>
      <header className={s.header}>
        <h1>Attendance</h1>
        <button className={`${s.btn} ${s.primary}`} onClick={addRow}>Add entry</button>
      </header>

      <p className={s.summary}>
        <span>Entries: <b>{rows.length}</b></span>
        <span>Total hours: <b>{totals.hours}</b></span>
        <span>Tasks done: <b>{totals.done}/{rows.length}</b></span>
      </p>

      {loading ? <div className={s.state}>Loading entries…</div>
        : loadError ? <div className={`${s.state} ${s.errorBox}`}>{loadError} <button className={s.btn} onClick={() => void load()}>Retry</button></div>
        : rows.length === 0 ? <div className={s.state}>No attendance entries yet. Click “Add entry” to log one.</div>
        : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Employee name</th><th>Task</th><th>Date</th><th>Project</th>
                <th>Work mode</th><th>Effort hours</th><th>Task done</th>
                <th><span className={s.srOnly}>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td data-label="Employee name">
                    <input className={s.input} value={r.employee} placeholder="Name" aria-label="Employee name"
                      onChange={(e) => update(r.id, 'employee', e.target.value)} />
                  </td>
                  <td data-label="Task">
                    <input className={s.input} value={r.task} placeholder="What did you work on?" aria-label="Task"
                      onChange={(e) => update(r.id, 'task', e.target.value)} />
                  </td>
                  <td data-label="Date">
                    <input className={s.input} type="date" value={r.date} aria-label="Date"
                      onChange={(e) => update(r.id, 'date', e.target.value)} />
                  </td>
                  <td data-label="Project">
                    <select className={s.select} value={r.project} aria-label="Project"
                      onChange={(e) => update(r.id, 'project', e.target.value as Project)}>
                      {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  <td data-label="Work mode">
                    <select className={s.select} value={r.workMode} aria-label="Work mode"
                      onChange={(e) => update(r.id, 'workMode', e.target.value as WorkMode)}>
                      {Object.values(WorkMode).map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td data-label="Effort hours">
                    <input className={`${s.input} ${s.hoursInput}`} type="number" min={0} max={24} step={0.5}
                      value={r.hours} aria-label="Effort hours" aria-invalid={invalidHours(r.hours)}
                      onChange={(e) => update(r.id, 'hours', e.target.value === '' ? '' : Number(e.target.value))} />
                  </td>
                  <td data-label="Task done" className={s.checkCell}>
                    <input type="checkbox" checked={r.done} aria-label="Task done"
                      onChange={(e) => update(r.id, 'done', e.target.checked)} />
                  </td>
                  <td data-label="">
                    <div className={`${s.actions} ${s.attendanceActions}`}>
                      <button className={`${s.btn} ${s.primary}`} onClick={() => void save(r)} disabled={r.status !== 'draft'}>
                        {r.status === 'saving' ? 'Saving…' : r.status === 'saved' ? 'Saved' : 'Save'}
                      </button>
                      <button className={`${s.btn} ${s.danger}`} onClick={() => void remove(r)} aria-label="Remove entry">Remove</button>
                    </div>
                    {r.error && <p className={s.err} role="alert">{r.error}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}