import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Dashboard from '@/app/(app)/dashboard/page';
import HomePage from '@/app/(app)/page';
import { useTaskStore } from '@/lib/store';
import { redirect } from 'next/navigation';

const state = vi.hoisted(() => ({ tasks: [], loading: true, error: null, load: vi.fn() }));
vi.mock('@/lib/store', () => ({ useTaskStore: vi.fn(() => state) }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

describe('dashboard page', () => {
  beforeEach(() => {
    state.tasks = [];
    state.loading = true;
    state.error = null;
    state.load.mockClear();
  });

  it('loads task data and shows its loading state', () => {
    render(<Dashboard />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByText('Loading…')).toBeTruthy();
    expect(state.load).toHaveBeenCalledOnce();
  });

  it('redirects the root page to login', () => {
    HomePage();
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});