import { describe, expect, it, vi } from 'vitest';
import { currentUser } from '@/lib/authz';
import { GET } from '@/app/api/me/route';
import { Role } from '@/types/roles';

vi.mock('@/lib/authz', () => ({ currentUser: vi.fn() }));

describe('current user route', () => {
  it('returns the current user payload', async () => {
    const user = { username: 'alex', role: Role.ScrumMaster, permissions: { access: true, add: true, edit: true, delete: false } };
    vi.mocked(currentUser).mockResolvedValue(user);
    expect(await (await GET()).json()).toEqual(user);
  });
});