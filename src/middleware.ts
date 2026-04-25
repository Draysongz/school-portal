import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth/session';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Resolve Tenant
  const subdomain = hostname.split('.')[0];
  const isRootDomain =
    subdomain === 'www' ||
    subdomain === 'localhost:3000' ||
    !subdomain;

  // 2. Authentication Check
  const sessionToken = request.cookies.get('session')?.value;
  const session = sessionToken ? await decrypt(sessionToken) : null;

  // 3. Authorization & Routing
  const isAuthPage = url.pathname.startsWith('/login') || url.pathname.startsWith('/onboarding');
  const isSuperAdminPage = url.pathname.startsWith('/super-admin');
  const isAdminPage = url.pathname.startsWith('/admin');

  // If user is not logged in and trying to access protected pages
  if (!session && !isAuthPage && !url.pathname.startsWith('/api/public') && !url.pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and trying to access login page
  if (session && isAuthPage) {
    if (session.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // RBAC checks
  if (isSuperAdminPage && session?.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminPage && !['ADMIN', 'SUPER_ADMIN'].includes(session?.role as string)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Inject headers for use in app
  const response = NextResponse.next();
  if (subdomain && !isRootDomain) {
    response.headers.set('x-school-subdomain', subdomain);
  }
  if (session?.schoolId) {
    response.headers.set('x-school-id', session.schoolId as string);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
  ],
};
