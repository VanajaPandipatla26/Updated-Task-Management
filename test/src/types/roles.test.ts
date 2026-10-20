import { describe, expect, it } from 'vitest';
import { PERMISSION_ROWS, ROLE_LABELS, Role } from '@/types/roles';

describe('role type contracts', () => {
  it('provides a label and permission row for each role and permission', () => {
    expect(Object.keys(ROLE_LABELS)).toHaveLength(Object.values(Role).length);
    expect(PERMISSION_ROWS.map(({ key }) => key)).toEqual(['access', 'add', 'edit', 'delete']);
  });
});