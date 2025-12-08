// export { auth as middleware } from '@/lib/auth'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Out of bound for all except admin
// Note: We avoid using auth() here because it uses Prisma which requires Node.js runtime
// Middleware runs in Edge Runtime, and Prisma Client uses Node.js modules (node:path, etc.)
// The actual role check will be handled in the page components which run in Node.js runtime

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname
  console.log(path)

  // Basic path protection - actual role-based auth is handled in page components
  // This avoids the Edge Runtime incompatibility with Prisma Client
  if (path === '/admin' || path.startsWith('/admin/')) {
    // Check if user has a session cookie (basic check)
    const hasSession =
      req.cookies.get('authjs.session-token')?.value ||
      req.cookies.get('__Secure-authjs.session-token')?.value

    // If no session, redirect to login
    // The page component will handle the actual role check
    if (!hasSession) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export default middleware

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token
//     const path = req.nextUrl.pathname

//     // Public routes that don't require authentication
//     const publicRoutes = ['/', '/about']

//     if (publicRoutes.includes(path)) {
//       return NextResponse.next()
//     }

//     // Allow access to auth-related pages
//     if (path.startsWith('/login') || path.startsWith('/register')) {
//       return NextResponse.next()
//     }

//     // Admin has access to all routes
//     if (token?.role === 'ADMIN') {
//       return NextResponse.next()
//     }

//     // Teacher can only access teacher routes
//     if (token?.role === 'TEACHER') {
//       if (!path.startsWith('/teacher')) {
//         return NextResponse.redirect(new URL('/teacher', req.url))
//       }
//     }

//     // Student can only access student routes
//     if (token?.role === 'STUDENT') {
//       if (!path.startsWith('/student')) {
//         return NextResponse.redirect(new URL('/student', req.url))
//       }
//     }

//     return NextResponse.next()
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// )

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - auth-related paths (/login, /register)
     * - api routes (/api/*)
     * - static files (/_next/*, /favicon.ico, etc.)
     */
    // '/((?!api|_next|login|register|favicon.ico|public|about$|avatars$).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
