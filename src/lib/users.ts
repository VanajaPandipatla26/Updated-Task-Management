import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { database, persistDatabase } from './database';

export interface User { username: string; salt: string; hash: string; }

const hashPassword = (password: string, salt: string) => scryptSync(password, salt, 32);

function makeUser(username: string, password: string): User {
  const salt = randomBytes(16).toString('hex');
  return { username, salt, hash: hashPassword(password, salt).toString('hex') };
}

export const isValidUsername = (username: string) => /^[a-zA-Z0-9_-]{3,32}$/.test(username);
export const isValidPassword = (password: string) => password.length >= 8 && password.length <= 128;

export const findUser = (username: string): User | undefined => {
  const statement = database.prepare('SELECT username, salt, hash FROM users WHERE username = ?');
  try {
    statement.bind([username]);
    if (!statement.step()) return undefined;
    const row = statement.getAsObject();
    return { username: String(row.username), salt: String(row.salt), hash: String(row.hash) };
  } finally {
    statement.free();
  }
};

export const createUser = (username: string, password: string) => {
  const user = makeUser(username, password);
  const insert = database.prepare('INSERT INTO users (username, salt, hash) VALUES (?, ?, ?)');
  insert.run([user.username, user.salt, user.hash]);
  insert.free();
  persistDatabase();
  return user;
};

export const verifyPassword = (user: User, password: string) => {
  const expected = Buffer.from(user.hash, 'hex');
  const actual = hashPassword(password, user.salt);
  return expected.length === actual.length && timingSafeEqual(actual, expected);
};