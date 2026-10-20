import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RegisterPage from '@/app/register/page';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));

describe('register page', () => {
  it('rejects mismatched passwords before sending a request', () => {
    render(<RegisterPage />);
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'alex' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret1' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'secret2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(screen.getByRole('alert').textContent).toContain('Passwords do not match.');
    expect(api.post).not.toHaveBeenCalled();
  });
});