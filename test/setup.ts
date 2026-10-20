import { cleanup } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) =>
		createElement('a', { href, ...props }, children),
}));

vi.mock('next/navigation', () => ({
	usePathname: () => '/',
	useRouter: () => ({ replace: vi.fn(), refresh: vi.fn(), push: vi.fn() }),
	notFound: () => { throw new Error('NEXT_NOT_FOUND'); },
}));

vi.mock('next/font/google', () => ({
	Public_Sans: () => ({ variable: 'font-body' }),
}));

afterEach(() => cleanup());