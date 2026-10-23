import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from '../src/proxy';
import { createSession } from '@/lib/session';

const request = (path: string, token?: string) => new NextRequest(`http://localhost${path}`, {
  headers: token ? { cookie: `auth=${token}` } : undefined,
});

describe('authentication middleware', () => {
  it('rejects forged cookies for pages and protected APIs', () => {
    const page = proxy(request('/dashboard', 'forged-token'));
    expect(page.headers.get('location')).toBe('http://localhost/login');

    const api = proxy(request('/api/tasks', 'forged-token'));
    expect(api.status).toBe(401);
  });

  it('allows signed sessions and public authentication endpoints', () => {
    expect(proxy(request('/api/tasks', createSession('member'))).status).toBe(200);
    expect(proxy(request('/api/login')).status).toBe(200);
    expect(proxy(request('/api/register')).status).toBe(200);
  });
});