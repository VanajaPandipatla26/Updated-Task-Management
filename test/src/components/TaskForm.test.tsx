import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TaskForm from '@/components/TaskForm';
import { Priority } from '@/types/task';

describe('TaskForm', () => {
  it('validates required fields and submits trimmed task data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onCancel = vi.fn();
    render(<TaskForm onSubmit={onSubmit} onCancel={onCancel} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save task' }));
    expect(screen.getByText('Title must be at least 3 characters.')).toBeTruthy();
    expect(screen.getByText('Choose a due date.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: '  Ship feature  ' } });
    fireEvent.change(screen.getByLabelText(/Due date/), { target: { value: '2026-10-10' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: Priority.High } });
    fireEvent.click(screen.getByRole('button', { name: 'Save task' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship feature', description: '', priority: Priority.High, dueDate: '2026-10-10', completed: false,
    }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('shows submission failures and keeps the dialog open', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Could not save'));
    render(<TaskForm onSubmit={onSubmit} onCancel={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'Ship feature' } });
    fireEvent.change(screen.getByLabelText(/Due date/), { target: { value: '2026-10-10' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save task' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Could not save');
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});