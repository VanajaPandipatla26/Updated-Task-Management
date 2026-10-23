import { NextRequest, NextResponse } from 'next/server';
import { readSession } from '@/lib/session';

export function proxy(req: NextRequest) {
  const username = readSession(req.cookies.get('auth')?.value);
  const pathname = req.nextUrl.pathname;
  const isPublicApi = ['/api/login', '/api/register', '/api/logout'].includes(pathname);
  if (pathname.startsWith('/api/')) {
    if (!username && !isPublicApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.next();
  }

  const isLogin = ['/login', '/register'].includes(pathname);
  if (!username && !isLogin) return NextResponse.redirect(new URL('/login', req.url));
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next|favicon.ico).*)'] };