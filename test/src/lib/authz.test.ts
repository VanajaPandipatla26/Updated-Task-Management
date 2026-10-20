import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cookies } from 'next/headers';
import { currentUser, forbid } from '@/lib/authz';
import { Role } from '@/types/roles';
import { rolesDb } from '@/lib/rolesDb';

vi.mock('next/headers', () => ({ cookies: vi.fn() }));

describe('authorization helpers', () => {
  beforeEach(() => {
    rolesDb.assignments['auth-test'] = { username: 'auth-test', role: Role.ProductOwner };
    vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: 'auth-test' }) } as never);
  });

  it('builds the current user from the auth cookie and role permissions', async () => {
    await expect(currentUser()).resolves.toEqual({
      username: 'auth-test', role: Role.ProductOwner, permissions: rolesDb.permissions[Role.ProductOwner],
    });
  });

  it('returns a 403 response for forbidden actions', async () => {
    const response = forbid('edit tasks');
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ error: 'Your role does not allow you to edit tasks.' });
    delete rolesDb.assignments['auth-test'];
  });
});