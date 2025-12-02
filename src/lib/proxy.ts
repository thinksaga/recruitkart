import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

// Define protected routes and their allowed roles
const roleRoutes: Record<string, string[]> = {
    '/admin': ['ADMIN'],
    '/tas': ['TAS'],
    '/dashboard/company': ['COMPANY_ADMIN', 'COMPANY_MEMBER'],
    '/candidate': ['CANDIDATE'],
    '/dashboard/finance': ['FINANCIAL_CONTROLLER'],
    '/dashboard/compliance': ['COMPLIANCE_OFFICER'],
    '/dashboard/decision-maker': ['DECISION_MAKER'],
    '/dashboard/interviewer': ['INTERVIEWER'],
    '/operator': ['OPERATOR'],
    '/support': ['SUPPORT'],
};

// Public routes that don't require authentication
const publicRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verification-pending',
    '/',
    '/about',
    '/pricing',
    '/for-companies',
    '/for-recruiters',
    '/api/auth', // Allow auth API calls
];

export default async function proxy(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // 1. Check if route is public
    const isPublic = publicRoutes.some(route => {
        if (route === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(route);
    });
    console.log(`[Middleware] Path: ${pathname}, IsPublic: ${isPublic}, Token: ${token ? 'Present' : 'Missing'}`);

    if (isPublic) {
        return NextResponse.next();
    }

    // 2. Check for token
    if (!token) {
        // Redirect to login if trying to access protected route
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 3. Verify token
    const payload = await verifyJWT(token);
    if (!payload) {
        const response = NextResponse.redirect(new URL('/login', req.url));
        response.cookies.delete('token');
        return response;
    }

    // 4. Check Verification Status
    // If user is PENDING, they should only access /verification-pending (and public routes)
    if (payload.verification_status === 'PENDING' && pathname !== '/verification-pending') {
        return NextResponse.redirect(new URL('/verification-pending', req.url));
    }

    // If user is VERIFIED but tries to go to /verification-pending, redirect to their dashboard
    if (payload.verification_status === 'VERIFIED' && pathname === '/verification-pending') {
        return NextResponse.redirect(new URL(getDashboardRoute(payload.role as string), req.url));
    }

    // 5. Role-Based Access Control
    // Check if the current path matches any role-restricted path
    for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(route)) {
            if (!allowedRoles.includes(payload.role as string)) {
                console.log(`[Middleware] Access Denied: Role ${payload.role} cannot access ${route}`);
                // User is trying to access a route not allowed for their role
                // Redirect to their appropriate dashboard
                return NextResponse.redirect(new URL(getDashboardRoute(payload.role as string), req.url));
            }
            console.log(`[Middleware] Access Granted: Role ${payload.role} matched for ${route}`);
        }
    }

    const response = NextResponse.next();
    response.headers.set('X-Middleware-Run', 'true');
    return response;
}

function getDashboardRoute(role: string): string {
    switch (role) {
        case 'ADMIN': return '/admin';
        case 'TAS': return '/tas';
        case 'COMPANY_ADMIN':
        case 'COMPANY_MEMBER': return '/dashboard/company';
        case 'CANDIDATE': return '/candidate';
        case 'FINANCIAL_CONTROLLER': return '/dashboard/finance';
        case 'COMPLIANCE_OFFICER': return '/dashboard/compliance';
        case 'DECISION_MAKER': return '/dashboard/decision-maker';
        case 'INTERVIEWER': return '/dashboard/interviewer';
        case 'OPERATOR': return '/operator';
        case 'SUPPORT': return '/support';
        default: return '/login';
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (if any)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
