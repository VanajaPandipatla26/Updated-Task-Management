import { beforeEach, describe, expect, it } from 'vitest';
import { PUT } from '@/app/api/roles/route';
import { rolesDb } from '@/lib/rolesDb';
import { Role } from '@/types/roles';

const request = (body: unknown) => new Request('http://localhost/api/roles', { method: 'PUT', body: JSON.stringify(body) });

describe('roles route', () => {
  beforeEach(() => {
    delete rolesDb.assignments.demo;
  });

  it('rejects invalid roles and unknown users', async () => {
    expect((await PUT(request({ role: 'invalid' }))).status).toBe(400);
    expect((await PUT(request({ username: 'missing', role: Role.ProductOwner }))).status).toBe(404);
  });

  it('assigns users and clears subordinate permissions when access is disabled', async () => {
    const response = await PUT(request({
      username: 'demo', role: Role.HumanResource,
      permissions: { access: false, add: true, edit: true, delete: true }, mode: 'create',
    }));
    expect(response.status).toBe(200);
    expect(rolesDb.assignments.demo).toEqual({ username: 'demo', role: Role.HumanResource });
    expect(rolesDb.permissions[Role.HumanResource]).toEqual({ access: false, add: false, edit: false, delete: false });
    expect((await PUT(request({ username: 'demo', role: Role.Developer }))).status).toBe(409);
    delete rolesDb.assignments.demo;
  });
});