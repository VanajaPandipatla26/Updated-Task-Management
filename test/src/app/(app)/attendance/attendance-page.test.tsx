import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AttendancePage from '@/app/(app)/attendance/attendance-page';
import { api } from '@/lib/api';
import { WorkMode } from '@/types/attendance';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), put: vi.fn(), del: vi.fn() } }));

describe('attendance page', () => {
  it('creates a draft row, validates it, and saves valid entries', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([]);
    vi.mocked(api.put).mockResolvedValue({ id: 'entry-1' });
    render(<AttendancePage />);

    await screen.findByLabelText('Employee name');
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByRole('alert')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Employee name'), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText('Task'), { target: { value: 'Planning' } });
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-10-08' } });
    fireEvent.change(screen.getByLabelText('Effort hours'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(api.put).toHaveBeenCalledWith(expect.stringMatching(/^\/api\/attendance\//), expect.objectContaining({ employee: 'Alex', task: 'Planning', hours: 2 })));
  });

  it('edits a saved entry, adds a draft, and removes the saved entry', async () => {
    vi.mocked(api.get).mockResolvedValueOnce([{
      id: 'entry-1', employee: 'Alex', task: 'Planning', date: '2026-10-08',
      project: 'Internal', workMode: WorkMode.Office, hours: 2, done: false,
    }]);
    vi.mocked(api.put).mockResolvedValue({ id: 'entry-1' });
    vi.mocked(api.del).mockResolvedValue(undefined);
    render(<AttendancePage />);

    await screen.findByLabelText('Employee name');
    fireEvent.change(screen.getByLabelText('Project'), { target: { value: 'Project Alpha' } });
    fireEvent.change(screen.getByLabelText('Work mode'), { target: { value: WorkMode.Remote } });
    fireEvent.change(screen.getByLabelText('Effort hours'), { target: { value: '3' } });
    fireEvent.click(screen.getByLabelText('Task done'));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(api.put).toHaveBeenCalledWith('/api/attendance/entry-1', expect.objectContaining({
      project: 'Project Alpha', workMode: WorkMode.Remote, hours: 3, done: true,
    })));
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    expect(screen.getByText('Entries:').parentElement?.textContent).toContain('2');
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove entry' })[0]);

    await waitFor(() => expect(api.del).toHaveBeenCalledWith('/api/attendance/entry-1'));
    expect(screen.getByText('Entries:').parentElement?.textContent).toContain('1');
  });
});