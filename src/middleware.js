import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("chekcing  Session:", session);

  if (!session) {
    console.warn("🔒 No session found. Redirecting to login...");
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const role = session.user.user_metadata?.role || null;
  const organization_id = session.user.user_metadata?.organization_id || null;

  console.log("👤 Role:", role);
  console.log("🏢 Organization ID:", organization_id);

  let slug = null;
  if (organization_id) {
    const { data: org, error } = await supabase
      .from('organizations')
      .select('slug')
      .eq('id', organization_id)
      .single();

    if (error) {
      console.error("❌ Error fetching organization:", error);
    }

    slug = org?.slug || null;
  }

  console.log("🔗 Expected Slug:", slug);

  const host = req.headers.get('host') || '';
  const subdomain = host.split('.')[0];
  console.log("🌐 Subdomain from host:", subdomain);

  const pathname = req.nextUrl.pathname;

  
  if (pathname.startsWith('/admin') && ![1, 2].includes(role)) {
  return NextResponse.redirect(new URL('/unauthorize', req.url));
}

  if (slug && subdomain !== slug) {
    console.warn(`❗ Subdomain mismatch: got '${subdomain}', expected '${slug}'`);
    return NextResponse.redirect(new URL('/unauthorize', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile',
    '/orders',
    '/document',
    '/learning'
  ],
};
