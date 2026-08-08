import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_COOKIE_NAME = 'akyoto_admin_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Never gate the login page itself or the login/logout API endpoints.
  if (
    pathname === '/admin-login' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout'
  ) {
    return NextResponse.next()
  }

  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdminArea) return NextResponse.next()

  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value
  const secret = process.env.ADMIN_SESSION_SECRET

  const authorized = Boolean(secret) && cookieValue === secret

  if (!authorized) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin-login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
