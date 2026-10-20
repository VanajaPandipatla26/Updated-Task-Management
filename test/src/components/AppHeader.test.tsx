import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';
import { useMe } from '@/hooks/useMe';
import { Role } from '@/types/roles';

const { replace, refresh } = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));

vi.mock('@/hooks/useMe', () => ({ useMe: vi.fn() }));
vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));

describe('AppHeader', () => {
  beforeEach(() => {
    vi.mocked(useMe).mockReturnValue({
      me: { username: 'alice', role: Role.Developer, permissions: { access: true, add: true, edit: false, delete: false } },
      error: '',
    });
    vi.mocked(api.post).mockResolvedValue({ ok: true });
  });

  it('shows the username initial and logs out from the profile menu', async () => {
    render(<AppHeader />);

    expect(screen.getByRole('link', { name: 'Programming.com' })).toBeTruthy();
    const profileButton = screen.getByRole('button', { name: 'Open profile menu' });
    expect(profileButton.textContent).toBe('A');
    expect(screen.queryByRole('button', { name: 'Log out' })).toBeNull();

    fireEvent.click(profileButton);
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

    expect(api.post).toHaveBeenCalledWith('/api/logout');
    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/login');
      expect(refresh).toHaveBeenCalled();
    });
  });
});