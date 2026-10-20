import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppLayout from '@/app/(app)/layout';

describe('authenticated app layout', () => {
  it('renders a full-width header above the sidebar and page content', () => {
    render(<AppLayout><h1>Page content</h1></AppLayout>);
    const header = screen.getByRole('banner');
    const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
    const content = screen.getByRole('heading', { name: 'Page content' });

    expect(header.parentElement?.firstElementChild).toBe(header);
    expect(header.compareDocumentPosition(navigation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(navigation.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});