import decodeJwt from '@/lib/decodeJwt';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const tokenDecoded = decodeJwt(req);
    if (!tokenDecoded) {
        cookies().delete('token');
        return NextResponse.json(
            {
                status: 'fail',
                message: 'please login to access',
            },
            {
                status: 400,
            }
        );
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: tokenDecoded.id,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    return NextResponse.json({
        status: 'success',
        data: {
            user: currentUser,
        },
    });
};
