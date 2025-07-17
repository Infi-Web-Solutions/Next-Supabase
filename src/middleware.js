import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("want to see session ",session )

  const pathname = req.nextUrl.pathname;

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

 const role = session.user.user_metadata?.role;

  console.log("seeing seesion",role)

  if (pathname.startsWith('/admin') && ![1, 2].includes(role)) {
  return NextResponse.redirect(new URL('/unauthorize', req.url));
}


  return res;
}

export const config = {
  matcher: ['/admin/:path*',
        '/profile',
        '/orders',
        '/document',
        '/learning'
      ],
};
