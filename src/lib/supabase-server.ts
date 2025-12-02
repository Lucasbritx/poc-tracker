import { createServerClient } from "@supabase/ssr";

export function supabaseServer(request: Request) {
  const cookieHeader = request?.headers.get('Cookie') ?? '';
  const responseCookies: string[] = [];
  
  return createServerClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieHeader
            .split(';')
            .map(c => c.trim())
            .filter(Boolean)
            .map(cookie => {
              const [name, ...rest] = cookie.split('=');
              return { name, value: rest.join('=') };
            });
        },
        setAll(cookiesToSet) {
          // Store cookies to be set in response
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookie = `${name}=${value}`;
            const opts = [];
            if (options?.maxAge) opts.push(`Max-Age=${options.maxAge}`);
            if (options?.path) opts.push(`Path=${options.path}`);
            if (options?.domain) opts.push(`Domain=${options.domain}`);
            if (options?.httpOnly) opts.push('HttpOnly');
            if (options?.secure) opts.push('Secure');
            if (options?.sameSite) opts.push(`SameSite=${options.sameSite}`);
            
            responseCookies.push(opts.length ? `${cookie}; ${opts.join('; ')}` : cookie);
          });
        },
      },
    }
  );
}