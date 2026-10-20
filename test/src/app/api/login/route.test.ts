import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/login/route';

const request = (body: unknown) => new Request('http://localhost/api/login', { method: 'POST', body: JSON.stringify(body) });

describe('login route', () => {
  it('sets an HttpOnly auth cookie for valid credentials and rejects invalid credentials', async () => {
    const success = await POST(request({ username: ' DEMO ', password: 'password123' }));
    expect(success.status).toBe(200);
    expect(success.headers.get('set-cookie')).toContain('auth=demo');
    expect(success.headers.get('set-cookie')).toContain('HttpOnly');

    expect((await POST(request({ username: 'demo', password: 'bad' }))).status).toBe(401);
  });
});