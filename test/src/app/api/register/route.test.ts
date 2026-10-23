import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/register/route';
import { findUser } from '@/lib/users';

const request = (body: unknown) => new Request('http://localhost/api/register', { method: 'POST', body: JSON.stringify(body) });

describe('registration route', () => {
  it('enforces username and password requirements and rejects duplicates', async () => {
    expect((await POST(request({ username: 'ab', password: 'long-enough' }))).status).toBe(400);
    expect((await POST(request({ username: 'valid-name', password: 'short' }))).status).toBe(400);

    const username = `new-${crypto.randomUUID().slice(0, 8)}`;
    expect((await POST(request({ username, password: 'long-enough' }))).status).toBe(201);
    expect(findUser(username)).toBeDefined();
    expect((await POST(request({ username, password: 'long-enough' }))).status).toBe(409);
    expect((await POST(request({ username: 'invalid name', password: 'long-enough' }))).status).toBe(400);
    expect((await POST(request({ username: 'other-user', password: 'short' }))).status).toBe(400);
    expect((await POST(request({ username: 42, password: 'long-enough' }))).status).toBe(400);
  });
});