import { describe, expect, it } from 'vitest';
import { createUser, findUser, verifyPassword } from '@/lib/users';

describe('user store', () => {
  it('finds users case-insensitively and verifies their password', () => {
    const username = `unit-${crypto.randomUUID()}`;
    const user = createUser(username, 'correct horse battery');

    expect(findUser(username.toUpperCase())).toBe(user);
    expect(verifyPassword(user, 'correct horse battery')).toBe(true);
    expect(verifyPassword(user, 'incorrect')).toBe(false);
  });
});