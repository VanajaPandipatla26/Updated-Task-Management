'use client';
import { FormEvent, useState } from 'react';
import { Priority, Task, TaskInput } from '@/types/task';
import s from '@/styles/ui.module.css';

interface Props { initial?: Task; onSubmit: (input: TaskInput) => Promise<void>; onCancel: () => void; }
type Errors = Partial<Record<'title' | 'dueDate' | 'form', string>>;

export default function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [v, setV] = useState<TaskInput>({
    title: initial?.title ?? '', description: initial?.description ?? '',
    priority: initial?.priority ?? Priority.Medium, dueDate: initial?.dueDate ?? '', completed: initial?.completed ?? false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof TaskInput>(k: K, val: TaskInput[K]) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {};
    if (v.title.trim().length < 3) next.title = 'Title must be at least 3 characters.';
    if (!v.dueDate) next.dueDate = 'Choose a due date.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await onSubmit({ ...v, title: v.title.trim() }); onCancel(); }
    catch (err) { setErrors({ form: (err as Error).message }); setBusy(false); }
  }

  return (
    <div className={s.overlay} role="dialog" aria-modal="true">
      <form className={s.modal} onSubmit={submit} noValidate>
        <h2>{initial ? 'Edit task' : 'New task'}</h2>
        <label className={s.field}>Title
          <input className={s.input} value={v.title} onChange={(e) => set('title', e.target.value)} autoFocus />
          {errors.title && <span className={s.err}>{errors.title}</span>}
        </label>
        <label className={s.field}>Description
          <textarea className={s.textarea} rows={3} value={v.description} onChange={(e) => set('description', e.target.value)} />
        </label>
        <label className={s.field}>Priority
          <select className={s.select} value={v.priority} onChange={(e) => set('priority', e.target.value as Priority)}>
            {Object.values(Priority).map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        <label className={s.field}>Due date
          <input className={s.input} type="date" value={v.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
          {errors.dueDate && <span className={s.err}>{errors.dueDate}</span>}
        </label>
        {errors.form && <p className={s.err} role="alert">{errors.form}</p>}
        <div className={s.row}>
          <button type="button" className={s.btn} onClick={onCancel}>Cancel</button>
          <button className={`${s.btn} ${s.primary}`} disabled={busy}>{busy ? 'Saving…' : 'Save task'}</button>
        </div>
      </form>
    </div>
  );
}
