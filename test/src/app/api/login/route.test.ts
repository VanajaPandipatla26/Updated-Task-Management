import { beforeEach, describe, expect, it } from 'vitest';
import { POST } from '@/app/api/login/route';
import { createUser, findUser } from '@/lib/users';
import { createSession, readSession } from '@/lib/session';

const request = (body: unknown) => new Request('http://localhost/api/login', { method: 'POST', body: JSON.stringify(body) });

describe('login route', () => {
  beforeEach(() => {
    if (!findUser('login-test')) createUser('login-test', 'password123');
  });

  it('sets a signed HttpOnly auth cookie for valid credentials and rejects invalid credentials', async () => {
    const success = await POST(request({ username: ' LOGIN-TEST ', password: 'password123' }));
    expect(success.status).toBe(200);
    const cookie = success.headers.get('set-cookie') ?? '';
    const token = cookie.match(/auth=([^;]+)/)?.[1];
    expect(token).toBeTruthy();
    expect(token).not.toContain('login-test');
    expect(readSession(token)).toBe('login-test');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=strict');

    expect((await POST(request({ username: 'login-test', password: 'bad' }))).status).toBe(401);
    expect((await POST(new Request('http://localhost/api/login', { method: 'POST', body: '{' }))).status).toBe(400);
  });

  it('rejects modified session tokens', () => {
    const session = createSession('login-test');
    expect(readSession(`${session.slice(0, -1)}x`)).toBeUndefined();
  });
});