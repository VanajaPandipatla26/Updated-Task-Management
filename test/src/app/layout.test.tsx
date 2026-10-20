import { describe, expect, it } from 'vitest';
import RootLayout, { metadata } from '@/app/layout';

describe('root layout', () => {
  it('sets document language, font class, and site metadata', () => {
    const element = RootLayout({ children: 'content' });
    expect(element.props.lang).toBe('en');
    expect(element.props.children.props.className).toBe('font-body');
    expect(metadata.description).toContain('task dashboard');
  });
});