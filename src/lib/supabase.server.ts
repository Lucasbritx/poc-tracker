import { createClient } from '@supabase/supabase-js'

export function createServerSupabaseClient(cookieHeader?: string) {
  // Parse cookies manually
  const cookies = cookieHeader
    ? Object.fromEntries(
        cookieHeader.split('; ').map(cookie => {
          const [key, ...valueParts] = cookie.split('=')
          return [key, valueParts.join('=')]
        })
      )
    : {}
  
  const accessToken = cookies['sb-access-token']
  const refreshToken = cookies['sb-refresh-token']

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  )

  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }

  return supabase
}
