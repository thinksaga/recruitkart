import proxy from '@/lib/proxy';

export const middleware = proxy;

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
    ],
};
