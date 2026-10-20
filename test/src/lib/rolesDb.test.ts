import { describe, expect, it } from 'vitest';
import { roleOf, rolesDb } from '@/lib/rolesDb';
import { Role } from '@/types/roles';

describe('roles database', () => {
  it('defaults unknown users to Developer and applies assigned roles case-insensitively', () => {
    expect(roleOf('unknown-user')).toBe(Role.Developer);
    rolesDb.assignments['unit-test-user'] = { username: 'Unit-Test-User', role: Role.ProductOwner };

    expect(roleOf('UNIT-TEST-USER')).toBe(Role.ProductOwner);
    delete rolesDb.assignments['unit-test-user'];
  });
});