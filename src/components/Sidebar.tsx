'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, ContactRound, FileText, LayoutDashboard, ListTodo, ShieldCheck } from 'lucide-react';
import s from '@/styles/ui.module.css';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Task Management', icon: ListTodo },
  { href: '/attendance', label: 'Attendance', icon: CalendarDays },
  { href: '/payroll', label: 'Documents', icon: FileText },
  { href: '/administration', label: 'Administration', icon: ShieldCheck },
  { href: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { href: '/contact', label: 'Contact', icon: ContactRound },
];

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={s.sidebar} aria-label="Main navigation">
      <ul className={s.navList}>
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <li key={l.href}>
            <Link
              href={l.href}
              className={`${s.navLink} ${isActive(l.href) ? s.navActive : ''}`}
              aria-current={isActive(l.href) ? 'page' : undefined}
            >
              <Icon className={s.navIcon} size={18} aria-hidden="true" />
              <span>{l.label}</span>
            </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}