import { createClient } from '@supabase/supabase-js'

// SERVER-ONLY client. Uses the service role key (never exposed to the
// browser — no NEXT_PUBLIC_ prefix) so it bypasses Row Level Security.
// Only ever import this inside app/api/admin/** route handlers, which are
// themselves gated by the admin session cookie (see lib/adminAuth.ts).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
