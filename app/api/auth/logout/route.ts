import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    cookies().delete('token');
    return NextResponse.redirect(new URL('/auth/login', req.url));
};
