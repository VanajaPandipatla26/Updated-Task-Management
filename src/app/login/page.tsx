'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import s from '@/styles/ui.module.css';


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return setError('Enter your username and password.');
    setBusy(true); setError('');
    try { await api.post('/api/login', { username, password }); router.replace('/dashboard'); router.refresh(); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }

  return (
    <div className={s.center}>
      <form className={s.modal} onSubmit={submit} noValidate>
        <h2>Sign in</h2>
        <p className={s.meta}>Demo account: <code>demo</code> / <code>password123</code>, or register your own.</p>
        <label className={s.field}>Username
          <input className={s.input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label className={s.field}>Password
          <input className={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className={s.err} role="alert">{error}</p>}
        <button className={`${s.btn} ${s.primary}`} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link href="/register" className={`${s.btn} ${s.linkBtn}`}>Register</Link>
      </form>
    </div>
  );
}
