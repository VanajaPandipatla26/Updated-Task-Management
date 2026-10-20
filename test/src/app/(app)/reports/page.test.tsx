import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReportsPage from '@/app/(app)/reports/page';
import { api } from '@/lib/api';
import { useTaskStore } from '@/lib/store';
import { Priority, Task } from '@/types/task';

const state = vi.hoisted(() => ({
  tasks: [] as Task[], loading: false, error: null as string | null, load: vi.fn(),
  add: vi.fn(), update: vi.fn(), remove: vi.fn(),
}));

vi.mock('@/lib/store', () => ({ useTaskStore: vi.fn(() => state) }));
vi.mock('@/lib/api', () => ({ api: { get: vi.fn().mockResolvedValue([]) } }));

describe('reports page', () => {
  beforeEach(() => {
    state.tasks = [{ id: 't1', title: 'Prepare release', description: '', priority: Priority.High, dueDate: `${new Date().toISOString().slice(0, 7)}-20`, completed: true }];
    state.loading = false;
    state.error = null;
    state.load.mockClear();
    vi.mocked(api.get).mockResolvedValue([]);
  });

  it('shows task reports and switches between report tabs', async () => {
    render(<ReportsPage />);

    expect(screen.getByRole('tablist', { name: 'Reports' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download' })).toBeTruthy();
    expect(await screen.findByText('Tasks completed')).toBeTruthy();
    expect(api.get).toHaveBeenCalledWith('/api/attendance');

    fireEvent.click(screen.getByRole('tab', { name: 'Task report' }));
    expect(screen.getByRole('tab', { name: 'Task report' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Task report' })).toBeTruthy();
    expect(screen.getByText('Prepare release')).toBeTruthy();
  });
});