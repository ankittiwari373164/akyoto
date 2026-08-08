import { NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'akyoto_admin_session'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE_NAME, '', { path: '/', maxAge: 0 })
  return response
}
