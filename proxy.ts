import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow auth pages without token
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  
  // Check for auth token in localStorage (client-side only)
  // For server-side protection, we'll rely on the client-side auth check
  // This proxy just allows the request through; the page component handles auth
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/chat/:path*',
    '/auth/:path*',
  ],
};
