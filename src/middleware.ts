import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get subdomain (e.g., school1.portal.com -> school1)
  const subdomain = hostname.split('.')[0];

  // Skip middleware for root domain and static files
  if (
    subdomain === 'www' ||
    subdomain === 'localhost:3000' ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api/public')
  ) {
    return NextResponse.next();
  }

  // Rewrite to the school-specific path
  // The app will handle the tenant logic based on this rewrite or by header injection
  const response = NextResponse.next();
  response.headers.set('x-school-subdomain', subdomain);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
