import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StatsCards from '@/components/StatsCards';
import { Priority, Task } from '@/types/task';

const tasks: Task[] = [
  { id: '1', title: 'Late', description: '', priority: Priority.High, dueDate: '2026-10-07', completed: false },
  { id: '2', title: 'Done', description: '', priority: Priority.Low, dueDate: '2026-10-07', completed: true },
];

describe('StatsCards', () => {
  afterEach(() => vi.useRealTimers());

  it('summarizes total, completed, pending, and overdue tasks', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T12:00:00Z'));
    render(<StatsCards tasks={tasks} />);

    expect(screen.getByRole('region', { name: 'Task summary' })).toBeTruthy();
    expect(screen.getByText('Total tasks').previousSibling?.textContent).toBe('2');
    expect(screen.getByText('Completed').previousSibling?.textContent).toBe('1');
    expect(screen.getByText('Pending').previousSibling?.textContent).toBe('1');
    expect(screen.getByText('Overdue').previousSibling?.textContent).toBe('1');
    expect(screen.getByRole('img', { name: '50% of tasks completed' })).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'High priority tasks' }).getAttribute('aria-valuenow')).toBe('1');
    expect(screen.getByRole('progressbar', { name: 'Medium priority tasks' }).getAttribute('aria-valuenow')).toBe('0');
    expect(screen.getByRole('progressbar', { name: 'Low priority tasks' }).getAttribute('aria-valuenow')).toBe('1');
  });
});