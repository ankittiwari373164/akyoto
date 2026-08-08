import { NextResponse } from 'next/server'

const ADMIN_COOKIE_NAME = 'akyoto_admin_session'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.ADMIN_PASSWORD
    const secret = process.env.ADMIN_SESSION_SECRET

    if (!correctPassword || !secret) {
      return NextResponse.json(
        { error: 'Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local.' },
        { status: 500 }
      )
    }

    if (typeof password !== 'string' || password !== correctPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE_NAME, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
