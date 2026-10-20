import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/login/page';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));
const router = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

describe('login page', () => {
  it('validates empty fields and submits entered credentials', async () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert').textContent).toContain('Enter your username and password.');

    vi.mocked(api.post).mockResolvedValueOnce({ ok: true });
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'alex' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(api.post).toHaveBeenCalledWith('/api/login', { username: 'alex', password: 'secret' });
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/dashboard'));
    expect(router.refresh).toHaveBeenCalledOnce();
  });
});