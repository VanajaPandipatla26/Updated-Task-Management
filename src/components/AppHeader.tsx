'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMe } from '@/hooks/useMe';
import { api } from '@/lib/api';
import s from '@/styles/ui.module.css';

export default function AppHeader() {
  const { me } = useMe();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const initial = me?.username.trim().charAt(0).toUpperCase() || '?';

  async function logout() {
    await api.post('/api/logout');
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className={s.appHeader}>
      <Link className={s.appBrand} href="/dashboard">
        <svg className={s.appBrandIcon} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="brand-mark-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#35c5dc" />
              <stop offset="100%" stopColor="#b453c4" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#brand-mark-gradient)" strokeLinecap="round" strokeWidth="3.8">
            <path d="M5 14a27 27 0 0 1 38 0" />
            <path d="M10 21a20 20 0 0 1 28 0" />
            <path d="M16 28a11 11 0 0 1 16 0" />
          </g>
          <circle cx="24" cy="36" r="2.6" fill="url(#brand-mark-gradient)" />
        </svg>
        <span>Programming.com</span>
      </Link>
      <div className={s.profile}>
        <button
          className={s.profileButton}
          type="button"
          aria-label="Open profile menu"
          aria-expanded={menuOpen}
          aria-haspopup="true"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {initial}
        </button>
        {menuOpen && (
          <div className={s.profileMenu}>
            <button type="button" onClick={logout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}