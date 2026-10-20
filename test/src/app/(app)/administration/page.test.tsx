import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AdministrationPage from '@/app/(app)/administration/page';
import { api } from '@/lib/api';
import { Role } from '@/types/roles';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), put: vi.fn() } }));

const permissions = Object.fromEntries(Object.values(Role).map((role) => [role, { access: true, add: true, edit: true, delete: true }])) as never;

describe('administration page', () => {
  it('loads role permissions and renders the role editor', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ assignments: [], permissions });
    render(<AdministrationPage />);

    expect(await screen.findByRole('heading', { name: 'User Role Access Management' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Role' })).toBeTruthy();
    expect(screen.getByText(/Everyone defaults to Developer/)).toBeTruthy();
  });

  it('updates role permissions and supports editing and cancelling an assignment', async () => {
    const payload = {
      assignments: [{ username: 'alex', role: Role.Developer }],
      permissions,
    };
    vi.mocked(api.get).mockResolvedValueOnce(payload);
    vi.mocked(api.put).mockResolvedValueOnce(payload);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    render(<AdministrationPage />);

    await screen.findByRole('heading', { name: 'User Role Access Management' });
    fireEvent.change(screen.getByRole('combobox', { name: 'Role' }), { target: { value: Role.HumanResource } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Username' }), { target: { value: ' alex ' } });

    const access = within(screen.getByRole('radiogroup', { name: 'Access to Task Management' }));
    fireEvent.click(access.getByLabelText('No'));
    fireEvent.click(access.getByLabelText('Yes'));
    fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Add task' })).getByLabelText('No'));
    fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Edit task' })).getByLabelText('No'));
    fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Delete task' })).getByLabelText('Yes'));
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(api.put).toHaveBeenCalledWith('/api/roles', {
      username: 'alex', role: Role.HumanResource,
      permissions: { access: true, add: false, edit: false, delete: true }, mode: 'create',
    }));
    expect(await screen.findByRole('status')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByText(/Editing/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText(/Editing/)).toBeNull();
  });
});