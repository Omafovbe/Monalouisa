export { auth as middleware } from '@/lib/auth'

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from '@/lib/auth'

// // Using a more precise pattern to match all admin routes
// // const protectedRoutes = ['/admin'] // This will match /admin and all its subroutes

// // Out of bound for all except admin

// const middleware = async (req: NextRequest) => {
// const session = await auth()
// const path = req.nextUrl.pathname

// Check if it's an admin route and user is not admin
// if (
//   (path === '/admin' || path.startsWith('/admin/')) &&
//   (!session || session.user?.role !== 'ADMIN')
// ) {
//   return NextResponse.redirect(new URL('/unauthorized', req.url))
// }

//   return NextResponse.next()
// }

// export default middleware

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
    '/((?!api|_next|login|register|favicon.ico|about$|^$).*)',
  ],
}
