import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const authed = req.cookies.has('auth');
  const isLogin = ['/login', '/register'].includes(req.nextUrl.pathname);
  if (!authed && !isLogin) return NextResponse.redirect(new URL('/login', req.url));
  return NextResponse.next();
}
export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] };
