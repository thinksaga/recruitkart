import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function proxy(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Only protect /dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Trust Gate: Check Verification Status
        // Allow access to /verification-pending (not protected by this block usually, but good to be safe)
        // Actually /verification-pending is NOT under /dashboard, so it's fine.
        // But if we are IN /dashboard, we must be verified.
        if (payload.verificationStatus === 'PENDING') {
            return NextResponse.redirect(new URL('/verification-pending', req.url));
        }

        // Role Guard: TAS cannot access Company routes
        if (payload.role === 'TAS' && pathname.startsWith('/dashboard/company')) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        // Role Guard: Company cannot access TAS routes
        if (
            (payload.role === 'COMPANY_ADMIN' || payload.role === 'COMPANY_MEMBER') &&
            pathname.startsWith('/dashboard/tas')
        ) {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    return NextResponse.next();
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
