import { NextResponse } from 'next/server';
import { findUser, isValidPassword, isValidUsername, verifyPassword } from '@/lib/users';
import { createSession, sessionCookieOptions } from '@/lib/session';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  const { username, password } = body as { username?: unknown; password?: unknown };
  if (typeof username !== 'string' || typeof password !== 'string')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  const name = username.trim();
  if (!isValidUsername(name) || !isValidPassword(password))
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  const user = findUser(name);
  if (!user || !verifyPassword(user, password))
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth', createSession(user.username), sessionCookieOptions);
  return res;
}
