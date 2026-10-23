'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import s from '@/styles/ui.module.css';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!/^[a-zA-Z0-9_-]{3,32}$/.test(username.trim())) return setError('Username must be 3-32 letters, numbers, underscores, or hyphens.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (password.length < 8 || password.length > 128) return setError('Password must be 8-128 characters.');
    setBusy(true); setError('');
    try { await api.post('/api/register', { username, password }); setDone(true); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }

  if (done)
    return (
      <div className={s.center}>
        <div className={s.modal}>
          <h2>Account created</h2>
          <p className={s.meta}>You can now sign in as <b>{username.trim()}</b>.</p>
          <Link href="/login" className={`${s.btn} ${s.primary} ${s.linkBtn}`}>Go to sign in</Link>
        </div>
      </div>
    );

  return (
    <div className={s.center}>
      <form className={s.modal} onSubmit={submit} noValidate>
        <h2>Create account</h2>
        <label className={s.field}>Username
          <input className={s.input} value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
        </label>
        <label className={s.field}>Password
          <input className={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </label>
        <label className={s.field}>Confirm password
          <input className={s.input} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </label>
        {error && <p className={s.err} role="alert">{error}</p>}
        <button className={`${s.btn} ${s.primary}`} disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        <p className={s.meta}>Already registered? <Link href="/login">Sign in</Link></p>
      </form>
    </div>
  );
}