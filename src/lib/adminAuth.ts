import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'akyoto_admin_session'

// The cookie value is the session secret itself (a random string only the
// server knows, set in .env.local as ADMIN_SESSION_SECRET). Anyone who
// doesn't know that secret can't forge a valid cookie.
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies()
  const cookieValue = store.get(ADMIN_COOKIE_NAME)?.value
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !cookieValue) return false
  return cookieValue === secret
}
