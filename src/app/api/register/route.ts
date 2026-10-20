import { NextResponse } from 'next/server';
import { createUser, findUser } from '@/lib/users';

export async function POST(req: Request) {
  const { username = '', password = '' } = (await req.json()) as { username?: string; password?: string };
  const name = username.trim();
  if (name.length < 3) return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  if (findUser(name)) return NextResponse.json({ error: 'That username is already taken' }, { status: 409 });
  createUser(name, password);
  return NextResponse.json({ ok: true }, { status: 201 });
}