'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useTaskStore } from '@/lib/store';
import StatsCards from '@/components/StatsCards';
import s from '@/styles/ui.module.css';

export default function Dashboard() {
  const { tasks, loading, error, load } = useTaskStore();
  useEffect(() => { void load(); }, [load]);

  return (
    <main className={s.page}>
      <header className={s.header}>
        <h1>Dashboard</h1>
        <Link href="/tasks" className={`${s.btn} ${s.primary}`}>Manage tasks</Link>
      </header>
      {loading ? <div className={s.state}>Loading…</div>
        : error ? <div className={`${s.state} ${s.errorBox}`}>{error} <button className={s.btn} onClick={() => void load()}>Retry</button></div>
        : <StatsCards tasks={tasks} />}
    </main>
  );
}