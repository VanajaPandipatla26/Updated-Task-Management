import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/register/route';
import { findUser } from '@/lib/users';

const request = (body: unknown) => new Request('http://localhost/api/register', { method: 'POST', body: JSON.stringify(body) });

describe('registration route', () => {
  it('enforces username and password requirements and rejects duplicates', async () => {
    expect((await POST(request({ username: 'ab', password: 'long-enough' }))).status).toBe(400);
    expect((await POST(request({ username: 'valid-name', password: 'short' }))).status).toBe(400);

    const username = `new-${crypto.randomUUID()}`;
    expect((await POST(request({ username, password: 'long-enough' }))).status).toBe(201);
    expect(findUser(username)).toBeDefined();
    expect((await POST(request({ username, password: 'long-enough' }))).status).toBe(409);
  });
});