import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    console.log('logout');
    cookies().delete('token');
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
};
