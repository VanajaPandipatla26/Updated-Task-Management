import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Sidebar from '@/components/Sidebar';

vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }));

describe('Sidebar', () => {
  it('renders navigation', () => {
    render(<Sidebar />);

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('href')).toBe('/dashboard');
    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', { name: 'Task Management' }).getAttribute('href')).toBe('/tasks');
    expect(screen.getByRole('link', { name: 'Documents' }).getAttribute('href')).toBe('/payroll');
    expect(screen.queryByRole('link', { name: 'Payroll' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Contact' }).getAttribute('href')).toBe('/contact');
    for (const link of screen.getAllByRole('link')) {
      expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    }
  });
});