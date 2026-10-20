import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TaskItem from '@/components/TaskItem';
import { Priority, Task } from '@/types/task';

const task: Task = { id: 'task-7', title: 'Ship feature', description: '', priority: Priority.High, dueDate: '2026-10-08', completed: false };

describe('TaskItem', () => {
  it('shows the detail link and only the actions allowed by permissions', () => {
    render(<TaskItem task={task} canEdit onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} canDelete={false} />);

    expect(screen.getByRole('link', { name: 'Ship feature' }).getAttribute('href')).toBe('/tasks/task-7');
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });

  it('calls the relevant callback when toggled or edited', () => {
    const onToggle = vi.fn();
    const onEdit = vi.fn();
    render(<TaskItem task={task} canEdit canDelete={false} onToggle={onToggle} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onToggle).toHaveBeenCalledWith(task);
    expect(onEdit).toHaveBeenCalledWith(task);
  });
});