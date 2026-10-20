import { afterEach, describe, expect, it, vi } from 'vitest';
import { isOverdue, today } from '@/lib/date';
import { Priority, Task } from '@/types/task';

const task = (dueDate: string, completed = false): Task => ({
  id: 'task-1',
  title: 'Test task',
  description: '',
  priority: Priority.Medium,
  dueDate,
  completed,
});

describe('date helpers', () => {
  afterEach(() => vi.useRealTimers());

  it('returns the current date in YYYY-MM-DD form', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T12:00:00.000Z'));

    expect(today()).toBe('2026-10-08');
  });

  it('marks only incomplete tasks with past due dates as overdue', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-08T12:00:00.000Z'));

    expect(isOverdue(task('2026-10-07'))).toBe(true);
    expect(isOverdue(task('2026-10-08'))).toBe(false);
    expect(isOverdue(task('2026-10-07', true))).toBe(false);
  });
});