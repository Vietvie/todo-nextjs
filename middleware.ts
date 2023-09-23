import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token');
    if (!token) return NextResponse.redirect(new URL('/auth/login', req.url));

    //Redirect If Logined
    const redirectIfHadCookies = ['/auth/login', '/auth/signup'];
    if (redirectIfHadCookies.includes(req.nextUrl.pathname))
        return NextResponse.redirect(new URL('/todo', req.url));
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/todo/:path*', '/auth/:path*'],
};
