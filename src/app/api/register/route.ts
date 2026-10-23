import { NextResponse } from 'next/server';
import { createUser, findUser, isValidPassword, isValidUsername } from '@/lib/users';

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
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
  const name = username.trim();
  if (!isValidUsername(name)) return NextResponse.json({ error: 'Username must be 3-32 letters, numbers, underscores, or hyphens' }, { status: 400 });
  if (!isValidPassword(password)) return NextResponse.json({ error: 'Password must be 8-128 characters' }, { status: 400 });
  if (findUser(name)) return NextResponse.json({ error: 'That username is already taken' }, { status: 409 });
  createUser(name, password);
  return NextResponse.json({ ok: true }, { status: 201 });
}