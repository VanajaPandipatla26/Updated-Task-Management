import { NextResponse } from 'next/server';
import { findUser, verifyPassword } from '@/lib/users';

export async function POST(req: Request) {
  const { username = '', password = '' } = (await req.json()) as { username?: string; password?: string };
  const user = findUser(username.trim());
  if (!user || !verifyPassword(user, password))
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('auth', user.username, { httpOnly: true, path: '/', maxAge: 60 * 60 * 8 });
  return res;
}
