import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import signToken from '../createToken';
import { cookies } from 'next/headers';

interface LoginField {
    email: string;
    password: string;
}
export const POST = async (req: Request) => {
    const data: LoginField = await req.json();
    const currentUser = await prisma.user.findUnique({
        where: data,
    });

    //1,Check user exist
    if (!currentUser) {
        return NextResponse.json({
            status: 'fails',
            message: 'email or password incorrect',
        });
    }

    //2, create token and send response
    const token = signToken(currentUser.id);
    cookies().set('token', token, {
        expires: Date.now() + 90 * 24 * 60 * 60 * 1000,
    });
    return NextResponse.json({
        status: 'success',
        data: { user: currentUser, token },
    });
};
