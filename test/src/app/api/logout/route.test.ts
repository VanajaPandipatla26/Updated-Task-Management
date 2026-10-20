import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/logout/route';

describe('logout route', () => {
  it('returns success and clears the auth cookie', async () => {
    const response = await POST();
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('auth=;');
  });
});