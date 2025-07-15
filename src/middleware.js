import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

// /**
//  * Middleware to protect routes based on Supabase session and user role.
//  */
export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("want to see session ",session )

  const pathname = req.nextUrl.pathname;

  // ✅ 1. Redirect to /login if not logged in
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

 const role = session.user.user_metadata?.role;


 

  console.log("seeing seesion",role)

  // ✅ 2. Protect /admin routes (only admin and staff allowed)
  if (pathname.startsWith('/admin') && ![1, 2].includes(role)) {
  return NextResponse.redirect(new URL('/unauthorized', req.url));
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



// // const permissions = session.user.user_metadata?.permissions || [];

// // if (pathname === '/admin/products' && !permissions.includes('products.view')) {
// //   return NextResponse.redirect(new URL('/unauthorized', req.url));
// // }
