import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import s from '@/styles/ui.module.css';

export const dynamic = 'force-dynamic'; // SSR: always read the latest task

type Props = { params: { id: string } };
const find = (id: string) => db.find((t) => t.id === id);

export function generateMetadata({ params }: Props): Metadata {
  const task = find(params.id);
  return { title: task ? task.title : 'Task not found' };
}

export default function TaskDetail({ params }: Props) {
  const task = find(params.id);
  if (!task) notFound();
  return (
    <main className={s.page}>
      <Link href="/dashboard">← Back to dashboard</Link>
      <h1>{task.title}</h1>
      <p>{task.description || 'No description.'}</p>
      <p className={s.meta}>{task.priority} priority · due {task.dueDate} · {task.completed ? 'Completed' : 'Pending'}</p>
    </main>
  );
}
