import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export interface User { username: string; salt: string; hash: string; }

const hashPassword = (password: string, salt: string) => scryptSync(password, salt, 32);

function makeUser(username: string, password: string): User {
  const salt = randomBytes(16).toString('hex');
  return { username, salt, hash: hashPassword(password, salt).toString('hex') };
}

// In-memory user store (resets on server restart). Seeded with one demo account.
const g = globalThis as unknown as { __users?: User[] };
export const users: User[] = (g.__users ??= [makeUser('demo', 'password123')]);

export const findUser = (username: string) =>
  users.find((u) => u.username.toLowerCase() === username.toLowerCase());

export const createUser = (username: string, password: string) => {
  const user = makeUser(username, password);
  users.push(user);
  return user;
};

export const verifyPassword = (user: User, password: string) =>
  timingSafeEqual(hashPassword(password, user.salt), Buffer.from(user.hash, 'hex'));