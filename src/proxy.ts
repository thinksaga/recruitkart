import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { ROLE_ACCESS_MATRIX, PUBLIC_ROUTES, API_PUBLIC_ROUTES } from '@/lib/rbac-matrix';

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Check if it's a public route (UI or API)
    if (
        PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
        API_PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`)) ||
        pathname.startsWith('/_next') || // Next.js internals
        pathname.startsWith('/static') || // Static files
        pathname.includes('.') // Files with extensions (images, etc.)
    ) {
        return NextResponse.next();
    }

    // 2. Verify Token
    const token = request.cookies.get('token')?.value;
    if (!token) {
        // If API request, return 401
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // If UI request, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
    }

    const payload = await verifyJWT(token);
    if (!payload) {
        // Invalid token
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    const userRole = payload.role as string;

    // 3. Check Role Access
    // Find the most specific matching route in the matrix
    // We sort keys by length descending to match specific paths first (e.g. /admin/users before /admin)
    const sortedRoutes = Object.keys(ROLE_ACCESS_MATRIX).sort((a, b) => b.length - a.length);

    const matchedRoute = sortedRoutes.find(route => pathname === route || pathname.startsWith(`${route}/`));

    if (matchedRoute) {
        const allowedRoles = ROLE_ACCESS_MATRIX[matchedRoute];
        if (!allowedRoles.includes(userRole as any)) {
            // Forbidden
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            // Redirect to their dashboard or unauthorized page
            const url = request.nextUrl.clone();
            url.pathname = '/unauthorized'; // You might need to create this page
            return NextResponse.redirect(url);
        }
    }

    // 4. Verification Check
    const verificationStatus = payload.verification_status || payload.verificationStatus; // Handle potential casing differences

    if (verificationStatus === 'PENDING' && pathname !== '/verification-pending') {
        // Allow API calls for pending users (e.g. to upload documents)
        if (pathname.startsWith('/api')) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL('/verification-pending', request.url));
    }

    if (verificationStatus === 'VERIFIED' && pathname === '/verification-pending') {
        return NextResponse.redirect(new URL(getDashboardRoute(userRole), request.url));
    }

    return NextResponse.next();
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
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
