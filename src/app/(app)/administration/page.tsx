'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  PERMISSION_ROWS, PermissionKey, Permissions, Role, ROLE_LABELS, RoleAssignment, RolesPayload,
} from '@/types/roles';
import s from '@/styles/ui.module.css';

export default function AdministrationPage() {
  const [data, setData] = useState<RolesPayload | null>(null);
  const [loadError, setLoadError] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>(Role.Developer);
  const [perms, setPerms] = useState<Permissions | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const d = await api.get<RolesPayload>('/api/roles');
      setData(d); setPerms(d.permissions[Role.Developer]);
    } catch (e) { setLoadError((e as Error).message); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function changeRole(next: Role) {
    setRole(next); setError(''); setNotice('');
    if (data) setPerms(data.permissions[next]);
  }
  function setPerm(key: PermissionKey, value: boolean) {
    setPerms((p) => {
      if (!p) return p;
      if (key === 'access' && !value) return { access: false, add: false, edit: false, delete: false };
      return { ...p, [key]: value };
    });
  }

  function startEdit(a: RoleAssignment) {
    if (!data) return;
    setEditingUser(a.username); setUsername(a.username); setRole(a.role);
    setPerms(data.permissions[a.role]); setError(''); setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function cancelEdit() {
    setEditingUser(null); setUsername(''); setRole(Role.Developer);
    if (data) setPerms(data.permissions[Role.Developer]);
    setError(''); setNotice('');
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!perms) return;
    const name = username.trim();
    setSaving(true); setError(''); setNotice('');
    try {
      setData(await api.put<RolesPayload>('/api/roles', {
        username: name, role, permissions: perms, mode: editingUser ? 'update' : 'create',
      }));
      setNotice(
        editingUser ? `${name} updated to ${ROLE_LABELS[role]}.`
        : name ? `${name} is now ${ROLE_LABELS[role]}. Permissions for this role are saved.`
        : `Permissions for ${ROLE_LABELS[role]} are saved.`,
      );
      setEditingUser(null); setUsername('');
    } catch (err) { setError((err as Error).message); }
    setSaving(false);
  }

  return (
    <main className={s.page}>
      <header className={s.header}><h1>User Role Access Management</h1></header>

      {loadError ? <div className={`${s.state} ${s.errorBox}`}>{loadError} <button className={s.btn} onClick={() => void load()}>Retry</button></div>
        : !data || !perms ? <div className={s.state}>Loading…</div>
        : (
        <>
          <form className={s.panel} onSubmit={save} noValidate>
            {editingUser && <p className={s.meta}>Editing <b>{editingUser}</b></p>}
            <div className={s.formRow}>
              <label className={s.field}>Username
                <input className={s.input} value={username} placeholder="Registered username"
                  readOnly={editingUser !== null} autoComplete="off"
                  onChange={(e) => { setUsername(e.target.value); setError(''); }} />
              </label>
              <label className={s.field}>Role
                <select className={s.select} value={role} onChange={(e) => changeRole(e.target.value as Role)}>
                  {Object.values(Role).map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </label>
            </div>

            <fieldset className={s.perms}>
              <legend>Task Management permissions for {ROLE_LABELS[role]}</legend>
              {PERMISSION_ROWS.map((row) => {
                const disabled = row.key !== 'access' && !perms.access;
                return (
                  <div key={row.key} className={s.permRow}>
                    <span>{row.label}</span>
                    <div className={s.radios} role="radiogroup" aria-label={row.label}>
                      <label><input type="radio" name={row.key} checked={perms[row.key]} disabled={disabled} onChange={() => setPerm(row.key, true)} /> Yes</label>
                      <label><input type="radio" name={row.key} checked={!perms[row.key]} disabled={disabled} onChange={() => setPerm(row.key, false)} /> No</label>
                    </div>
                  </div>
                );
              })}
            </fieldset>

            {error && <p className={s.err} role="alert">{error}</p>}
            {notice && <p className={s.ok} role="status">{notice}</p>}
            <div className={s.row}>
              {editingUser && <button type="button" className={s.btn} onClick={cancelEdit}>Cancel</button>}
              <button className={`${s.btn} ${s.primary}`} disabled={saving}>
                {saving ? 'Saving…' : editingUser ? 'Update' : 'Save'}
              </button>
            </div>
          </form>

          <h2 className={s.sectionTitle}>Assigned users</h2>
          {data.assignments.length === 0
            ? <div className={s.state}>No users assigned yet. Everyone defaults to Developer.</div>
            : <ul className={s.assigned}>{data.assignments.map((a) => (
                <li key={a.username}>
                  <span>{a.username}</span>
                  <div className={s.actions}>
                    <span className={s.badge}>{ROLE_LABELS[a.role]}</span>
                    <button className={s.btn} onClick={() => startEdit(a)}>Edit</button>
                  </div>
                </li>
              ))}</ul>}
        </>
      )}
    </main>
  );
}