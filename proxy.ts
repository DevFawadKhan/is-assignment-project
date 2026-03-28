import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy - Replaces the deprecated 'middleware' convention.
 * Handles global authentication redirects at the edge.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Define which pages are part of the authentication flow
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  // 1. Guarding the Home Page: If no session token exists, force redirect to Login
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Preventing Redundant Logins: If a session exists, redirect away from Auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. Continue for all other cases (including API routes and internal assets)
  return NextResponse.next()
}

/**
 * Strategic Matcher Configuration:
 * We precisely target only the root and specific UI routes while excluding
 * internal Next.js assets, static files, and global API routes (which have internal auth).
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (Internal granular API auth handles this)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
