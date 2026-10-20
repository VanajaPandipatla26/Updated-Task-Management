'use client';
import { useEffect, useMemo, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { useDebounce } from '@/hooks/useDebounce';
import { useMe } from '@/hooks/useMe';
import { Filter, Priority, Status, Task } from '@/types/task';
import { ROLE_LABELS } from '@/types/roles';
import TaskForm from '@/components/TaskForm';
import TaskItem from '@/components/TaskItem';
import s from '@/styles/ui.module.css';

export default function TaskManagement() {
  const { me, error: meError } = useMe();
  const { tasks, loading, error, load, add, update, remove } = useTaskStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<Filter<Status>>('all');
  const [priority, setPriority] = useState<Filter<Priority>>('all');
  const [asc, setAsc] = useState(true);
  const [editing, setEditing] = useState<Task | 'new' | null>(null);
  const [actionError, setActionError] = useState('');
  const q = useDebounce(query.trim().toLowerCase());

  useEffect(() => { if (me?.permissions.access) void load(); }, [me, load]);

  const visible = useMemo(() => tasks
    .filter((t) => t.title.toLowerCase().includes(q))
    .filter((t) => status === 'all' || t.completed === (status === Status.Completed))
    .filter((t) => priority === 'all' || t.priority === priority)
    .sort((a, b) => (asc ? 1 : -1) * a.dueDate.localeCompare(b.dueDate)), [tasks, q, status, priority, asc]);

  const run = async (fn: () => Promise<void>) => {
    setActionError('');
    try { await fn(); } catch (e) { setActionError((e as Error).message); }
  };

  if (meError) return <main className={s.page}><div className={`${s.state} ${s.errorBox}`}>{meError}</div></main>;
  if (!me) return <main className={s.page}><div className={s.state}>Loading…</div></main>;
  const can = me.permissions;
  if (!can.access)
    return (
      <main className={s.page}>
        <header className={s.header}><h1>Task management</h1></header>
        <div className={s.state}>You don’t have access to Task Management. Ask an administrator to update your role.</div>
      </main>
    );

  return (
    <main className={s.page}>
      <header className={s.header}>
        <div>
          <h1>Task management</h1>
          <p className={s.meta}>Signed in as {me.username} · {ROLE_LABELS[me.role]}</p>
        </div>
        {can.add && <button className={`${s.btn} ${s.primary}`} onClick={() => setEditing('new')}>Add task</button>}
      </header>

      <div className={s.toolbar}>
        <input className={s.input} placeholder="Search by task name" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search tasks" />
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value as Filter<Status>)} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {Object.values(Status).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <select className={s.select} value={priority} onChange={(e) => setPriority(e.target.value as Filter<Priority>)} aria-label="Filter by priority">
          <option value="all">All priorities</option>
          {Object.values(Priority).map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
        <button className={s.btn} onClick={() => setAsc((a) => !a)}>Due date {asc ? '↑' : '↓'}</button>
      </div>

      {actionError && <p className={s.err} role="alert">{actionError}</p>}
      {loading ? <div className={s.state}>Loading tasks…</div>
        : error ? <div className={`${s.state} ${s.errorBox}`}>{error} <button className={s.btn} onClick={() => void load()}>Retry</button></div>
        : visible.length === 0 ? <div className={s.state}>{tasks.length ? 'No tasks match your filters.' : 'No tasks yet.'}</div>
        : <ul className={s.list}>{visible.map((t) => (
            <TaskItem key={t.id} task={t} canEdit={can.edit} canDelete={can.delete}
              onToggle={(x) => run(() => update(x.id, { completed: !x.completed }))}
              onEdit={setEditing}
              onDelete={(x) => confirm(`Delete "${x.title}"?`) && run(() => remove(x.id))} />
          ))}</ul>}

      {editing && (
        <TaskForm initial={editing === 'new' ? undefined : editing}
          onSubmit={(input) => (editing === 'new' ? add(input) : update(editing.id, input))}
          onCancel={() => setEditing(null)} />
      )}
    </main>
  );
}