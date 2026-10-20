import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ContactPage from '@/app/(app)/contact/page';

describe('Contact page', () => {
  it('shows office locations and contact details', () => {
    render(<ContactPage />);

    expect(screen.getByRole('heading', { name: 'Find us in your vicinity.' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'New York, NY' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Call us' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'hr@programming.com' }).getAttribute('href')).toBe('mailto:hr@programming.com');
  });
});