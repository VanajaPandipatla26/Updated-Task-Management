import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/error';

describe('error boundary', () => {
  it('displays the error and invokes the recovery callback', () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error('Failed to load')} reset={reset} />);
    expect(screen.getByText('Failed to load')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledOnce();
  });
});