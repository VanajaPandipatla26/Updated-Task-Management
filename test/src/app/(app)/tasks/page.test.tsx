import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskManagement from '@/app/(app)/tasks/page';
import { useMe } from '@/hooks/useMe';
import { useTaskStore } from '@/lib/store';
import { Role } from '@/types/roles';
import { Priority, Status, Task } from '@/types/task';

const state = vi.hoisted(() => ({ tasks: [] as Task[], loading: false, error: null, load: vi.fn(), add: vi.fn(), update: vi.fn(), remove: vi.fn() }));
vi.mock('@/hooks/useMe', () => ({ useMe: vi.fn() }));
vi.mock('@/lib/store', () => ({ useTaskStore: vi.fn(() => state) }));
vi.mock('@/hooks/useDebounce', () => ({ useDebounce: (value: string) => value }));

const task: Task = { id: '1', title: 'Ship search', description: '', priority: Priority.High, dueDate: '2026-10-10', completed: false };

describe('task management page', () => {
  beforeEach(() => {
    state.tasks = [task];
    state.loading = false;
    state.error = null;
    state.load.mockClear();
    state.add.mockClear();
    state.update.mockClear();
    state.remove.mockClear();
    vi.mocked(useMe).mockReturnValue({ me: { username: 'alex', role: Role.Developer, permissions: { access: true, add: true, edit: false, delete: false } }, error: '' });
  });

  it('renders tasks and filters by the search query', () => {
    render(<TaskManagement />);
    expect(screen.getByText('Ship search')).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search tasks' }), { target: { value: 'missing' } });
    expect(screen.getByText('No tasks match your filters.')).toBeTruthy();
  });

  it('shows the access-denied state for users without task access', () => {
    vi.mocked(useMe).mockReturnValue({ me: { username: 'alex', role: Role.HumanResource, permissions: { access: false, add: false, edit: false, delete: false } }, error: '' });
    render(<TaskManagement />);
    expect(screen.getByText(/don’t have access to Task Management/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Add task' })).toBeNull();
  });

  it('creates, updates, filters, sorts, and deletes tasks', async () => {
    vi.mocked(useMe).mockReturnValue({
      me: { username: 'alex', role: Role.Developer, permissions: { access: true, add: true, edit: true, delete: true } },
      error: '',
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<TaskManagement />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Search tasks' }), { target: { value: 'missing' } });
    expect(screen.getByText('No tasks match your filters.')).toBeTruthy();
    fireEvent.change(screen.getByRole('textbox', { name: 'Search tasks' }), { target: { value: 'ship' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), { target: { value: Status.Completed } });
    expect(screen.getByText('No tasks match your filters.')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by status' }), { target: { value: 'all' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by priority' }), { target: { value: Priority.Low } });
    expect(screen.getByText('No tasks match your filters.')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox', { name: 'Filter by priority' }), { target: { value: 'all' } });
    fireEvent.click(screen.getByRole('button', { name: /Due date/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: '  New task  ' } });
    fireEvent.change(screen.getByLabelText(/Due date/), { target: { value: '2026-10-12' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save task' }));
    await waitFor(() => expect(state.add).toHaveBeenCalledWith(expect.objectContaining({ title: 'New task' })));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Mark "Ship search" complete' }));
    await waitFor(() => expect(state.update).toHaveBeenCalledWith('1', { completed: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'Updated task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save task' }));
    await waitFor(() => expect(state.update).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Updated task' })));

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(state.remove).toHaveBeenCalledWith('1'));
  });
});